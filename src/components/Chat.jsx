import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const Chat = ({ currentUser, users, onClose }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const audioRef = useRef(null);
  
  const currentUsername = currentUser?.name || currentUser?.email?.split('@')[0] || 'Guest';
  
  // Request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
    
    audioRef.current = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    audioRef.current.volume = 0.3;
  }, []);
  
  // Socket connection
  useEffect(() => {
    if (!currentUsername) return;
    
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true
    });
    
    newSocket.on('connect', () => {
      console.log('Chat connected!');
      setConnectionStatus('connected');
      newSocket.emit('user-join', { name: currentUsername, room: 'general' });
    });
    
    newSocket.on('connect_error', () => setConnectionStatus('error'));
    
    newSocket.on('message-history', (history) => {
      setMessages(history || []);
    });
    
    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      
      if (message.from_user !== currentUsername) {
        setUnreadCount(prev => prev + 1);
        
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log('Audio play failed'));
        }
        
        if (Notification.permission === 'granted') {
          new Notification(`💬 ${message.from_user}`, {
            body: message.message,
            icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png'
          });
        }
        
        setNotifications(prev => [{
          id: Date.now(),
          title: message.from_user,
          body: message.message
        }, ...prev].slice(0, 5));
        
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== message.id));
        }, 4000);
      }
    });
    
    newSocket.on('online-users', (usersList) => {
      setOnlineUsers(usersList || []);
    });
    
    newSocket.on('user-typing', (data) => {
      if (data.isTyping && data.from !== currentUsername) {
        setUserTyping(data.from);
        setTimeout(() => setUserTyping(null), 1500);
      }
    });
    
    setSocket(newSocket);
    
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [currentUsername]);
  
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [messages, isChatOpen]);
  
  const sendMessage = () => {
    if (!inputMessage.trim() || !socket) return;
    
    socket.emit('send-message', {
      message: inputMessage,
      to: 'everyone'
    });
    
    setInputMessage('');
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit('typing', { isTyping: false });
  };
  
  const handleTyping = () => {
    if (!socket) return;
    
    if (!typing) {
      setTyping(true);
      socket.emit('typing', { isTyping: true });
    }
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit('typing', { isTyping: false });
    }, 1000);
  };
  
  const otherUsers = (users || []).filter(u => {
    const userName = u.name || u.email;
    return userName !== currentUsername;
  });
  
  return (
    <>
      {!isChatOpen && (
        <div onClick={() => setIsChatOpen(true)} style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '60px', height: '60px', borderRadius: '30px',
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 1000, boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          <span style={{ fontSize: '28px' }}>💬</span>
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute', top: '-5px', right: '-5px',
              background: '#ff3366', color: 'white', borderRadius: '50%',
              width: '22px', height: '22px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '11px', fontWeight: 'bold'
            }}>{unreadCount > 9 ? '9+' : unreadCount}</div>
          )}
        </div>
      )}
      
      {isChatOpen && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '380px', height: '500px',
          background: 'rgba(0, 8, 25, 0.98)',
          border: '1px solid rgba(0, 100, 255, 0.3)',
          borderRadius: '16px', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          zIndex: 1000, boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '13px', fontWeight: 'bold' }}>
              💬 Team Chat {connectionStatus !== 'connected' && `(${connectionStatus})`}
            </span>
            <div>
              <button onClick={() => setIsChatOpen(false)} style={{
                background: 'none', border: 'none', color: '#fff',
                fontSize: '16px', cursor: 'pointer', marginRight: '8px'
              }}>▼</button>
              <button onClick={onClose} style={{
                background: 'none', border: 'none', color: '#fff',
                fontSize: '20px', cursor: 'pointer'
              }}>×</button>
            </div>
          </div>
          
          <div style={{
            padding: '6px 12px', background: 'rgba(0,20,60,0.4)',
            borderBottom: '1px solid rgba(0,100,255,0.2)', fontSize: '11px'
          }}>
            👥 Online: {onlineUsers.filter(u => u !== currentUsername).join(', ') || 'Only you'}
            {userTyping && <span style={{ marginLeft: '10px', color: '#00ccff' }}>✎ {userTyping} typing...</span>}
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column' }}>
            {messages.slice(-50).map(msg => (
              <div key={msg.id} style={{
                marginBottom: '8px', display: 'flex',
                justifyContent: msg.from_user === currentUsername ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '75%', padding: '6px 12px', borderRadius: '12px',
                  background: msg.from_user === currentUsername
                    ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                    : 'rgba(255,255,255,0.1)',
                  fontSize: '12px'
                }}>
                  {msg.from_user !== currentUsername && (
                    <div style={{ fontSize: '9px', color: '#8b5cf6', marginBottom: '2px' }}>{msg.from_user}</div>
                  )}
                  {msg.message}
                  <div style={{ fontSize: '8px', opacity: 0.4, marginTop: '2px' }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div style={{ padding: '10px', borderTop: '1px solid rgba(0,100,255,0.2)', display: 'flex', gap: '8px' }}>
            <input
              type="text" value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              onKeyUp={handleTyping}
              placeholder="Type a message..."
              style={{
                flex: 1, padding: '8px 12px', background: 'rgba(0,20,60,0.8)',
                border: '1px solid rgba(0,100,255,0.3)', borderRadius: '20px',
                color: '#fff', outline: 'none', fontSize: '12px'
              }}
            />
            <button onClick={sendMessage} style={{
              padding: '8px 16px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border: 'none', borderRadius: '20px', color: '#fff', cursor: 'pointer'
            }}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;