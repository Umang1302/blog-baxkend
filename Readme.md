# 📝 NestJS Blog Backend

This is a containerized NestJS backend API for a blogging platform with support for:

- CRUD operations for posts
- Google OAuth login
- JWT-based authorization
- MongoDB integration

---

## ⚙️ Prerequisites

- Node.js v18+
- Docker & Docker Compose
- MongoDB (either local or via Docker)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Build the project

```bash
npm run build
```

---

## 🐳 Run with Docker

### Option 1: Using local MongoDB instance

Make sure MongoDB is running on your local machine (default: `localhost:27017`).

```bash
docker build -t nest-blog-backend .
```

```bash
docker run -d -e PORT=8080 -e MONGO_URI=mongodb://host.docker.internal:27017/nest-blog -e JWT_SECRET=supersecretkey -e GOOGLE_CLIENT_ID=<<CLIENT_ID>> -e GOOGLE_CLIENT_SECRET=<<CLIENT_SECRET>> -e GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback -e CORS_ENABLE_URL=http://localhost:3000 -e FRONTEND_URL=http://localhost:3000 -p 8080:8080 --name nest-backend nest-blog-backend
```

---

### Option 2: Using Docker Compose (MongoDB in container)

This will start both MongoDB and your backend service in one go.

```bash
docker-compose up --build
```

---

## 🔧 Environment Variables

| Variable               | Description                           |
| ---------------------- | ------------------------------------- |
| `PORT`                 | Port your app runs on (default: 8080) |
| `MONGO_URI`            | MongoDB connection string             |
| `JWT_SECRET`           | Secret for signing JWT tokens         |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret            |
| `GOOGLE_CALLBACK_URL`  | Callback URL for Google OAuth         |
| `CORS_ENABLE_URL`      | Allowed CORS origin (Frontend URL)    |
| `FRONTEND_URL`         | Frontend base URL                     |

---

## 📦 API Endpoints

After running the server, you can access it at:

```
http://localhost:8080
```

---

## 🧼 Cleaning Up

Stop and remove all running containers:

```bash
docker-compose down
```

Or just the single container:

```bash
docker stop nest-backend && docker rm nest-backend
```

---
