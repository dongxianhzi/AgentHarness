package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/multica-ai/multica/server/internal/cli"
	"github.com/spf13/cobra"
)

var homeDir string

func init() {
	homeDir = homeDir
	if homeDir == "" || homeDir == "/root" {
		homeDir = "/home/ubuntu"
	}
}

type Instance struct {
	ID        string            `json:"id"`
	User      string            `json:"user"`
	Workspace string            `json:"workspace"`
	PID       int               `json:"pid"`
	Profile   string            `json:"profile"`
	Status    string            `json:"status"`
	StartedAt time.Time         `json:"started_at"`
	Env       map[string]string `json:"env"`
}

type InstanceManager struct {
	mu        sync.RWMutex
	instances map[string]*Instance
	statesDir string
}

var manager *InstanceManager

func NewInstanceManager(statesDir string) *InstanceManager {
	return &InstanceManager{
		instances: make(map[string]*Instance),
		statesDir: statesDir,
	}
}

func (m *InstanceManager) saveState() error {
	m.mu.Lock()
	defer m.mu.Unlock()

	data, err := json.MarshalIndent(m.instances, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal: %w", err)
	}
	return os.WriteFile(filepath.Join(m.statesDir, "instances.json"), data, 0644)
}

func (m *InstanceManager) loadState() error {
	data, err := os.ReadFile(filepath.Join(m.statesDir, "instances.json"))
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}
	return json.Unmarshal(data, &m.instances)
}

func (m *InstanceManager) Start(user, workspace, profile, token, serverURL string, env map[string]string) (*Instance, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	instanceID := uuid.New().String()

	if err := m.ensureAuthenticated(profile, token, serverURL); err != nil {
		return nil, fmt.Errorf("authentication: %w", err)
	}

	execPath, err := os.Executable()
	if err != nil {
		return nil, fmt.Errorf("get executable: %w", err)
	}

	daemonPIDPath := filepath.Join(homeDir, ".multica", "profiles", profile, "daemon.log")

	cmd := exec.Command("bash", "-c", fmt.Sprintf("nohup %s --profile %s daemon start >> %s 2>&1 &", execPath, profile, daemonPIDPath))
	cmd.Env = os.Environ()

	if err := cmd.Start(); err != nil {
		return nil, fmt.Errorf("start daemon: %w", err)
	}

	go func() { cmd.Wait() }()

	time.Sleep(time.Millisecond * 500)

	pidPath := filepath.Join(homeDir, ".multica", "profiles", profile, "daemon.pid")
	pidData, _ := os.ReadFile(pidPath)
	var pid int
	if len(pidData) > 0 {
		fmt.Sscanf(string(pidData), "%d", &pid)
	}

	instance := &Instance{
		ID:        instanceID,
		User:      user,
		Workspace: workspace,
		PID:       pid,
		Profile:   profile,
		Status:    "running",
		StartedAt: time.Now(),
		Env:       env,
	}

	m.instances[instanceID] = instance

	go m.saveState()

	fmt.Printf("Started daemon for user %s (PID: %d)\n", user, pid)
	return instance, nil
}

func (m *InstanceManager) ensureAuthenticated(profile, token, serverURL string) error {
	cfg, err := cli.LoadCLIConfigForProfile(profile)
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}

	validToken := token
	if validToken == "" {
		validToken = cfg.Token
	}

	if validToken != "" {
		if !strings.HasPrefix(validToken, "mul_") {
			validToken = "mul_" + validToken
		}

		client := cli.NewAPIClient(serverURL, "", validToken)
		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()

		var me struct {
			Name  string `json:"name"`
			Email string `json:"email"`
		}
		if err := client.GetJSON(ctx, "/api/me", &me); err == nil {
			fmt.Fprintf(os.Stderr, "Authenticated as %s (%s)\n", me.Name, me.Email)
			cfg.Token = validToken
			cfg.ServerURL = serverURL
			cli.SaveCLIConfigForProfile(cfg, profile)
			return nil
		}
		fmt.Fprintf(os.Stderr, "Token invalid/expired\n")
	}

	return fmt.Errorf("no valid token provided, use --token flag or MULTICA_TOKEN env")
}

func (m *InstanceManager) Stop(instanceID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	instance, ok := m.instances[instanceID]
	if !ok {
		return fmt.Errorf("instance not found: %s", instanceID)
	}

	proc, err := os.FindProcess(instance.PID)
	if err != nil {
		return fmt.Errorf("find process: %w", err)
	}

	proc.Kill()

	instance.Status = "stopped"
	return m.saveState()
}

func (m *InstanceManager) StopByUser(user string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	for _, inst := range m.instances {
		if inst.User == user && inst.Status == "running" {
			proc, _ := os.FindProcess(inst.PID)
			proc.Kill()
			inst.Status = "stopped"
		}
	}
	return m.saveState()
}

func (m *InstanceManager) List() []*Instance {
	m.mu.RLock()
	defer m.mu.RUnlock()

	list := make([]*Instance, 0, len(m.instances))
	for _, inst := range m.instances {
		list = append(list, inst)
	}
	return list
}

var ctrlCmd = &cobra.Command{
	Use:   "ctrl",
	Short: "Manage multiple user instances",
}

var ctrlStartCmd = &cobra.Command{
	Use:   "start",
	Short: "Start a CLI instance for a user",
	RunE:  runCtrlStart,
}

var ctrlStopCmd = &cobra.Command{
	Use:   "stop",
	Short: "Stop a CLI instance",
	RunE:  runCtrlStop,
}

