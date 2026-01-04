#!/bin/bash
# Quick script to update the README with the current Cloudflare Quick Tunnel URL

# Get the current tunnel URL
TUNNEL_URL=$(kubectl logs -n chat-app $(kubectl get pods -n chat-app -l app=cloudflared -o name | head -1) 2>/dev/null | grep "trycloudflare.com" | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' | head -1)

if [ -z "$TUNNEL_URL" ]; then
    echo "❌ Could not find tunnel URL. Make sure the cloudflared pod is running."
    exit 1
fi

echo "✅ Found tunnel URL: $TUNNEL_URL"

# Update README.md
sed -i "s|https://[a-z0-9-]*\.trycloudflare\.com|$TUNNEL_URL|g" README.md

echo "✅ Updated README.md with current tunnel URL"
echo ""
echo "🚀 Next steps:"
echo "   git add README.md"
echo "   git commit -m 'chore: Update live demo URL'"
echo "   git push"
