#!/bin/bash
set -e

WINDSURF_CONFIG_DIR="/root/.codeium/windsurf"
MCP_SOURCE="$(find /workspaces -name 'mcp_config.json' -path '*/.windsurf/*' 2>/dev/null | head -1)"

mkdir -p "$WINDSURF_CONFIG_DIR"

if [ -n "$MCP_SOURCE" ]; then
  cp -f "$MCP_SOURCE" "$WINDSURF_CONFIG_DIR/mcp_config.json"
  echo "✓ MCP config installed from $MCP_SOURCE"
else
  echo "✗ mcp_config.json not found under /workspaces"
  exit 1
fi