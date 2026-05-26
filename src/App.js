import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import useUsers from './hooks/useUsers';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import Notification from './components/Notification';
import Chat from './components/Chat';
import LoginModal from './components/LoginModal';

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES — injected into <head> via <style> tag
═══════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@200;300;400;600;700&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --orb: 'Orbitron', monospace;
  --exo: 'Exo 2', sans-serif;
  --blue:   #00aaff;
  --cyan:   #00ffee;
  --green:  #00ff96;
  --purple: #a78bfa;
  --red:    #ff4466;
  --border: rgba(0,130,255,0.22);
  --glass:  rgba(0,12,45,0.55);
}

html, body {
  min-height: 100%;
  background: #000;
  font-family: var(--exo);
  color: #c8e0ff;
  overflow-x: hidden;
}

/* ── FIXED BACKGROUNDS ─────────────────────────────────── */
#dashboard-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
}

.bh-bg {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: url('/black-hole.jpg') center center / cover no-repeat;
  filter: brightness(0.32) saturate(1.3);
  opacity: 0.55;
  pointer-events: none;
}

.bh-overlay {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(0,4,18,0.62) 0%, rgba(0,8,32,0.28) 40%, rgba(0,4,18,0.72) 100%);
}

/* ── APP WRAPPER ───────────────────────────────────────── */
.app { position: relative; z-index: 3; min-height: 100vh; }

/* ── NAVIGATION ────────────────────────────────────────── */
.nav {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 66px;
  background: rgba(0,5,22,0.72);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(22px);
}

.nav-brand { display: flex; align-items: center; gap: 14px; }

.nav-logo {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #004ecc, #00b4ff);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--orb);
  font-weight: 900; font-size: 13px; color: #fff;
  box-shadow: 0 0 22px rgba(0,160,255,0.45);
}

