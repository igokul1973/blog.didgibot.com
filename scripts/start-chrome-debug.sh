#!/bin/bash

# Script to start Chrome with debugging and auto-update MCP config
echo "🚀 Starting Chrome with remote debugging, you have to start it from the project's root..."

# Start Chrome with debugging and capture output
echo "🚀 Starting Chrome with remote debugging..."
CHROME_OUTPUT=$(mktemp)
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9250 --remote-debugging-address=0.0.0.0 --user-data-dir=/Users/igor/chrome-debug > "$CHROME_OUTPUT" 2>&1 &

# Wait for Chrome to start and get the browser ID
echo "⏳ Waiting for Chrome to start..."
sleep 4

# Get the browser ID from Chrome's startup output
echo "🔍 Extracting browser ID from Chrome output..."
BROWSER_ID=$(grep "DevTools listening on" "$CHROME_OUTPUT" | grep -o "devtools/browser/[^']*" | head -1 | cut -d'/' -f3)
rm "$CHROME_OUTPUT"

if [ -n "$BROWSER_ID" ]; then
    echo "🔍 Browser ID: $BROWSER_ID"

    echo "/n"
    
    # Update the MCP config
    CONFIG_FILE=".windsurf/mcp_config.json"

    echo "Adding the above browser ID to the config file"
    
    # Update the browser ID in the config
    sed -i '' "s|ws://host.docker.internal:9250/devtools/browser/[^\"]*|ws://host.docker.internal:9250/devtools/browser/$BROWSER_ID|g" "$CONFIG_FILE"
    
    echo "✅ Updated MCP config with new browser ID"
    echo "🔄 Please restart your IDE/MCP server to use the new connection"
else
    echo "❌ Could not find browser ID"
fi
