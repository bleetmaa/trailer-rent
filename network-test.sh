#!/bin/bash

# Trailer Rent - Network Configuration Test Script
# Run this script to verify your network setup

echo "🔍 Trailer Rent - Network Configuration Test"
echo "============================================="

# Get public IP
echo "📡 Getting your public IP..."
PUBLIC_IP=$(curl -s https://ipinfo.io/ip || curl -s https://icanhazip.com || echo "Unable to detect")
echo "Your public IP: $PUBLIC_IP"

# Check NodePort services
echo ""
echo "🚀 Checking Kubernetes services..."
kubectl get svc ingress-nginx-controller -n ingress-nginx

# Get NodePorts
HTTP_PORT=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.spec.ports[?(@.name=="http")].nodePort}')
HTTPS_PORT=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')

echo ""
echo "📋 Port Forwarding Configuration Needed:"
echo "========================================"
echo "Router Configuration:"
echo "External Port 80 → 192.168.1.66:$HTTP_PORT"
echo "External Port 443 → 192.168.1.66:$HTTPS_PORT"
echo ""

echo "🌐 DNS Configuration Options:"
echo "============================="
echo "Option 1 - Real Domain DNS Records:"
echo "A record: @ → $PUBLIC_IP"
echo "A record: dev → $PUBLIC_IP"
echo "A record: qa → $PUBLIC_IP"
echo ""

echo "Option 2 - Windows Hosts File (for testing):"
echo "Add to C:\\Windows\\System32\\drivers\\etc\\hosts:"
echo "$PUBLIC_IP trailerrent.se"
echo "$PUBLIC_IP dev.trailerrent.se"
echo "$PUBLIC_IP qa.trailerrent.se"
echo ""

echo "🔗 Access URLs (after DNS/port forwarding setup):"
echo "=================================================="
echo "Development: https://dev.trailerrent.se"
echo "Production:  https://trailerrent.se"
echo ""
echo "Or direct access via IP:"
echo "Development: https://$PUBLIC_IP (with proper hosts file)"
echo ""

echo "🧪 Test Commands:"
echo "================"
echo "Test external HTTP access:"
echo "curl -H 'Host: dev.trailerrent.se' http://$PUBLIC_IP"
echo ""
echo "Test external HTTPS access:"
echo "curl -H 'Host: dev.trailerrent.se' https://$PUBLIC_IP -k"
echo ""

echo "✅ Test completed! Configure your router and DNS as shown above."
