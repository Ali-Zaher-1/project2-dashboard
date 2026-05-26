# 🚀 Project 2 Dashboard - DecodeLabs

[![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r128-000000?style=flat&logo=three.js)](https://threejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat&logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Overview

A production-ready, space-themed dashboard for the DecodeLabs Full Stack Development internship. This frontend application provides user management, real-time chat capabilities, and an immersive 3D space experience.

**Live Demo:** [Coming Soon](#)

**Backend Repository:** [project2-api](https://github.com/Ali-Zaher-1/project2-api)

---

## ✨ Features

### 🎨 Visual & Experience

- **3D Space Scene** — Interactive stars and asteroids using Three.js
- **Black Hole Background** — Cinematic rotating black hole effect
- **Water Ripple Cursor** — Custom animated cursor with particle trail effects
- **Glass Morphism UI** — Modern blur and transparency effects
- **Smooth Animations** — CSS and React transitions throughout

### 🔐 Authentication

- JWT-based secure login/registration
- Password validation (minimum 6 characters)
- Password confirmation matching
- Persistent session storage
- Auto-redirect after authentication

### 👥 User Management

- Full CRUD operations (Create, Read, Update, Delete)
- Pagination support (5 users per page)
- Real-time API status indicator
- Edit and delete users inline
- Validation on all form inputs

### 💬 Real-time Chat

- Group chat with Socket.IO
- Online users list with status indicators
- Typing indicators in real-time
- Desktop browser notifications
- Sound alerts for new messages
- Message history (last 50 messages)
- Minimizable chat window with unread counter

### 🖱️ Custom Cursor

- Glowing central dot with pulse animation
- Rotating outer ring
- Water ripple effect on mouse movement
- Particle trail followers
- Velocity-based intensity (faster = bigger ripples)
- Hover effects on interactive elements

### 📱 Responsive Design

- Mobile-friendly layout (stacked on small screens)
- Tablet-optimized spacing
- Desktop full experience
- Touch-friendly buttons

---

## 🛠️ Tech Stack

| Technology      | Version | Purpose                        |
|-----------------|---------|--------------------------------|
| React.js        | 18.x    | Frontend framework             |
| Three.js        | r128    | 3D graphics rendering          |
| Socket.IO Client| 4.x     | Real-time communication        |
| Axios           | 1.x     | HTTP client for API calls      |

---

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Backend API running (see backend README)

### Steps

```bash
# Clone the repository
git clone https://github.com/Ali-Zaher-1/project2-dashboard.git
cd project2-dashboard

# Install dependencies
npm install

# Start the development server
npm start
```

The application will open at `http://localhost:3001`

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:3000

# Socket.IO Server URL
REACT_APP_SOCKET_URL=http://localhost:3000
```

### Production Variables

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
```

---

## 📁 Project Structure

```
project2-dashboard/
│
├── public/
│   ├── home.html              # Cinematic homepage with black hole
│   └── black-hole.jpg         # Background image
│
├── src/
│   ├── components/
│   │   ├── Chat.jsx           # Real-time chat component
│   │   ├── LoginModal.jsx     # Authentication modal
│   │   ├── UserTable.jsx      # Users table with actions
│   │   ├── UserForm.jsx       # Create/Edit user form
│   │   └── Notification.jsx   # Toast notifications
│   │
│   ├── hooks/
│   │   └── useUsers.js        # Custom hook for user management
│   │
│   ├── services/
│   │   └── api.js             # API client configuration
│   │
│   ├── App.jsx                # Main application component
│   ├── App.css                # Global styles
│   ├── index.js               # Entry point
│   └── index.css              # Base styles
│
├── .gitignore                 # Git ignore file
├── package.json               # Dependencies and scripts
└── README.md                  # Documentation
```

---

## 🎮 Component Documentation

### `LoginModal` Component

Authentication modal with login and register tabs.

**Props:**

| Prop      | Type     | Required | Description                    |
|-----------|----------|----------|--------------------------------|
| `onLogin` | function | Yes      | Callback after successful login |
| `onClose` | function | Yes      | Close modal callback            |

**Features:**

- Login form (username/email + password)
- Register form (username, email, name, password, confirm password)
- Password validation (min 6 chars, match confirmation)
- Error message display
- Loading states

**Usage:**

```jsx
<LoginModal 
  onLogin={handleLogin} 
  onClose={() => setShowLogin(false)} 
/>
```

---

### `Chat` Component

Real-time group chat with Socket.IO.

**Props:**

| Prop          | Type     | Required | Description                  |
|---------------|----------|----------|------------------------------|
| `currentUser` | object   | Yes      | Currently logged-in user     |
| `users`       | array    | Yes      | List of all users            |
| `onClose`     | function | Yes      | Close chat callback          |

**Features:**

- Real-time message sending/receiving
- Online users list with status
- Typing indicators
- Desktop notifications
- Sound alerts
- Message history
- Minimizable window with unread counter

**Usage:**

```jsx
<Chat 
  currentUser={currentUser}
  users={users}
  onClose={() => setShowChat(false)}
/>
```

---

### `UserTable` Component

Displays users in a sortable, paginated table.

**Props:**

| Prop       | Type     | Required | Description       |
|------------|----------|----------|-------------------|
| `users`    | array    | Yes      | List of users     |
| `loading`  | boolean  | Yes      | Loading state     |
| `onEdit`   | function | Yes      | Edit callback     |
| `onDelete` | function | Yes      | Delete callback   |

**Usage:**

```jsx
<UserTable 
  users={users}
  loading={loading}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### `UserForm` Component

Form for creating and editing users.

**Props:**

| Prop          | Type     | Required | Description               |
|---------------|----------|----------|---------------------------|
| `onSubmit`    | function | Yes      | Submit callback           |
| `initialData` | object   | No       | User data for editing     |
| `onCancel`    | function | No       | Cancel callback           |

**Usage:**

```jsx
{/* Create Mode */}
<UserForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />

{/* Edit Mode */}
<UserForm 
  initialData={editingUser}
  onSubmit={handleUpdate}
  onCancel={() => setEditingUser(null)}
/>
```

---

### `Notification` Component

Toast notification for success/error messages.

**Props:**

| Prop      | Type     | Required | Description              |
|-----------|----------|----------|--------------------------|
| `message` | string   | Yes      | Notification message     |
| `type`    | string   | Yes      | `'success'` or `'error'` |
| `onClose` | function | Yes      | Close callback           |

**Usage:**

```jsx
<Notification 
  message={notification.message}
  type={notification.type}
  onClose={() => setNotification({ message: '', type: '' })}
/>
```

---

## 🔌 API Integration

### API Client Configuration

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 15000,
});

// Request interceptor for auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Functions

```javascript
// Users
export const getUsers = (page = 1, limit = 5) => 
  API.get(`/users?page=${page}&limit=${limit}`);

export const createUser = (data) => API.post('/users', data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Auth
export const login = (credentials) => 
  axios.post('http://localhost:3000/api/v1/auth/login', credentials);

export const register = (userData) => 
  axios.post('http://localhost:3000/api/v1/auth/register', userData);
```

---

## 🎨 Custom Cursor Effects

The water ripple cursor features:

| Element            | Description                                         |
|--------------------|-----------------------------------------------------|
| Glowing Dot        | Central cursor with pulse animation                 |
| Rotating Ring      | Outer ring that rotates continuously                |
| Water Ripples      | Expanding ripple effect on movement                 |
| Particle Trail     | Glowing particles that follow the cursor            |
| Velocity Sensitivity | Faster movement creates larger, brighter ripples  |
| Hover Effects      | Ring expands on interactive elements                |

### Cursor Colors

- **Normal movement:** Cyan/Blue ripples
- **Fast movement:** Pink/Purple ripples
- **Hover:** Ring expands and turns pink

---

## 📱 Responsive Design

| Breakpoint       | Device  | Layout Changes                          |
|------------------|---------|-----------------------------------------|
| > 1200px         | Desktop | Full layout, 3-column stats             |
| 768px – 1199px   | Tablet  | Reduced spacing, 2-column stats         |
| < 768px          | Mobile  | Stacked layout, full-width buttons      |

---

## 🧪 Testing

### Test User Registration

1. Open `http://localhost:3001/home.html`
2. Click **"Register"**
3. Enter username, email, and password
4. Submit form
5. Watch travel animation → Dashboard

### Test Chat

1. Open two browsers (or incognito)
2. Login with different users
3. Click **"CHAT"** button in both windows
4. Send messages between users
5. Verify notifications appear

### Test User Management

1. After login, go to dashboard
2. Click **"Create New User"**
3. Fill in user details
4. Edit or delete existing users
5. Verify pagination works (if many users)

---

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

Runs the app in development mode at `http://localhost:3001`

### Production Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

---

## 📊 Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Project name: project2-dashboard
# - Override settings: N
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Drag and drop the 'build' folder to Netlify
# or use Netlify CLI
netlify deploy --prod --dir=build
```

### Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click **"New +"** → **"Static Site"**
4. Connect your GitHub repository
5. Build Command: `npm run build`
6. Publish Directory: `build`
7. Click **"Create Static Site"**

---

## 🐛 Troubleshooting

| Issue                          | Solution                                                       |
|-------------------------------|----------------------------------------------------------------|
| Blank page / white screen     | Hard refresh (`Ctrl+Shift+R`), check console for errors       |
| API shows offline             | Start backend with `npm run dev` in `project2-api` folder     |
| Chat not working              | Verify Socket.IO connection, check backend is running on port 3000 |
| Login fails                   | Check backend is running, verify credentials                   |
| Cursor effects not showing    | Check browser console for errors, refresh page                 |
| Black hole image not loading  | Ensure `black-hole.jpg` is in `public/` folder                |

### Debug Mode

Open browser console (`F12`) to see:

- API request/response logs
- Socket.IO connection status
- Authentication token status
- Redux/state updates (if applicable)

---

## 🔒 Browser Compatibility

| Browser | Minimum Version | Status              |
|---------|-----------------|---------------------|
| Chrome  | 90+             | ✅ Fully supported  |
| Firefox | 88+             | ✅ Fully supported  |
| Safari  | 14+             | ✅ Fully supported  |
| Edge    | 90+             | ✅ Fully supported  |

---

## 📝 Environment Setup Checklist

- [ ] Node.js installed (v18+)
- [ ] Backend running on port 3000
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` file created with correct API URL
- [ ] `black-hole.jpg` in `public/` folder

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Ali Zaher**

- GitHub: [@Ali-Zaher-1](https://github.com/Ali-Zaher-1)
- Email: ali2006ahmed9@gmail.com
- Project: DecodeLabs Full Stack Development — Batch 2026

---

## 🙏 Acknowledgments

- **DecodeLabs** for the internship opportunity
- **Three.js** community for 3D graphics inspiration
- **React** team for the amazing framework
- **Socket.IO** team for real-time communication

---

## 📄 License

This project is developed as part of the DecodeLabs Full Stack Development internship program.

---

## 🔗 Quick Links

- **Backend API:** https://github.com/Ali-Zaher-1/project2-api
- **Frontend Demo:** Coming Soon
- **Portfolio:** Coming Soon

---

## 🎯 Quick Start Commands

```bash
# Clone and install
git clone https://github.com/Ali-Zaher-1/project2-dashboard.git
cd project2-dashboard
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

> Built with 🚀 for DecodeLabs Full Stack Development 2026
>
> *Experience the journey through space and code!* 🌌
