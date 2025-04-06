# RideBook

RideBook is a modern ride-hailing application built with React and Node.js that connects passengers with drivers. The application features real-time location tracking, secure authentication, and an intuitive booking interface.

## Features

- **User Authentication**
  - Email/Phone registration with verification
  - Secure login with JWT tokens
  - Password reset functionality

- **Real-time Tracking**
  - Live location tracking using Google Maps
  - Real-time driver-passenger communication via Socket.IO
  - Trip progress monitoring

- **Ride Management**
  - Easy ride booking interface
  - Multiple pickup/destination points
  - Distance and fare calculation
  - Ride history

## Technology Stack

### Frontend
- React 19
- Vite
- Redux Toolkit
- @vis.gl/react-google-maps
- Socket.IO Client
- TailwindCSS

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Nodemailer

## Dependencies

### Frontend Dependencies
```json
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.7.2",
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@fortawesome/free-regular-svg-icons": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@reduxjs/toolkit": "^2.6.1",
    "@tailwindcss/vite": "^4.0.5",
    "@vis.gl/react-google-maps": "^1.5.1",
    "axios": "^1.7.9",
    "lodash": "^4.17.21",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.1.5",
    "redux-persist": "^6.0.0",
    "socket.io-client": "^4.8.1",
    "tailwindcss": "^4.0.5"
  }
```

### Backend Dependencies
```json
  "dependencies": {
    "axios": "^1.8.4",
    "bcryptjs": "^3.0.2",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "crypto": "^1.0.1",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.0",
    "http": "^0.0.1-security",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.10.1",
    "nodemailer": "^6.10.0",
    "socket.io": "^4.8.1",
    "zod": "^3.24.2"
  }
```

## Overview of RideBook Website

### Login Page
![Login Page](./screenshots/Login-Page.png)

### Signup Page
![Signup Page](./screenshots/Signup-Page.png)


### User Dashboard Page
![Dashboard Page](./screenshots/Dashboard-Page_01.png)
![Dashboard Page](./screenshots/Dashboard-Page_02.png)
![Dashboard Page](./screenshots/Dashboard-Page_03.png)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Alok19d/Ride-Book.git
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

4. **Configure environment variables:**

Copy .env.example to .env in both frontend and backend directories
Fill in required environment variables

5. **Start the development servers:**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```


## API Endpoints
User Routes
- POST /api/v1/user/register - Register new user
- GET /api/v1/user/verify-email - Verify email address and Login
- POST /api/v1/user/login - User login
- GET /api/v1/user/profile - Get user profile
- GET /api/v1/user/refresh-token - Refreshes Access and Refresh Token
- PATCH /api/v1/user/reset-password - Reset password
- POST /api/v1/user/forgot-password - Request password reset
- GET /api/v1/user/logout - Logout User

Captain Routes:
- POST /api/v1/captainr/register - Register new captain
- GET /api/v1/captain/verify-email - Verify email address and Login
- POST /api/v1/captain/login - Captain login
- GET /api/v1/captain/profile - Get captain profile
- GET /api/v1/captain/refresh-token - Refreshes Access and Refresh Token
- PATCH /api/v1/captain/reset-password - Reset password
- POST /api/v1/captain/forgot-password - Request password reset
- GET /api/v1/captain/logout - Logout User

Map Routes:
- GET /api/v1/map/get-coordinates - Returns coordinates of given address
- GET /api/v1/map/get-distanceTime - Returns distance and time between Pickup and Destination
- GET /api/v1/map/get-suggestions - Returns suggestions for given input
- GET /api/v1/map/reverse-geocode - Returns longitude and latitude for a given address

Ride Routes:
- GET /api/v1/ride/get-fare - Returns fare between Pickup and Destination
- POST /api/v1/ride/create - Creates a new Ride
- POST /api/v1/ride/accept-ride - Allows captain to accept a ride
- GET /api/v1/ride/start-ride - Allows captain to start a ride
- GET /api/v1/ride/end-ride - Allows captain to end a Ride



## Contact
For queries or feedback, please contact [Alok](mailto:anandkumar19d@gmail.com).

---