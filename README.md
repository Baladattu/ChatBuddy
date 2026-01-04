# ✨ Full Stack Realtime Chat App ✨

[![Deploy Status](https://github.com/Baladattu/ChatBuddy/actions/workflows/deploy.yaml/badge.svg)](https://github.com/Baladattu/ChatBuddy/actions/workflows/deploy.yaml)

## 🌐 Live Demo

**Production**: [https://uncertainty-oldest-holes-endorsed.trycloudflare.com](https://uncertainty-oldest-holes-endorsed.trycloudflare.com)

> **Note**: Using Cloudflare Quick Tunnel. URL may change on pod restart. Run `./update-url.sh` to update this README with the latest URL.

## ✨ Highlights

- 🌟 **Tech stack**: MERN + Socket.io + TailwindCSS + Daisy UI
- 🎃 **Authentication & Authorization** with JWT
- 👾 **Real-time messaging** with Socket.io
- 🚀 **Online user status**
- 👌 **Global state management** with Zustand
- 🐞 **Error handling** both on the server and on the client
- ☸️ **Production deployment** on Kubernetes
- 🔄 **CI/CD Pipeline** with GitHub Actions
- 🌍 **Cloudflare Tunnel** for secure external access

## 🏗️ Architecture

```
Internet → Cloudflare Tunnel → Frontend (nginx) → Backend (Node.js) → MongoDB
```

## 🚀 Deployment

This application is deployed on Kubernetes with automated CI/CD. See [`k8s/README.md`](k8s/README.md) for deployment instructions.

### Quick Deploy

1. Set up GitHub Secrets (see [k8s/README.md](k8s/README.md))
2. Push to `main` branch
3. GitHub Actions automatically builds and deploys

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- MongoDB instance
- Cloudinary account (optional, for image uploads)

### Setup .env file

```env
MONGODB_URI=...
PORT=5001
JWT_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

NODE_ENV=development
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```

### Development mode

```shell
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

## 📝 License

MIT License - see LICENSE file for details
