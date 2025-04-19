# 💼 Customer Service Platform

A scalable and modular microservices-based customer service platform built with the MERN stack. The system supports Google OAuth for authentication and integrates seamlessly with Intercom to manage support conversations automatically.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [How It Works](#how-it-works)
- [Future Improvements](#future-improvements)
- [Credits](#credits)

---

## ✅ Features

- Google OAuth 2.0 user login
- JWT-based authentication system
- Modular microservice separation: Authentication & Request Handling
- MongoDB with Mongoose ODM
- Service Request creation & tracking
- Intercom integration for support conversations
- Automated fetching of agent replies from Intercom
- Cron job script to sync replies into the system(Deprecated)
- Clean Vite + React frontend interface
- HMAC Identity Verification

---

## 🧱 Tech Stack

| Layer        | Technology                              |
|--------------|------------------------------------------|
| Frontend     | React, Vite, Axios, React Router         |
| Backend      | Node.js, Express.js, JWT, Google OAuth   |
| Database     | MongoDB with Mongoose                    |
| Integration  | Intercom REST API                        |
| Architecture | Microservices (Auth + Customer services) |
| Utilities    | dotenv, nodemon, concurrently            |

---

## 🏗️ Architecture

```
Frontend (Vite + React)
     ↓
backend-auth (OAuth + JWT)
     ↓
customer (Service Request CRUD + Intercom Integration)
     ↓
MongoDB + Intercom
```

Each microservice runs independently, communicates via REST, and is deployed as a standalone Node app. The frontend communicates with both via Axios.

---

## 🗂️ Project Structure

```
root/
├── backend-auth/               # Handles Google login, JWT
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   └── model/
├── customer/                   # Handles user requests & Intercom logic
│   ├── config/
│   ├── controllers/
│   ├── model/
│   ├── routes/
│   ├── utils/
│   ├── scripts/
│   └── index.js
├── frontend/                   # React UI (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   └── Main_dashboard/
│   │   ├── utils/
│   │   └── assets/
│   └── vite.config.js
└── README.md
```

---

## 🛠️ Getting Started

### 🔁 Clone the repository

```bash
git clone https://github.com/your-username/customer-service-platform.git
cd customer-service-platform
```

---

## 🔐 Environment Setup

Create `.env` files in both `backend-auth` and `customer`.

### 📁 `backend-auth/.env`
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/authDB
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```

### 📁 `customer/.env`
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/customerDB
JWT_SECRET=your_jwt_secret
INTERCOM_TOKEN=your_intercom_personal_access_token
INTERCOM_WEBHOOK_SECRET=your_intercom_client_secret
```

---

## ⚙️ Running the Project

### Install all dependencies

```bash
# Backend Auth Service
cd backend-auth
npm install

# Customer Microservice
cd ../customer
npm install

# Frontend App
cd ../frontend
npm install
```

### Run all services

In three terminals (or use `concurrently`):

```bash
# Terminal 1
cd backend-auth
npm run dev

# Terminal 2
cd customer
npm run dev

# Terminal 3
cd customer
ssh -R 80:localhost:3001 serveo.net
# Copy this url as root webhook endpoint in intercom

# Terminal 4
cd frontend
npm run dev
```

---

## 🔗 Google OAuth Setup

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create new credentials → OAuth Client ID
- Add `http://localhost:5000/auth/google/callback` as a redirect URI
- Use the generated credentials in your `backend-auth/.env`

---

## 💬 Intercom Setup

- Visit [Intercom Developer Hub](https://developers.intercom.com/)
- Create a new app
- Get:
  - Personal Access Token → `INTERCOM_TOKEN`
  - Client Secret → `INTERCOM_WEBHOOK_SECRET`
- Set webhook URL to: `http://localhost:3001/customer/intercom-webhook` or `http://randomgenerated.serveo.net/customer/intercom-webhook` in Intercom settings

---

## 🔄 Syncing Intercom Replies

A cron script runs to sync agent replies into your DB: During Manual Run

### Manual Run

```bash
cd customer/scripts
node fetchReplies.js
```



## 🧪 How It Works

1. User logs in via Google OAuth.
2. Gets JWT token → stored in localStorage.
3. User opens `MakeRequest` form.
4. Submits a service request (with a category & description).
5. Request is stored in MongoDB and a new conversation is created in Intercom.
6. Agent replies on Intercom → webhook/cron updates the response in DB.
7. User can view status anytime from `ViewRequests`.

---



## 🙏 Credits

- Developed by **Aditya**
- Intercom API: [https://developers.intercom.com](https://developers.intercom.com)
- Google OAuth Docs: [https://developers.google.com/identity](https://developers.google.com/identity)

