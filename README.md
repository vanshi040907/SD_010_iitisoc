# 🎨 Real-Time Collaborative Whiteboard

A feature-rich, full-stack collaborative whiteboard built for seamless real-time teamwork, brainstorming, online teaching, technical interviews, and remote collaboration. The application enables multiple users to work simultaneously on an infinite canvas with instant synchronization, role-based access control, integrated voice communication, AI-assisted shape recognition, and persistent collaboration history.

Designed with scalability and performance in mind, the project combines modern web technologies with real-time communication and machine learning to provide a smooth, production-ready collaborative experience.

---

## ✨ Key Features

### 🖌️ Collaborative Drawing
- Real-time multi-user drawing using Socket.IO
- Pen, Highlighter, Eraser, Text, and Shape tools
- Smooth freehand drawing using HTML5 Canvas
- Undo & Redo functionality
- Drag, Select & Move existing objects
- Sticky Notes support
- Clear Canvas with confirmation

### ♾️ Infinite Canvas
- Unlimited drawing space
- Smooth panning and zooming
- Cursor-centric zoom
- World-coordinate based rendering
- Responsive on desktop and touch devices

### 👥 Collaboration & Permissions
- Secure user authentication with JWT
- Create and join rooms using unique room codes
- Host-controlled room approval system
- Role-based access (Host, Editor, Viewer)
- Live participant list
- "Go To Host View" synchronization

### 💬 Communication
- Real-time room chat
- Persistent chat history
- Voice calling powered by WebRTC
- Laser Pointer for live presentations
- Emoji reactions

### 🤖 AI Features
- Machine Learning based shape recognition
- Converts rough hand-drawn sketches into clean geometric shapes
- Powered by FastAPI + TensorFlow

### 📤 Productivity
- Export complete whiteboard
- Export current viewport
- Export selected object
- Playback previous drawing sessions
- Grid overlay
- Dark & Light themes

---

## 🛠️ Tech Stack

| Layer | Technologies |
|--------|--------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Drawing Engine | HTML5 Canvas |
| Backend | Node.js, Express.js |
| Real-Time Communication | Socket.IO |
| Database | MongoDB, Mongoose |
| Authentication | JWT, Cookies |
| Machine Learning | FastAPI, TensorFlow, NumPy, SciPy |
| Voice Communication | WebRTC |
| Deployment | Vercel, Render |

---

## 🚀 Highlights

- ⚡ Real-time synchronization with minimal latency
- ♾️ Infinite canvas with smooth navigation
- 🔐 Secure authentication & protected routes
- 👥 Role-based collaboration with host approval
- 🤖 AI-assisted drawing experience
- 🎙️ Built-in voice communication
- 📱 Fully responsive UI
- 🎨 Modern glassmorphism interface with dark/light mode

---

## 🏗️ System Architecture

```text
                                  +-----------------------+
                                  |    React + Vite       |
                                  |    Frontend Client    |
                                  +-----------+-----------+
                                              |
                +-----------------------------+-----------------------------+
                |                             |                             |
      HTTP / REST APIs                 Socket.IO Events                HTTP / REST
     (Auth, Rooms, History)          (Sync, Chat, Pointer)          (Shape Predict)
                |                             |                             |
                v                             v                             v
    +-----------------------+     +-----------------------+     +-----------------------+
    |    Node.js / Express  |     |   Socket.IO Server    |     |   FastAPI ML Service  |
    |    Backend API        | <--->  (Real-Time Engine)   |     |  (TensorFlow / Keras) |
    +-----------+-----------+     +-----------+-----------+     +-----------+-----------+
                |                             |                             |
                +-----------------------------+                             |
                                              |                             |
                                              v                             v
                                  +-----------------------+     +-----------------------+
                                  |    MongoDB Database   |     |   LSTM Neural Network |
                                  | (Users, Rooms, Sync)  |     |   (QuickDraw Model)   |
                                  +-----------------------+     +-----------------------+
```



## 🔌 API & Socket Reference
REST Endpoints
Authentication
```
POST /signin — Register a new salted/hashed user account
POST /login — Validate credentials and assign HTTP-only JWT cookie
GET /me — Fetch current session profile details
GET /logout — Invalidate user session and clear auth cookies
```
Room & Permission Controls
```
POST /createroom — Generate a new room instance (Requester designated as Host)
POST /joinRoom — Submit request to join a room code
POST /allowed — Host endpoint to approve pending users
POST /deny — Host endpoint to decline pending users
GET /getmember — Fetch active room member list and assigned roles
GET /leaveRoom — Disconnect from current active room
```
Whiteboard Data Operations
```
GET /whiteboard/getdata — Retrieve board operation state history
POST /whiteboard/event — Save completed canvas draw/mod operation
GET /whiteboard/undo — Revert previous operation step
POST /whiteboard/redo — Re-apply undone operation step
POST /update — Persist coordinate changes following drag actions
GET /rooms/:roomId/chats — Retrieve historical message logs
```


## User schema 
```
const userSchema = new Schema({
  userName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  salt:       { type: String },
  password:   { type: String, required: true },
  ActiveRoom: { type: Schema.Types.ObjectId, ref: "room" }
});
```
## Room schema
```
const roomSchema = new Schema({
  roomId:         { type: String, required: true },
  hostpermission: { type: Boolean, default: false },
  owner:          { type: Schema.Types.ObjectId, ref: "user", required: true },
  participants: [{
    user:         { type: Schema.Types.ObjectId, ref: "user" },
    role:         { type: String, enum: ["Host", "Viewer", "Editor"], default: "Editor" },
    enabled:      { type: Boolean, default: true }
  }],
  activeParticipants: [{ type: Schema.Types.ObjectId, ref: "user" }]
}, { timestamps: true });
```

## Chat schema
```
const chatSchema = new Schema({
  room:     { type: Schema.Types.ObjectId, ref: "room", required: true },
  user:     { type: Schema.Types.ObjectId, ref: "user", required: true },
  userName: { type: String, required: true },
  content:  { type: String, required: true },
  sentAt:   { type: Date, default: Date.now }
}, { timestamps: true });
```
##📦 Installation

```bash
# Clone the repository
git clone <repository-url>

# Move into the project
cd collaborative-whiteboard

# Install dependencies
npm install

# Start the frontend
npm run dev

# Start the backend
npm start

```
---

## 🌍 Use Cases

- Online classrooms
- Team brainstorming sessions
- Technical interviews
- Product & UI design discussions
- Collaborative note-taking
- Remote meetings and presentations

---
## Future Improvemnents

 - 🤖 AI Features & Smart Tools
- Access to previously made boards
  

## 👨‍💻 Contributors

- Vanshika Agrawal
- Saumya Roy
- Kampurne Pranjali Dhondiba
- Vishruthi CV

---

⭐ If you found this project interesting, consider giving it a **star** and contributing!
