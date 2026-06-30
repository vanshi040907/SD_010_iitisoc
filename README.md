# SD_010_iitisoc

# 🎨 Real-Time Collaborative Whiteboard

A full-stack **real-time collaborative whiteboard application** where multiple users can draw, write, annotate, and collaborate on the same canvas simultaneously.

Built using **React, HTML5 Canvas, Node.js, Express, Socket.IO, and MongoDB**.

---

## 🚀 Features

## ✏️ Drawing Tools

- Freehand drawing
- Pencil tool
- Eraser tool
- Highlighter tool
- Rectangle shape
- Circle shape
- Triangle shape
- Line tool
- Text tool
- Custom colors
- Adjustable stroke width


## 🔄 Real-Time Collaboration

- Multiple users can work on the same whiteboard
- Live drawing synchronization
- Room-based collaboration
- Unique room codes
- Socket.IO based communication


## 🧠 Canvas Features

- HTML5 Canvas drawing engine
- Smooth stroke rendering
- Operation based history
- Undo / Redo support
- Canvas replay system


## 🔐 Authentication

- User Signup
- User Login
- JWT authentication
- Secure password hashing
- Protected routes


## 💾 Database

MongoDB stores:

- User information
- Room details
- Drawing operations


## 📤 Export

- Download whiteboard as JPEG


## 🎨 UI Features

- Dark / Light theme
- Glassmorphism toolbar
- Animated landing page
- Responsive design
- Framer Motion animations


---

# 🛠️ Tech Stack


## Frontend

| Technology | Usage |
|---|---|
| React.js | UI development |
| Vite | Frontend build tool |
| HTML5 Canvas | Drawing engine |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Socket.IO Client | Real-time updates |


## Backend

| Technology | Usage |
|---|---|
| Node.js | Server runtime |
| Express.js | REST APIs |
| Socket.IO | Real-time communication |
| MongoDB | Database |
| Mongoose | Database modeling |
| JWT | Authentication |


---

# 📂 Project Structure


```
SD_010_iitisoc

│
├── backend
│
│── controller
│   ├── authController.js
│   ├── roomController.js
│   └── whiteboardController.js
│
│── middleware
│   └── authMiddleware.js
│
│── models
│   ├── userModel.js
│   ├── roomModel.js
│   └── whiteboardModel.js
│
│── routes
│   ├── authRoutes.js
│   ├── roomRoutes.js
│   └── whiteboardRoutes.js
│
│── service
│
│── connection.js
│── index.js
│
│
├── frontend
│
│── whiteboard
│
│── src
│
│   ├── animations
│   │
│   ├── components
│   │   ├── Whiteboard.jsx
│   │   ├── Toolbar.jsx
│   │   └── Canvas.jsx
│   │
│   ├── context
│   │   ├── RoomContext.jsx
│   │   └── WhiteboardContext.jsx
│   │
│   ├── pages
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Home.jsx
│   │   └── JoinRoom.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
└── README.md

```


---

# ⚙️ Installation


## Clone Repository

```bash
git clone https://github.com/vanshi040907/SD_010_iitisoc.git

cd SD_010_iitisoc
```


---

# Backend Setup


Move into backend folder:

```bash
cd backend
```


Install dependencies:

```bash
npm install
```


Create `.env` file:


```
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key
```


Start backend:


```bash
npm start
```


Backend runs on:

```
http://localhost:5000
```


---

# Frontend Setup


Open another terminal:


```bash
cd frontend/whiteboard
```


Install dependencies:


```bash
npm install
```


Run frontend:


```bash
npm run dev
```


Frontend runs on:


```
http://localhost:5173
```


---

# 🔁 Working Flow


```
User draws on canvas

        ↓

Canvas captures drawing data

        ↓

Frontend emits Socket.IO event

        ↓

Backend receives event

        ↓

Event broadcasted to room members

        ↓

Other users see drawing instantly

```


---

# 🔌 API Routes


## Authentication


### Signup

```
POST /auth/signup
```


### Login

```
POST /auth/login
```



---

## Room Management


### Create Room

```
POST /room/create
```


### Join Room

```
POST /room/join
```



---

## Whiteboard


### Save Drawing

```
POST /whiteboard/event
```


### Get Canvas Data

```
GET /whiteboard/getdata
```


### Undo

```
GET /whiteboard/undo
```


### Redo

```
POST /whiteboard/redo
```



---

# 🧩 Project Modules


## Canvas Engine

Responsible for:

- Drawing strokes
- Shapes
- Text rendering
- Erasing
- Canvas replay


---

## Real-Time Engine

Handles:

- Live strokes
- Shape synchronization
- Room communication
- Emoji reactions


---

## Authentication Module

Handles:

- Signup
- Login
- JWT verification
- Secure sessions


---

## Database Module

Stores:

- Users
- Rooms
- Drawing history


---

# 🐛 Challenges Solved


## Undo / Redo Issue

Problem:

Canvas history was stored using `useRef`, therefore React UI was not updating automatically.


Solution:

Implemented a state update trigger after history modification to refresh the canvas.


---

## Socket Authentication

Problem:

Multiple API calls were required to identify users.


Solution:

Used Socket.IO middleware with cookies and socket handshake authentication.


---

# 🚧 Future Improvements


- Infinite canvas
- Zoom and pan support
- Live cursor sharing
- Chat system
- Voice/video calling
- ML based shape recognition
- Host permissions
- Keyboard shortcuts
- Production deployment


---

# 👥 Team


## Frontend


### Vanshika Agrawal

- Canvas engine
- Toolbar
- Drawing tools
- Undo/Redo
- Download feature
- Theme system
- UI animations


### Vishruthi CV

- Login/signup UI
- Join room logic
- Shapes
- Highlighter
- Eraser
- Text tool



## Backend


### Saumya Roy

- JWT authentication
- Socket.IO handling
- MongoDB setup
- Room management


### Pranjali Dhondiba

- Database schemas
- Password hashing
- Authentication logic


---

# 📸 Screenshots

(Add project screenshots here)


---

# 📜 License


This project is developed for educational purposes as part of IITISoC 2026.