var ctrlListCmd = &cobra.Command{
	Use:   "list",
	Short: "List all running instances",
	RunE:  runCtrlList,
}

func init() {
	f := ctrlStartCmd.Flags()
	f.String("user", "", "User identifier (required)")
	f.String("workspace", "", "Workspace ID (required)")
	f.String("profile", "", "Profile name (defaults to user)")
	f.String("token", "", "Authentication token (env: MULTICA_TOKEN)")
	f.String("server-url", "", "Server URL (env: MULTICA_SERVER_URL)")
	f.StringToString("env", nil, "Environment variables")

	f = ctrlStopCmd.Flags()
	f.String("user", "", "User to stop (optional)")
	f.String("instance-id", "", "Instance ID to stop")

	ctrlCmd.AddCommand(ctrlStartCmd)
	ctrlCmd.AddCommand(ctrlStopCmd)
	ctrlCmd.AddCommand(ctrlListCmd)
	rootCmd.AddCommand(ctrlCmd)
}

func runCtrlStart(cmd *cobra.Command, args []string) error {
	user, _ := cmd.Flags().GetString("user")
	workspace, _ := cmd.Flags().GetString("workspace")
	profile, _ := cmd.Flags().GetString("profile")
	token, _ := cmd.Flags().GetString("token")
	serverURL, _ := cmd.Flags().GetString("server-url")
	env, _ := cmd.Flags().GetStringToString("env")

	if user == "" || workspace == "" {
		return fmt.Errorf("--user and --workspace are required")
	}

	if profile == "" {
		profile = user
	}

	if token == "" {
		token = os.Getenv("MULTICA_TOKEN")
	}

	if token == "" && profile != "" {
		cfgPath := filepath.Join(homeDir, ".multica", "profiles", profile, "config.json")
		data, err := os.ReadFile(cfgPath)
		if err == nil {
			var savedCfg struct {
				Token string `json:"token"`
			}
			json.Unmarshal(data, &savedCfg)
			if savedCfg.Token != "" {
				token = savedCfg.Token
				fmt.Fprintf(os.Stderr, "Using token from config: %s\n", cfgPath)
			}
		}
	}

	if serverURL == "" {
		serverURL = os.Getenv("MULTICA_SERVER_URL")
		if serverURL == "" {
			serverURL = "http://localhost:8080"
		}
	}

	homeDir := homeDir
	if homeDir == "" || homeDir == "/root" {
		homeDir = "/home/ubuntu"
	}

	filepath.Join(homeDir, ".multica", "profiles", profile, "daemon.log")
	filepath.Join(homeDir, ".multica", "profiles", profile, "daemon.pid")
	statesDir := filepath.Join(homeDir, ".multica", "instances")
	if err := os.MkdirAll(statesDir, 0755); err != nil {
		return fmt.Errorf("mkdir: %w", err)
	}

	manager = NewInstanceManager(statesDir)
	manager.loadState()

	fmt.Fprintf(os.Stderr, "Starting instance for user %s (profile: %s)\n", user, profile)

	instance, err := manager.Start(user, workspace, profile, token, serverURL, env)
	if err != nil {
		return fmt.Errorf("start instance: %w", err)
	}

	fmt.Printf("Started daemon for user %s (PID: %d)\n", user, instance.PID)
	return nil
}

func runCtrlStop(cmd *cobra.Command, args []string) error {
	user, _ := cmd.Flags().GetString("user")
	instanceID, _ := cmd.Flags().GetString("instance-id")

	statesDir := filepath.Join(homeDir, ".multica", "instances")
	manager = NewInstanceManager(statesDir)
	manager.loadState()

	if user != "" {
		if err := manager.StopByUser(user); err != nil {
			return err
		}
		fmt.Printf("Stopped all instances for user %s\n", user)
	} else if instanceID != "" {
		if err := manager.Stop(instanceID); err != nil {
			return err
		}
		fmt.Printf("Stopped instance %s\n", instanceID)
	}

	return nil
}

func runCtrlList(cmd *cobra.Command, args []string) error {
	profilesDir := filepath.Join(homeDir, ".multica", "profiles")
	entries, err := os.ReadDir(profilesDir)
	if err != nil {
		fmt.Println("No running instances")
		return nil
	}

	fmt.Printf("%-36s %-36s %-20s %s\n", "USER", "WORKSPACE", "PROFILE", "PID")
	fmt.Println(strings.Repeat("-", 100))

	count := 0
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		profileName := entry.Name()

		cfgPath := filepath.Join(profilesDir, profileName, "config.json")
		cfgData, _ := os.ReadFile(cfgPath)
		var cfg struct {
			WorkspaceID string `json:"workspace_id"`
		}
		json.Unmarshal(cfgData, &cfg)

		pidPath := filepath.Join(profilesDir, profileName, "daemon.pid")
		pidData, err := os.ReadFile(pidPath)
		if err != nil || len(pidData) == 0 {
			continue
		}
		var pid int
		fmt.Sscanf(string(pidData), "%d", &pid)
		if pid > 0 {
			proc, _ := os.FindProcess(pid)
			if proc != nil && proc.Pid == pid {
				user := profileName
				ws := cfg.WorkspaceID
				if ws == "" {
					ws = "N/A"
				}
				fmt.Printf("%-36s %-36s %-20s %d %s\n", user, ws, profileName, pid, "running")
				count++
			}
		}
	}

	if count == 0 {
		fmt.Println("No running instances")
	}
	return nil
}
