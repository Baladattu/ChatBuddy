# Kubernetes Deployment Guide

This directory contains all the Kubernetes manifests for deploying ChatBuddy to production.

## Architecture

```
┌─────────────────────────┐
│  chatbuddy.duckdns.org  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Cloudflare Tunnel      │  (2 replicas)
│  (cloudflared)          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Frontend Service       │  (nginx, 2 replicas)
│  chatbuddy-frontend:80  │
└───────────┬─────────────┘
            │
            ▼ (API/WebSocket)
┌─────────────────────────┐
│  Backend Service        │  (Node.js, 2 replicas)
│  chatbuddy-backend:5001 │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  External MongoDB       │  (User's URI)
└─────────────────────────┘
```

## Prerequisites

- Kubernetes cluster with `kubectl` access
- Docker Hub account
- Cloudflare account with named tunnel
- MongoDB database (external)
- GitHub repository with Actions enabled

## Deployment files

| File | Description |
|------|-------------|
| `00-namespace.yaml` | Creates `chat-app` namespace |
| `01-secrets.yaml` | Template for application secrets |
| `02-backend-deployment.yaml` | Backend  Node.js deployment |
| `03-backend-service.yaml` | Backend ClusterIP service |
| `04-frontend-deployment.yaml` | Frontend nginx deployment |
| `05-frontend-service.yaml` | Frontend ClusterIP service |
| `06-cloudflared-tunnel.yaml` | Cloudflare Tunnel for external access |

## First-Time Manual Setup

### 1. Configure DuckDNS

Update your DuckDNS subdomain to point to the Cloudflare Tunnel:

1. Log into [DuckDNS](https://www.duckdns.org)
2. Find your subdomain: `chatbuddy`
3. Set the IP to the Cloudflare Tunnel IP: `<TUNNEL_CNAME>.cfargotunnel.com`
   - Alternatively, create a CNAME record pointing to: `8c19d49e-c5f7-4d19-a8dc-c6b4de0e26a1.cfargotunnel.com`

### 2. Add GitHub Secrets

Go to your repository: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `DOCKERHUB_USERNAME` | ✅ Already set | - |
| `DOCKERHUB_TOKEN` | ✅ Already set | - |
| `KUBE_CONFIG` | Base64-encoded kubeconfig | See instructions below |
| `MONGODB_URI` | MongoDB connection string | Your external MongoDB URI |
| `JWT_SECRET` | Random secret for JWT | Generate: `openssl rand -hex 32` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (optional) | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key (optional) | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (optional) | From Cloudinary dashboard |

#### Generate KUBE_CONFIG

```bash
# Get your kubeconfig and encode it
cat ~/.kube/config | base64 -w 0

# Copy the output and add it as KUBE_CONFIG secret in GitHub
```

### 3. Update Secrets File

Edit `k8s/01-secrets.yaml` and replace:
- `REPLACE_WITH_YOUR_MONGODB_URI` with your actual MongoDB URI
- `REPLACE_WITH_RANDOM_SECRET_STRING` with a random string (or use the one from GitHub secrets)

**Note**: This file is for local/manual deployment only. GitHub Actions injects secrets automatically.

### 4 Deploy (Manual - First Time Only)

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n chat-app
kubectl get svc -n chat-app

# View logs
kubectl logs -f -l app=chatbuddy-backend -n chat-app
kubectl logs -f -l app=chatbuddy-frontend -n chat-app
kubectl logs -f -l app=cloudflared -n chat-app
```

## Automated Deployment (GitHub Actions)

After the first-time setup, all deployments are automated:

1. **Make changes** to your code
2. **Commit and push** to `main` branch
3. **GitHub Actions automatically**:
   - Builds Docker images
   - Pushes to Docker Hub
   - Deploys to Kubernetes
   - Verifies rollout

View workflow status: **Actions** tab in your GitHub repository

## Accessing the Application

- **Production URL**: [https://chatbuddy.duckdns.org](https://chatbuddy.duckdns.org)
- **HTTP**: http://chatbuddy.duckdns.org (redirects to HTTPS via Cloudflare)

## Troubleshooting

### Backend CrashLoopBackOff

```bash
# Check logs
kubectl logs -l app=chatbuddy-backend -n chat-app --tail=50

# Common issues:
# - MongoDB URI incorrect
# - MongoDB not accessible
# - Missing JWT_SECRET
```

### Frontend not loading

```bash
# Check if pods are running
kubectl get pods -n chat-app

# Check frontend logs
kubectl logs -l app=chatbuddy-frontend -n chat-app
```

### Cloudflare Tunnel not connecting

```bash
# Check tunnel logs
kubectl logs -l app=cloudflared -n chat-app

# Verify tunnel is active in Cloudflare dashboard
# https://dash.cloudflare.com/
```

### Can't access via domain

1. **Check DuckDNS**: Ensure chatbuddy.duckdns.org points to Cloudflare Tunnel CNAME
2. **Wait for DNS propagation**: Can take 5-10 minutes
3. **Test Cloudflare Tunnel**: Check if tunnel is connected in Cloudflare dashboard

## Scaling

```bash
# Scale backend
kubectl scale deployment chatbuddy-backend --replicas=3 -n chat-app

# Scale frontend
kubectl scale deployment chatbuddy-frontend --replicas=3 -n chat-app

# Scale Cloudflare Tunnel
kubectl scale deployment cloudflared-tunnel --replicas=3 -n chat-app
```

## Updating the Application

Changes are automatically deployed via GitHub Actions. To manually update:

```bash
# Update backend image
kubectl set image deployment/chatbuddy-backend backend=kbaladattu/chatbuddy-backend:latest -n chat-app

# Update frontend image
kubectl set image deployment/chatbuddy-frontend frontend=kbaladattu/chatbuddy-frontend:latest -n chat-app

# Watch rollout
kubectl rollout status deployment/chatbuddy-backend -n chat-app
kubectl rollout status deployment/chatbuddy-frontend -n chat-app
```

## Cleanup

```bash
# Delete all resources
kubectl delete namespace chat-app

# Delete Cloudflare Tunnel
cloudflared tunnel delete chatbuddy-prod
```
