# 🎨 Frontend Dashboard - Project 2

![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![Three.js](https://img.shields.io/badge/Three.js-r128-000000.svg)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101.svg)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)

## 🌟 Overview

An immersive, space-themed dashboard for the DecodeLabs Project 2 Full Stack Development internship. Features 3D graphics, real-time chat, user management, and a cinematic black hole experience.

- **Live Demo:** https://project2-dashboard-rjdp.vercel.app
- **Homepage:** https://project2-dashboard-rjdp.vercel.app/home.html
- **Backend API:** https://project2-api-giu-nexus-deploy.up.railway.app

---

## ✨ Features

### 🚀 Core Features

- **User Authentication** — Secure JWT-based login/registration
- **User Management** — Full CRUD operations with pagination
- **Real-time Chat** — Group chat with Socket.IO
- **Desktop Notifications** — Browser notifications for new messages
- **Sound Alerts** — Audio feedback for messages

### 🎨 Visual Features

- **3D Space Scene** — Interactive stars and asteroids using Three.js
- **Black Hole Background** — Cinematic rotating background
- **Water Ripple Cursor** — Custom animated cursor with particle trail effects
- **Glass Morphism UI** — Modern blur and transparency effects
- **Smooth Animations** — CSS and React transitions

### 🖱️ Custom Cursor Features

| Element | Description |
|---|---|
| Glowing Dot | Central cursor with pulse animation |
| Rotating Ring | Outer ring that rotates continuously |
| Water Ripples | Expanding ripple effect on movement |
| Particle Trail | Glowing particles that follow the cursor |
| Velocity Sensitivity | Faster movement = larger, brighter ripples |

### 📱 Technical Features

- **Responsive Design** — Works on all screen sizes
- **Dark Theme** — Space-optimized color scheme
- **API Status Indicator** — Real-time backend connection monitoring
- **Pagination** — Navigate through user list
- **Toast Notifications** — Success and error messages

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.x | Frontend framework |
| Three.js | r128 | 3D graphics |
| Socket.IO Client | 4.x | Real-time chat |
| Axios | 1.x | HTTP client |
| Vercel | — | Hosting |

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
REACT_APP_API_URL=https://project2-api-giu-nexus-deploy.up.railway.app
REACT_APP_SOCKET_URL=https://project2-api-giu-nexus-deploy.up.railway.app
```

### Production Variables (Vercel)

| Key | Value |
|---|---|
| `REACT_APP_API_URL` | `https://project2-api-giu-nexus-deploy.up.railway.app` |
| `REACT_APP_SOCKET_URL` | `https://project2-api-giu-nexus-deploy.up.railway.app` |

---

## 📁 Project Structure

```text
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
│   └── index.js               # Entry point
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🎮 Component Documentation

### LoginModal Component

Authentication modal with login and register tabs.

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `onLogin` | function | Yes | Callback after successful login |
| `onClose` | function | Yes | Close modal callback |

**Features:**
- Login form (username/email + password)
- Register form (username, email, name, password, confirm password)
- Password validation (min 6 chars, match confirmation)
- Error message display
- Loading states

---

### Chat Component

Real-time group chat with Socket.IO.

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `currentUser` | object | Yes | Currently logged-in user |
| `users` | array | Yes | List of all users |
| `onClose` | function | Yes | Close chat callback |

**Features:**
- Real-time message sending/receiving
- Online users list with status
- Typing indicators
- Desktop notifications
- Sound alerts
- Message history
- Minimizable window with unread counter

---

### UserTable Component

Displays users in a sortable, paginated table.

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `users` | array | Yes | List of users |
| `loading` | boolean | Yes | Loading state |
| `onEdit` | function | Yes | Edit callback |
| `onDelete` | function | Yes | Delete callback |

---

### UserForm Component

Form for creating and editing users.

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `onSubmit` | function | Yes | Submit callback |
| `initialData` | object | No | User data for editing |
| `onCancel` | function | No | Cancel callback |

---

### Notification Component

Toast notification for success/error messages.

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `message` | string | Yes | Notification message |
| `type` | string | Yes | `'success'` or `'error'` |
| `onClose` | function | Yes | Close callback |

---

## 🔌 API Integration

### API Client Configuration

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const API_VERSION = '/api/v1';

const API = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  timeout: 15000,
});

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
  axios.post(`${API_BASE_URL}${API_VERSION}/auth/login`, credentials);

export const register = (userData) =>
  axios.post(`${API_BASE_URL}${API_VERSION}/auth/register`, userData);
```

---

## 🎨 Color Palette

| Color | Hex | Usage |
|---|---|---|
| Primary Blue | `#00aaff` | Links, accents |
| Neon Cyan | `#00ffee` | Glows, effects |
| Success Green | `#00ff96` | Online status |
| Purple | `#a78bfa` | Chat button |
| Dark Background | `#0a0a2a` | Main background |

---

## 🧪 Testing

### Test User Registration

1. Open https://project2-dashboard-rjdp.vercel.app/home.html
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
5. Verify pagination works

---

## 📱 Responsive Design

| Breakpoint | Device | Layout Changes |
|---|---|---|
| > 1200px | Desktop | Full layout, 3-column stats |
| 768px – 1199px | Tablet | Reduced spacing, 2-column stats |
| < 768px | Mobile | Stacked layout, full-width buttons |

---

## 🚀 Deployment

### Deployed on Vercel

**Live URL:** https://project2-dashboard-rjdp.vercel.app

**Deployment Settings:**

- **Build Command:** `CI=false npm run build`
- **Output Directory:** `build`
- **Framework:** Create React App

---

## 📝 Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "CI=false react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| Blank page / white screen | Hard refresh (`Ctrl+Shift+R`), check console |
| API shows offline | Start backend with `npm run dev` |
| Chat not working | Verify Socket.IO connection |
| Login fails | Check backend is running |
| Cursor effects not showing | Refresh page, check console |
| Build fails | Set `CI=false` environment variable |

---

## 👨‍💻 Author

**Ali Zaher**

- **GitHub:** [@Ali-Zaher-1](https://github.com/Ali-Zaher-1)
- **Email:** ali2006ahmed9@gmail.com
- **Project:** DecodeLabs Full Stack Development — Batch 2026

---

## 🙏 Acknowledgments

- **DecodeLabs** for the internship opportunity
- **Three.js** community for 3D graphics inspiration
- **React** team for the amazing framework
- **Socket.IO** team for real-time communication

---

## 📄 License

This project is developed as part of the **DecodeLabs Full Stack Development** internship program.

---

## 🔗 Links

- **Live Demo:** https://project2-dashboard-rjdp.vercel.app
- **Homepage:** https://project2-dashboard-rjdp.vercel.app/home.html
- **GitHub Repository:** https://github.com/Ali-Zaher-1/project2-dashboard
- **Backend API:** https://github.com/Ali-Zaher-1/project2-api

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
> *Experience the journey through space and code! 🌌*
