# API Rate Limiter 🚦

A rate limiting and API management system built with **Node.js (Express), MongoDB, Redis, and React**.  
Supports per-minute and daily quotas, burst handling, sliding window limits, endpoint-specific limits, and IP blocking.  
Includes a **React + Vite + TailwindCSS frontend dashboard** for managing keys, usage, and monitoring.

---

## 🚀 Features
- **API Key Management** (create, list, delete, update)
- **Rate Limiting**
  - Per-minute limits
  - Daily quotas
  - Burst handling (Token Bucket)
  - Sliding window counter
  - Endpoint-specific limits
- **Blocking & Security**
  - Block/unblock IPs
  - IP-based middleware checks
- **Analytics & Monitoring**
  - Usage statistics
  - Violations tracking
  - System health (MongoDB, Redis, Server)
- **Frontend Dashboard**
  - Manage API keys
  - View usage analytics
  - Charts (request patterns + violations)
  - Blocked IPs management
  - Live monitoring with health check

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express, MongoDB, Redis
- **Frontend**: React (Vite), TailwindCSS, Recharts, Axios
- **Database**: MongoDB Atlas
- **Cache/Rate Limiting**: Redis

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd api-rate-limiter
```

### 2.Backend Setup

From root:

```cd D:/DEVELOPMENT/API-Rate-Limiter-
cd src
npm install


Run backend (with nodemon if configured):

npm run dev

```


### 3. Redis Setup (Docker)

Run Redis container (if not running already):
```
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
```

### 4.Frontend Setup

From root:
```
cd frontend
npm install


Run frontend:

npm run dev
```

Frontend available at → http://localhost:5173

### 5. Environment Files

Backend .env (inside src/.env)

```PORT=5000
MONGO_URI=<your-mongo-atlas-uri>
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:5173

Frontend .env (inside frontend/.env)
VITE_API_BASE_URL=http://localhost:5000/api

```




### 📡 API Documentation

### 🔑 API Keys

- `POST /api/keys` → Create new API key
- `GET /api/keys` → List all keys
- `PUT /api/keys/:id` → Update key (limits, status)
- `DELETE /api/keys/:id` → Delete key

---

### 🚦 Rate Limiting
- `POST /api/check-limit` → Check if request allowed
- `POST /api/record-request` → Record request log
- `GET /api/limits/:api_key` → Current usage counters

---

### 🚫 Blocking & Security
- `POST /api/block-ip` → Block an IP for X minutes
- `DELETE /api/block-ip/:ip` → Unblock an IP
- `GET /api/blocked-ips` → List blocked IPs

---

### 📊 Analytics & Monitoring
- `GET /api/usage/:api_key` → Usage stats (allowed vs blocked)
- `GET /api/violations` → List all blocked requests
- `GET /api/health` → Check server, Mongo, Redis status

---

### 📊 Frontend Dashboard
- **API Key Management** → Create/list/delete keys
- **Usage Analytics** → Summary counters
- **Usage Charts** → Allowed vs Blocked (Pie) + Violations (Bar)
- **Blocked IPs** → Block/unblock/list IPs
- **Live Monitoring** → Real-time limits + system health

---

### ⚡ Performance Notes
- **Redis** handles high-speed counters (atomic `INCR` with TTL).
- **MongoDB Atlas** stores persistent logs, keys, and blocked IPs.
- **Token Bucket** allows burst requests within limits.
- **Sliding Window (Redis Sorted Set)** ensures fair request distribution.
- **IP blocking middleware** rejects bad traffic before processing.
- **Frontend auto-refresh** (Live Monitoring) updates every 5s.

---


## 🖼️ Screenshots

### API Keys Management

<img width="1884" height="703" alt="image" src="https://github.com/user-attachments/assets/8fee8ad5-be83-4f73-8c8b-a7c04f2fb46a" />


### Usage Analytics

<img width="1183" height="317" alt="image" src="https://github.com/user-attachments/assets/c3db83d2-b451-403e-9595-077facb577f5" />


### Usage Charts

<img width="1360" height="559" alt="image" src="https://github.com/user-attachments/assets/d2dbf3b1-b01d-4270-8d28-cc86c945c60f" />


### Blocked IPs

<img width="1129" height="387" alt="image" src="https://github.com/user-attachments/assets/ef967d77-36e7-4b60-9cab-ce7ac1fed51b" />


### Live Monitoring

<img width="1299" height="380" alt="image" src="https://github.com/user-attachments/assets/aa156832-76dc-459c-b9c1-b4d9fec3bda1" />

---

### 👨‍💻 Author
- Built by **Sahil Chhabra** 🚀
- Role: Software Engineer
- Project: API Rate Limiter
- Tech Stack Used:
  - **Backend**
    - Node.js
    - Express.js
    - MongoDB Atlas
    - Redis (Docker)
    - Mongoose
  - **Frontend**
    - React (Vite)
    - TailwindCSS
    - Axios
    - Recharts
  - **Other Tools**
    - Docker
    - Nodemon
    - Dotenv
    - CORS Middleware
