# 🎬 MovieHero - Cinema Booking System Backend

[![Deployed on Heroku](https://img.shields.io/badge/Deployed%20on-Heroku-430098?style=for-the-badge&logo=heroku)](https://moviehero-4965967c38ad.herokuapp.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express.js-000000?style=for-the-badge&logo=express)](https://expressjs.com/)

> **Your Ultimate Movie Booking Experience** 🍿  
> Discover, review, and book tickets for the latest blockbusters and hidden gems. Experience cinema like never before with our seamless booking platform.

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🏗 Project Structure](#-project-structure)

## ✨ Features

### 🎯 Core Functionality
- **🎬 Movie Management**: Complete CRUD operations for movies
- **🎫 Smart Seat Booking**: Real-time seat availability with automatic initialization (35 seats per movie)
- **👤 User Authentication**: Secure JWT-based auth with admin privileges
- **⭐ Review System**: Rate and review movies with full CRUD capabilities
- **📊 Booking Management**: Track ticket purchases and user history

### 🔧 Technical Features
- **🚀 RESTful API**: Well-structured endpoints following REST principles
- **🔒 Secure Authentication**: JWT tokens with role-based access control
- **📱 CORS Enabled**: Frontend-ready with proper cross-origin support
- **☁️ Cloud Database**: MongoDB Atlas integration
- **📦 Auto-Deploy**: Seamless Heroku deployment pipeline

## 🛠 Tech Stack

### Backend Infrastructure
```
🟢 Node.js          - Runtime environment
⚡ Express.js        - Web application framework
🍃 MongoDB          - NoSQL database
🔐 JWT              - Authentication tokens
🔒 bcrypt           - Password hashing
🌐 CORS             - Cross-origin resource sharing
📝 Morgan           - HTTP request logger
```

### Development Tools
```
📦 npm              - Package manager
🚀 Heroku           - Cloud deployment
☁️ MongoDB Atlas    - Database hosting
🔧 dotenv           - Environment variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB Atlas account
- npm 

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/moviehero-backend.git
   cd moviehero-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   # Create .env file
   touch .env
   ```
   
   Add the following variables:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie_ticketing_system
   JWT_SECRET=your_super_secure_secret_key
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

🎉 **Server running at** `http://localhost:3000`


### Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://moviehero-4965967c38ad.herokuapp.com`


## 🏗 Project Structure

```
moviehero-backend/
├── 📁 controllers/          # Route handlers
│   ├── 🎬 movies.js         # Movie operations
│   ├── 👤 users.js          # User management
│   ├── 🔐 auth.js           # Authentication
│   └── 🧪 test-jwt.js       # JWT testing
├── 📁 models/               # Database schemas
│   ├── 🎬 movie.js          # Movie schema with seats
│   ├── 👤 user.js           # User schema
│   └── 🎫 booking.js        # Booking schema
├── 📁 middleware/           # Custom middleware
│   ├── 🔐 verify-token.js   # JWT verification
│   └── 👑 verify-admin.js   # Admin verification
├── 📄 server.js             # Application entry point
├── 📦 package.json          # Dependencies
└── 📝 README.md             # Project documentation
```

### Live Application
🎬 **Full Application**: [https://final-commit-group-mern-stack-front-ctl9e7kiw.vercel.app/](https://final-commit-group-mern-stack-front-ctl9e7kiw.vercel.app/)  
🌐 **Backend API**: [https://moviehero-4965967c38ad.herokuapp.com](https://moviehero-4965967c38ad.herokuapp.com)



---

<div align="center">

### 🎬 Built with by Movie Lovers for Movie Lovers

**[⭐ Backend Repo](https://github.com/am-973/moviehero_be)** • **[🎬 Frontend Repo](https://github.com/AM-973/moviehero_FE)** • **[⭐ Star this repo](https://github.com/am-973/moviehero_be)** 

Made by The Final Commit | © 2025 MovieHero

</div>