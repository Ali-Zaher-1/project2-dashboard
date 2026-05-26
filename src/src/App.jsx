import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import useUsers from './hooks/useUsers';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import Notification from './components/Notification';
import Chat from './components/Chat';
import LoginModal from './components/LoginModal';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #000;
    font-family: 'Exo 2', sans-serif;
    color: #e0f0ff;
    min-height: 100vh;
    overflow-x: hidden;
  }

  #dashboard-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  .bg-wrap {
    position: fixed;
    inset: 0;
    z-index: 0;
    background: url('/black-hole.jpg') center center / cover no-repeat;
    filter: brightness(0.35);
    opacity: 0.5;
    pointer-events: none;
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 1;
    background: linear-gradient(to bottom, rgba(0,5,20,0.55) 0%, rgba(0,10,40,0.3) 40%, rgba(0,5,20,0.75) 100%);
    pointer-events: none;
  }

  .app {
    position: relative;
    z-index: 2;
    min-height: 100vh;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 68px;
    background: rgba(0, 15, 50, 0.6);
    border-bottom: 1px solid rgba(80, 160, 255, 0.2);
    backdrop-filter: blur(16px);
  }

  .nav-brand { display: flex; align-items: center; gap: 14px; }

  .nav-logo {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #0066ff, #00ccff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 14px;
    color: white;
    box-shadow: 0 0 20px rgba(0, 160, 255, 0.5);
  }

  .nav-title {
    font-family: 'Orbitron', monospace;
    font-size: 14px;
    font-weight: 700;
    color: #7dd3fc;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .nav-sub {
    font-size: 11px;
    color: rgba(150, 200, 255, 0.5);
    letter-spacing: 1px;
    margin-top: 2px;
  }

  .nav-right { display: flex; align-items: center; gap: 12px; }

  .home-btn, .chat-btn {
    padding: 6px 16px;
    border-radius: 8px;
    border: 1px solid rgba(0, 100, 255, 0.25);
    background: rgba(0, 20, 60, 0.4);
    color: #7dd3fc;
    font-family: 'Orbitron', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
  }

  .home-btn:hover, .chat-btn:hover {
    border-color: rgba(0, 180, 255, 0.5);
    background: rgba(0, 40, 100, 0.5);
    transform: translateY(-1px);
  }

  .status-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: 1px solid;
    backdrop-filter: blur(8px);
  }

  .status-online { background: rgba(0, 255, 150, 0.1); border-color: rgba(0, 255, 150, 0.3); color: #00ff96; }
  .status-offline { background: rgba(255, 60, 60, 0.1); border-color: rgba(255, 60, 60, 0.3); color: #ff5555; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; }
  .dot-online { background: #00ff96; box-shadow: 0 0 8px #00ff96; }
  .dot-offline { background: #ff5555; box-shadow: 0 0 8px #ff5555; }

  .user-welcome {
    font-size: 11px;
    color: #7dd3fc;
    background: rgba(0, 100, 255, 0.15);
    padding: 4px 12px;
    border-radius: 20px;
    margin-right: 10px;
  }

  .hero { text-align: center; padding: 64px 40px 48px; }
  .hero-badge {
    display: inline-block;
    padding: 6px 20px;
    background: rgba(0, 120, 255, 0.12);
    border: 1px solid rgba(0, 120, 255, 0.3);
    border-radius: 999px;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #7dd3fc;
    margin-bottom: 20px;
  }
  .hero-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(28px, 5vw, 52px);
    font-weight: 900;
    color: #fff;
    line-height: 1.1;
    letter-spacing: 2px;
    text-shadow: 0 0 40px rgba(0, 140, 255, 0.6);
    margin-bottom: 14px;
  }
  .hero-title span { background: linear-gradient(90deg, #00aaff, #00ffcc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero-sub { font-size: 15px; color: rgba(160, 210, 255, 0.7); font-weight: 300; letter-spacing: 1px; }

  .main { max-width: 1140px; margin: 0 auto; padding: 0 24px 60px; }

  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: rgba(0, 20, 60, 0.5);
    border: 1px solid rgba(0, 100, 255, 0.2);
    border-radius: 14px;
    padding: 22px 24px;
    backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
  }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-card:nth-child(1)::before { background: linear-gradient(90deg, #0066ff, #00ccff); }
  .stat-card:nth-child(2)::before { background: linear-gradient(90deg, #7700ff, #cc00ff); }
  .stat-card:nth-child(3)::before { background: linear-gradient(90deg, #00aa55, #00ffcc); }
  .stat-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(150, 200, 255, 0.5); margin-bottom: 10px; }
  .stat-value { font-family: 'Orbitron', monospace; font-size: 32px; font-weight: 700; color: #fff; text-shadow: 0 0 20px rgba(0, 150, 255, 0.4); }

  .glass-card {
    background: rgba(0, 15, 50, 0.5);
    border: 1px solid rgba(0, 100, 255, 0.18);
    border-radius: 16px;
    backdrop-filter: blur(14px);
    overflow: hidden;
    margin-bottom: 20px;
  }
  .card-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid rgba(0, 100, 255, 0.12); }
  .card-title { font-family: 'Orbitron', monospace; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #7dd3fc; }
  .card-sub { font-size: 12px; color: rgba(150, 200, 255, 0.4); }
  .card-body { padding: 24px; }

  .toggle-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    background: none;
    border: none;
    cursor: pointer;
    color: #7dd3fc;
  }
  .plus-icon {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: rgba(0, 100, 255, 0.15);
    border: 1px solid rgba(0, 100, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #00ccff;
  }
  .toggle-label { font-family: 'Orbitron', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-left: 12px; }
  .chevron { font-size: 18px; color: rgba(100, 180, 255, 0.4); transition: transform 0.3s; }

  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead tr { background: rgba(0, 50, 120, 0.3) !important; border-bottom: 1px solid rgba(0, 100, 255, 0.2) !important; }
  thead th { padding: 12px 16px !important; color: rgba(150, 210, 255, 0.6) !important; text-align: left; font-size: 10px !important; letter-spacing: 2px; text-transform: uppercase; font-weight: 600 !important; }
  tbody tr { border-bottom: 1px solid rgba(0, 80, 200, 0.1) !important; background: transparent !important; }
  tbody tr:hover { background: rgba(0, 80, 200, 0.12) !important; }
  tbody td { padding: 14px 16px !important; color: #c0d8f0 !important; }
  tbody td button { font-family: 'Orbitron', monospace !important; font-size: 9px !important; font-weight: 700 !important; letter-spacing: 1.5px !important; text-transform: uppercase !important; padding: 5px 13px !important; border-radius: 7px !important; cursor: pointer !important; }
  tbody td button:first-child { background: rgba(0,100,255,0.12) !important; border: 1px solid rgba(0,130,255,0.3) !important; color: #7dd3fc !important; }
  tbody td button:last-child { background: rgba(255,50,80,0.1) !important; border: 1px solid rgba(255,60,80,0.28) !important; color: #ff6688 !important; }

  .pagination { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px 24px; border-top: 1px solid rgba(0, 80, 200, 0.15); }
  .page-btn { padding: 7px 16px; border-radius: 8px; border: 1px solid rgba(0, 100, 255, 0.25); background: rgba(0, 30, 80, 0.4); color: #7dd3fc; cursor: pointer; font-size: 12px; font-weight: 600; }
  .page-btn:disabled { opacity: 0.3; cursor: default; }
  .page-num { width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(0, 100, 255, 0.25); background: rgba(0, 30, 80, 0.4); color: #7dd3fc; cursor: pointer; font-size: 13px; font-weight: 600; }
  .page-num.active { background: linear-gradient(135deg, #0055cc, #0099ff); border-color: #0099ff; color: white; box-shadow: 0 0 12px rgba(0, 150, 255, 0.4); }

  .notif { border-radius: 10px; margin-bottom: 20px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 500; backdrop-filter: blur(8px); }
  .notif-success { background: rgba(0, 180, 100, 0.12); border: 1px solid rgba(0, 200, 120, 0.3); color: #00ff96; }
  .notif-error { background: rgba(200, 0, 0, 0.12); border: 1px solid rgba(255, 80, 80, 0.3); color: #ff5555; }

  .edit-card { border-color: rgba(120, 80, 255, 0.35) !important; }
  .edit-card .card-header { border-bottom-color: rgba(120, 80, 255, 0.15) !important; }

  .footer { text-align: center; padding: 32px 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(100, 160, 220, 0.3); }

  .chat-btn { background: linear-gradient(135deg, #7c3aed, #4f46e5); border-color: rgba(124, 58, 237, 0.3); }
  .chat-btn:hover { border-color: #8b5cf6; background: linear-gradient(135deg, #8b5cf6, #6366f1); }
`;

export default function App() {
  const {
    users, pagination, loading, notification,
    currentPage, apiStatus, editingUser, showForm,
    setShowForm, setEditingUser, setNotification,
    handleCreate, handleUpdate, handleDelete,
    handleEdit, handlePageChange,
  } = useUsers();

  const online = apiStatus?.ok;
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const rocksRef = useRef([]);
  const starsRef = useRef([]);
  
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
      }
    } else {
      setShowLogin(true);
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
  };

  // Function to go back to the cinematic homepage
  const goToHomePage = () => {
    window.location.href = '/home.html';
  };

  // Initialize Three.js space scene
  useEffect(() => {
    if (!canvasRef.current || !isAuthenticated) return;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 5);

    function addStars(count, spread, size, color) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i*3] = (Math.random() - 0.5) * spread;
        positions[i*3+1] = (Math.random() - 0.5) * spread;
        positions[i*3+2] = (Math.random() - 0.5) * spread - 100;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({ color: color, size: size, transparent: true, opacity: 0.8 });
      const points = new THREE.Points(geometry, material);
      scene.add(points);
      starsRef.current.push(points);
    }
    
    addStars(2000, 800, 0.5, 0xffffff);
    addStars(500, 600, 1.0, 0x88aaff);
    addStars(200, 500, 1.2, 0xffaa66);

    function createRock(x, y, z, scaleVal) {
      const geometry = new THREE.IcosahedronGeometry(scaleVal, Math.random() > 0.5 ? 1 : 0);
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        positions.setX(i, positions.getX(i) * (0.6 + Math.random() * 0.8));
        positions.setY(i, positions.getY(i) * (0.6 + Math.random() * 0.8));
        positions.setZ(i, positions.getZ(i) * (0.6 + Math.random() * 0.8));
      }
      geometry.computeVertexNormals();
      const warm = Math.random();
      let color;
      if (warm > 0.65) color = new THREE.Color(0.55 + Math.random() * 0.15, 0.35 + Math.random() * 0.1, 0.2 + Math.random() * 0.1);
      else if (warm > 0.35) color = new THREE.Color(0.4 + Math.random() * 0.12, 0.32 + Math.random() * 0.08, 0.25 + Math.random() * 0.08);
      else color = new THREE.Color(0.28 + Math.random() * 0.1, 0.26 + Math.random() * 0.08, 0.22 + Math.random() * 0.06);
      const material = new THREE.MeshStandardMaterial({ color: color, roughness: 0.85, metalness: 0.05 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      const rotSpeed = { x: (Math.random() - 0.5) * 0.003, y: (Math.random() - 0.5) * 0.003, z: (Math.random() - 0.5) * 0.003 };
      rocksRef.current.push({ mesh, rotSpeed });
      scene.add(mesh);
    }

    for (let i = 0; i < 80; i++) {
      const z = -20 - Math.random() * 400;
      const radius = 25 + Math.random() * 45;
      const angle = Math.random() * Math.PI * 2;
      createRock(Math.cos(angle) * radius + (Math.random() - 0.5) * 15, Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * 15, z, 0.8 + Math.random() * 4);
    }
    
    for (let i = 0; i < 30; i++) {
      const z = -5 - Math.random() * 100;
      const side = Math.random() > 0.5 ? 1 : -1;
      createRock(side * (15 + Math.random() * 25), (Math.random() - 0.5) * 20, z, 0.5 + Math.random() * 2);
    }

    const ambientLight = new THREE.AmbientLight(0x0e1830, 1.2);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x4466ff, 0.6);
    dirLight.position.set(50, 80, 100);
    scene.add(dirLight);
    const accentLight = new THREE.PointLight(0xff6600, 0.4, 200);
    accentLight.position.set(0, 0, -50);
    scene.add(accentLight);

    let time = 0;
    function animate() {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.008;
      
      camera.position.x = Math.sin(time * 0.15) * 0.3;
      camera.position.y = Math.cos(time * 0.12) * 0.2;
      camera.lookAt(0, 0, -20);
      
      rocksRef.current.forEach(rock => {
        rock.mesh.rotation.x += rock.rotSpeed.x;
        rock.mesh.rotation.y += rock.rotSpeed.y;
        rock.mesh.rotation.z += rock.rotSpeed.z;
      });
      
      starsRef.current.forEach(starGroup => {
        starGroup.rotation.y += 0.0005;
        starGroup.rotation.x += 0.0003;
      });
      
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (renderer) renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [isAuthenticated]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If not authenticated, show login modal
  if (!isAuthenticated) {
    return <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />;
  }

  return (
    <>
      <style>{styles}</style>

      <canvas id="dashboard-canvas" ref={canvasRef}></canvas>
      <div className="bg-wrap" />
      <div className="overlay" />

      <div className="app">
        <nav className="nav">
          <div className="nav-brand">
            <div className="nav-logo">P2</div>
            <div>
              <div className="nav-title">Project 2</div>
              <div className="nav-sub">DecodeLabs · Backend API</div>
            </div>
          </div>
          <div className="nav-right">
            <span className="user-welcome">
              👋 Welcome, {currentUser?.name || currentUser?.username || 'User'}
            </span>
            
            <button className="home-btn" onClick={goToHomePage}>← HOME</button>
            
            <button className="chat-btn" onClick={() => setShowChat(!showChat)}>
              💬 {showChat ? 'CLOSE' : 'CHAT'}
            </button>
            
            <button className="home-btn" onClick={handleLogout} style={{ background: 'rgba(255,51,102,0.15)', borderColor: 'rgba(255,51,102,0.3)', color: '#ff6699' }}>
              🚪 LOGOUT
            </button>
            
            <div className={`status-pill ${online ? 'status-online' : 'status-offline'}`}>
              <div className={`status-dot ${online ? 'dot-online' : 'dot-offline'}`} />
              {online ? 'API Online' : 'API Offline'}
            </div>
          </div>
        </nav>

        <div className="hero">
          <div className="hero-badge">DecodeLabs · Batch 2026</div>
          <h1 className="hero-title">Project 2<br /><span>Dashboard</span></h1>
          <p className="hero-sub">Backend API Development · Full Stack Integration</p>
        </div>

        <main className="main">
          {notification.message && (
            <div className={`notif notif-${notification.type}`}>
              <span>{notification.message}</span>
              <button onClick={() => setNotification({ message: '', type: '' })}>×</button>
            </div>
          )}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{pagination?.totalItems ?? users.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Current Page</div>
              <div className="stat-value">{currentPage} <span style={{fontSize:16, opacity:0.4}}>/ {pagination?.totalPages ?? 1}</span></div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Per Page</div>
              <div className="stat-value">{pagination?.itemsPerPage ?? 5}</div>
            </div>
          </div>

          <div className="glass-card">
            <button className="toggle-btn" onClick={() => { setShowForm(!showForm); setEditingUser(null); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="plus-icon">+</div>
                <span className="toggle-label">Create New User</span>
              </div>
              <span className="chevron" style={{ transform: showForm ? 'rotate(180deg)' : 'none' }}>▼</span>
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
                <span className="card-title" style={{ color: '#a78bfa' }}>✏ Editing: {editingUser.name}</span>
                <span className="card-sub">ID #{editingUser.id}</span>
              </div>
              <div className="card-body">
                <UserForm initialData={editingUser} onSubmit={handleUpdate} onCancel={() => setEditingUser(null)} />
              </div>
            </div>
          )}

          <div className="glass-card">
            <div className="card-header">
              <span className="card-title">All Users</span>
              <span className="card-sub">{users.length} shown</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <UserTable users={users} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.hasPrev}>← Prev</button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-num ${currentPage === p ? 'active' : ''}`} onClick={() => handlePageChange(p)}>{p}</button>
                ))}
                <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.hasNext}>Next →</button>
              </div>
            )}
          </div>

          <div className="footer">Project 2 · DecodeLabs Full Stack 2026 · React + Express</div>
        </main>
      </div>
      
      {showChat && (
        <Chat currentUser={currentUser} users={users} onClose={() => setShowChat(false)} />
      )}
    </>
  );
}