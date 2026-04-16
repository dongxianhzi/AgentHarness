package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var runCmd = &cobra.Command{
	Use:   "run",
	Short: "Run the daemon in foreground (used by ctrl start)",
	RunE:  runRun,
}

func init() {
	rootCmd.AddCommand(runCmd)
}

func runRun(cmd *cobra.Command, args []string) error {
	// Get profile from flag
	profile := cmd.Flag("profile").Value.String()
	if profile == "" {
		profile = "default"
	}

	// Get environment variables
	serverURL := os.Getenv("MULTICA_SERVER_URL")
	workspaceID := os.Getenv("MULTICA_WORKSPACE_ID")
	userID := os.Getenv("MULTICA_USER")

	fmt.Printf("Starting daemon with profile=%s, server=%s, workspace=%s, user=%s\n",
		profile, serverURL, workspaceID, userID)

	// Run daemon in foreground mode
	daemonCmd.Flags().Set("foreground", "true")
	return runDaemonForeground(daemonCmd)
}
