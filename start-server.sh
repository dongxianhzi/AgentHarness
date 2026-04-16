#!/bin/bash
cd /home/ubuntu/dongxianzhi/AgentHarness/server && \
MULTICA_SERVER_URL=ws://localhost:8080/ws \
JWT_SECRET="your-super-secret-jwt-secret-change-me-in-production" \
go run ./cmd/server/main.go