.nav-title { font-family: var(--orb); font-size: 13px; font-weight: 700; color: #7dd3fc; letter-spacing: 2px; text-transform: uppercase; }
.nav-sub { font-size: 10px; color: rgba(120,180,255,0.4); letter-spacing: 1px; margin-top: 2px; }
.nav-right { display: flex; align-items: center; gap: 12px; }

.home-btn, .chat-btn, .logout-btn {
  padding: 7px 18px;
  border-radius: 8px;
  border: 1px solid rgba(0,120,255,0.25);
  background: rgba(0,18,58,0.45);
  color: #7dd3fc;
  font-family: var(--orb);
  font-size: 10px; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.22s;
}
.home-btn:hover, .chat-btn:hover, .logout-btn:hover {
  border-color: rgba(0,200,255,0.5);
  background: rgba(0,40,110,0.5);
  color: #fff;
  transform: translateY(-1px);
}
.logout-btn {
  background: rgba(255,51,102,0.15);
  border-color: rgba(255,51,102,0.3);
  color: #ff6699;
}
.logout-btn:hover {
  background: rgba(255,51,102,0.3);
  border-color: #ff6699;
}
.chat-btn.active {
  background: rgba(124,58,237,0.4);
  border-color: #7c3aed;
  color: #a78bfa;
}

.user-welcome {
  font-size: 11px;
  color: #7dd3fc;
  background: rgba(0, 100, 255, 0.15);
  padding: 4px 12px;
  border-radius: 20px;
  margin-right: 10px;
}

.status-pill {
  display: flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 999px;
  font-family: var(--orb); font-size: 10px; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase; border: 1px solid; backdrop-filter: blur(8px);
}
.pill-online  { background: rgba(0,255,150,0.08); border-color: rgba(0,255,150,0.25); color: var(--green); }
.pill-offline { background: rgba(255,60,60,0.08); border-color: rgba(255,60,60,0.25); color: var(--red); }

.status-dot { width: 7px; height: 7px; border-radius: 50%; }
.dot-online  { background: var(--green); box-shadow: 0 0 8px var(--green); animation: dotPulse 2s infinite; }
.dot-offline { background: var(--red); box-shadow: 0 0 8px var(--red); }
@keyframes dotPulse { 0%,100%{opacity:1;} 50%{opacity:0.35;} }

/* ── HERO ──────────────────────────────────────────────── */
.hero { text-align: center; padding: 60px 40px 48px; animation: fadeUp 0.9s ease both 0.1s; }
.hero-badge {
  display: inline-block; padding: 6px 22px; border-radius: 999px;
  background: rgba(0,120,255,0.1); border: 1px solid rgba(0,160,255,0.28);
  font-family: var(--orb); font-size: 10px; letter-spacing: 3px;
  text-transform: uppercase; color: #7dd3fc; margin-bottom: 22px;
}
.hero-title {
  font-family: var(--orb); font-size: clamp(28px,5vw,56px); font-weight: 900;
  line-height: 1.05; letter-spacing: 3px; color: #fff;
  text-shadow: 0 0 60px rgba(0,140,255,0.45); margin-bottom: 14px;
}
.hero-title .grad { background: linear-gradient(90deg, var(--blue), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-sub { font-size: 14px; font-weight: 300; color: rgba(160,210,255,0.6); letter-spacing: 2px; text-transform: uppercase; }
@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }

/* ── MAIN CONTENT ──────────────────────────────────────── */
.main { max-width: 1160px; margin: 0 auto; padding: 0 28px 80px; }

/* ── STATS GRID ────────────────────────────────────────── */
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; animation: fadeUp 0.9s ease both 0.2s; }
.stat-card {
  position: relative; overflow: hidden; background: var(--glass); border: 1px solid var(--border);
  border-radius: 14px; padding: 22px 24px; backdrop-filter: blur(14px); transition: border-color 0.2s, transform 0.2s;
}
.stat-card:hover { border-color: rgba(0,180,255,0.4); transform: translateY(-2px); }
.stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
.stat-card:nth-child(1)::before { background: linear-gradient(90deg,#0055cc,#00ccff); }
.stat-card:nth-child(2)::before { background: linear-gradient(90deg,#6600cc,#cc00ff); }
.stat-card:nth-child(3)::before { background: linear-gradient(90deg,#006633,#00ffcc); }
.stat-label { font-family: var(--orb); font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: rgba(140,200,255,0.45); margin-bottom: 12px; }
.stat-value { font-family: var(--orb); font-size: 36px; font-weight: 700; color: #fff; text-shadow: 0 0 22px rgba(0,150,255,0.35); line-height: 1; }
.stat-value .sub { font-size: 18px; opacity: 0.35; margin-left: 4px; }

/* ── GLASS CARD ─────────────────────────────────────────── */
.glass-card { background: var(--glass); border: 1px solid var(--border); border-radius: 16px; backdrop-filter: blur(16px); overflow: hidden; margin-bottom: 20px; animation: fadeUp 0.9s ease both 0.3s; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 26px; border-bottom: 1px solid rgba(0,100,255,0.12); }
.card-title { font-family: var(--orb); font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #7dd3fc; }
.card-badge { font-size: 11px; color: rgba(140,200,255,0.38); font-family: var(--exo); }
.card-body { padding: 26px; }

/* ── COLLAPSIBLE CREATE PANEL ──────────────────────────── */
.toggle-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 18px 26px; background: none; border: none; cursor: pointer; color: #7dd3fc; transition: background 0.18s; }
.toggle-btn:hover { background: rgba(0,80,200,0.08); }
.plus-icon { width: 30px; height: 30px; border-radius: 8px; background: rgba(0,100,255,0.14); border: 1px solid rgba(0,120,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--cyan); flex-shrink: 0; }
.toggle-label { font-family: var(--orb); font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; margin-left: 12px; }
.toggle-chevron { font-size: 16px; color: rgba(100,180,255,0.4); transition: transform 0.3s ease; }
.toggle-chevron.open { transform: rotate(180deg); }

/* ── EDIT CARD ─────────────────────────────────────────── */
.edit-card { border-color: rgba(150,100,255,0.35) !important; }
.edit-card .card-header { border-bottom-color: rgba(150,100,255,0.14) !important; }
.edit-badge { font-size: 11px; color: rgba(140,200,255,0.38); font-family: 'Courier New', monospace; }

/* ── TABLE ──────────────────────────────────────────────── */
table { width: 100%; border-collapse: collapse; font-size: 13px; }
thead tr { background: rgba(0,30,90,0.45) !important; border-bottom: 1px solid rgba(0,100,255,0.18) !important; }
thead th { padding: 13px 18px !important; text-align: left !important; font-family: var(--orb) !important; font-size: 9px !important; font-weight: 700 !important; letter-spacing: 2.5px !important; text-transform: uppercase !important; color: rgba(140,210,255,0.5) !important; }
tbody tr { border-bottom: 1px solid rgba(0,80,200,0.1) !important; background: transparent !important; transition: background 0.18s; }
tbody tr:hover { background: rgba(0,80,200,0.12) !important; }
tbody td { padding: 15px 18px !important; color: #c0d8f0 !important; font-size: 13px !important; }

/* ── PAGINATION ────────────────────────────────────────── */
.pagination { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 18px 26px; border-top: 1px solid rgba(0,80,200,0.12); }
.page-btn { padding: 7px 18px; border-radius: 8px; border: 1px solid rgba(0,100,255,0.22); background: rgba(0,18,58,0.45); color: #7dd3fc; cursor: pointer; font-family: var(--orb); font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; transition: all 0.18s; }
.page-btn:hover:not(:disabled) { background: rgba(0,60,160,0.4); border-color: rgba(0,180,255,0.45); }
.page-btn:disabled { opacity: 0.28; cursor: default; }
.page-num { width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(0,100,255,0.22); background: rgba(0,18,58,0.45); color: #7dd3fc; cursor: pointer; font-family: var(--orb); font-size: 12px; font-weight: 700; transition: all 0.18s; }
.page-num:hover { background: rgba(0,60,160,0.4); }
.page-num.active { background: linear-gradient(135deg, #0050c8, #0099ff); border-color: transparent; color: #fff; box-shadow: 0 0 14px rgba(0,150,255,0.4); }

/* ── NOTIFICATION ──────────────────────────────────────── */
.notif { border-radius: 10px; margin-bottom: 22px; padding: 13px 20px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 500; backdrop-filter: blur(8px); animation: fadeUp 0.4s ease both; }
.notif-success { background: rgba(0,180,100,0.1); border: 1px solid rgba(0,200,120,0.28); color: var(--green); }
.notif-error { background: rgba(200,0,0,0.1); border: 1px solid rgba(255,80,80,0.28); color: var(--red); }
.notif-close { background: none; border: none; cursor: pointer; font-size: 20px; color: inherit; line-height: 1; opacity: 0.7; padding: 0; transition: opacity 0.15s; }
.notif-close:hover { opacity: 1; }

/* ── FOOTER ────────────────────────────────────────────── */
.dash-footer { text-align: center; padding: 36px 0 0; font-family: var(--orb); font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: rgba(80,140,200,0.25); }

/* ── SCROLLBAR ─────────────────────────────────────────── */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: rgba(0,5,20,0.5); }
::-webkit-scrollbar-thumb { background: rgba(0,100,255,0.3); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,140,255,0.5); }
`;

/* ═══════════════════════════════════════════════════════════════
   THREE.JS HOOK — live asteroid field + stars in the background
═══════════════════════════════════════════════════════════════ */
function useSpaceScene(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.set(0, 0, 5);

    function addStars(n, spread, sz, col) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i*3]   = (Math.random() - 0.5) * spread;
        pos[i*3+1] = (Math.random() - 0.5) * spread;
        pos[i*3+2] = (Math.random() - 0.5) * spread - 100;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: col, size: sz, transparent: true, opacity: 0.82, sizeAttenuation: true })));
    }
    addStars(2200, 900, 0.55, 0xffffff);
    addStars(600, 700, 1.0, 0x88aaff);
    addStars(200, 600, 1.4, 0xffaa66);

    const rocks = [];
    function mkRock(x, y, z, s) {
      const geo = new THREE.IcosahedronGeometry(s, Math.random() > 0.5 ? 1 : 0);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        pos.setX(i, pos.getX(i) * (0.5 + Math.random() * 0.95));
        pos.setY(i, pos.getY(i) * (0.5 + Math.random() * 0.95));
        pos.setZ(i, pos.getZ(i) * (0.5 + Math.random() * 0.95));
      }
      geo.computeVertexNormals();
      const w = Math.random();
      let col;
      if (w > 0.65) col = new THREE.Color(0.42+Math.random()*0.18, 0.26+Math.random()*0.12, 0.14+Math.random()*0.10);
      else if (w > 0.35) col = new THREE.Color(0.30+Math.random()*0.14, 0.24+Math.random()*0.10, 0.20+Math.random()*0.08);
      else col = new THREE.Color(0.18+Math.random()*0.12, 0.17+Math.random()*0.09, 0.17+Math.random()*0.08);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col, roughness: 0.88+Math.random()*0.1, metalness: 0.04 }));
      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI*2);
      rocks.push({ mesh, rx: (Math.random()-0.5)*0.0022, ry: (Math.random()-0.5)*0.0028, rz: (Math.random()-0.5)*0.0018 });
      scene.add(mesh);
    }
    
    for (let i = 0; i < 90; i++) {
      const z = -20 - Math.random() * 350;
      const r = 28 + Math.random() * 52;
      const a = Math.random() * Math.PI * 2;
      mkRock(Math.cos(a)*r + (Math.random()-0.5)*16, Math.sin(a)*r*0.55 + (Math.random()-0.5)*16, z, 1.0 + Math.random()*5.5);
    }
    for (let i = 0; i < 35; i++) {
      const z = -4 - Math.random() * 120;
      const side = Math.random() > 0.5 ? 1 : -1;
      mkRock(side*(16 + Math.random()*28), (Math.random()-0.5)*22, z, 0.5 + Math.random()*2.6);
    }

    scene.add(new THREE.AmbientLight(0x0d1a30, 1.3));
    const dl = new THREE.DirectionalLight(0x3355ff, 0.65);
    dl.position.set(50, 80, 100);
    scene.add(dl);
    const accentPt = new THREE.PointLight(0xff4400, 0.55, 280);
    accentPt.position.set(0, 0, -80);
    scene.add(accentPt);

    let t = 0, rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);
      t += 0.008;
      camera.position.x = Math.sin(t * 0.14) * 0.28;
      camera.position.y = Math.cos(t * 0.11) * 0.18;
      camera.lookAt(0, 0, -20);
      rocks.forEach(r => { r.mesh.rotation.x += r.rx; r.mesh.rotation.y += r.ry; r.mesh.rotation.z += r.rz; });
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);
}

/* ═══════════════════════════════════════════════════════════════
   APP COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const {
    users = [],
    pagination = null,
    loading = false,
    notification = { message: '', type: '' },
    currentPage = 1,
    apiStatus = null,
    editingUser = null,
    showForm = false,
    setShowForm = () => {},
    setEditingUser = () => {},
    setNotification = () => {},
    handleCreate = async () => {},
    handleUpdate = async () => {},
    handleDelete = async () => {},
    handleEdit = () => {},
    handlePageChange = () => {},
  } = useUsers();

  const canvasRef = useRef(null);
  useSpaceScene(canvasRef);

  const online = apiStatus?.ok ?? false;
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('project2_user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setShowLogin(false);
      } catch(e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('project2_user');
      }
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('project2_user');
    setIsAuthenticated(false);
    setShowLogin(true);
    setCurrentUser(null);
    setShowChat(false);
  };

  /* Navigate back to homepage */
  const goHome = () => {
    window.location.href = '/home.html?from=dashboard';
  };

  // If not authenticated, show login modal
  if (!isAuthenticated) {
    return <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />;
  }

  const hasNotification = notification && notification.message;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <canvas id="dashboard-canvas" ref={canvasRef} />
      <div className="bh-bg" />
      <div className="bh-overlay" />

      <div className="app">
        <nav className="nav">
          <div className="nav-brand">
            <div className="nav-logo">P2</div>
            <div>
              <div className="nav-title">Project 2</div>
              <div className="nav-sub">DecodeLabs · Backend API · Batch 2026</div>
            </div>
          </div>
          <div className="nav-right">
            <span className="user-welcome">
              👋 Welcome, {currentUser?.name || currentUser?.username || 'User'}
            </span>
            <button className="home-btn" onClick={goHome}>← HOME</button>
            <button className={`chat-btn ${showChat ? 'active' : ''}`} onClick={() => setShowChat(!showChat)}>
              💬 {showChat ? 'CLOSE' : 'CHAT'}
            </button>
            <button className="logout-btn" onClick={handleLogout}>🚪 LOGOUT</button>
            <div className={`status-pill ${online ? 'pill-online' : 'pill-offline'}`}>
              <div className={`status-dot ${online ? 'dot-online' : 'dot-offline'}`} />
              {online ? 'API Online' : 'API Offline'}
            </div>
          </div>
        </nav>

        <div className="hero">
          <div className="hero-badge">DecodeLabs · Batch 2026 · Full Stack</div>
          <h1 className="hero-title">Project 2<br /><span className="grad">Dashboard</span></h1>
          <p className="hero-sub">Backend API Development · User Management</p>
        </div>

        <main className="main">
          {hasNotification && (
            <div className={`notif notif-${notification.type || 'success'}`}>
              <span>{notification.message}</span>
              <button className="notif-close" onClick={() => setNotification({ message: '', type: '' })}>×</button>
            </div>
          )}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{pagination?.totalItems ?? users?.length ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Current Page</div>
              <div className="stat-value">{currentPage}<span className="sub">/ {pagination?.totalPages ?? 1}</span></div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Per Page</div>
              <div className="stat-value">{pagination?.itemsPerPage ?? 5}</div>
            </div>
          </div>

          <div className="glass-card">
            <button className="toggle-btn" onClick={() => { setShowForm(!showForm); setEditingUser(null); }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="plus-icon">+</div>
                <span className="toggle-label">Create New User</span>
              </div>
              <span className={`toggle-chevron ${showForm ? 'open' : ''}`}>▼</span>
            </button>
            {showForm && (
              <div className="card-body" style={{ borderTop: '1px solid rgba(0,100,255,0.12)' }}>
                <UserForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
              </div>
            )}
          </div>

          {editingUser && (
            <div className="glass-card edit-card">
              <div className="card-header">
                <span className="card-title" style={{ color: 'var(--purple)' }}>✏ Editing User</span>
                <span className="edit-badge">{editingUser.name} · ID #{editingUser.id}</span>
              </div>
              <div className="card-body">
                <UserForm initialData={editingUser} onSubmit={handleUpdate} onCancel={() => setEditingUser(null)} />
              </div>
            </div>
          )}

          <div className="glass-card">
            <div className="card-header">
              <span className="card-title">All Users</span>
              <span className="card-badge">{loading ? 'Loading...' : `${users?.length ?? 0} record${users?.length !== 1 ? 's' : ''}`}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <UserTable users={users || []} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.hasPrev}>← Prev</button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pg => (
                  <button key={pg} className={`page-num ${currentPage === pg ? 'active' : ''}`} onClick={() => handlePageChange(pg)}>{pg}</button>
                ))}
                <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.hasNext}>Next →</button>
              </div>
            )}
          </div>

          <div className="dash-footer">Project 2 · DecodeLabs Full Stack 2026 · React + Express.js</div>
        </main>
      </div>
      
      {showChat && (
        <Chat currentUser={currentUser} users={users || []} onClose={() => setShowChat(false)} />
      )}
    </>
  );
}