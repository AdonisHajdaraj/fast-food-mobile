import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3012'); // Ndërro IP/shtetin sipas nevojës

const AdminMessagesScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3012/admin/messages')
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    socket.on('newMessage', (msg) => {
      setMessages(prev => [msg, ...prev]);
    });

    return () => socket.off('newMessage');
  }, []);

  // Funksioni për të shkuar një hap mbrapa
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.notch}></div>
        <div style={styles.statusBar}>
          <span style={styles.statusBarText}>9:41 AM</span>
        </div>

        <div style={styles.appContent}>
          <h2 style={styles.title}>📥 Mesazhet e përdoruesve</h2>

          <button onClick={handleGoBack} style={styles.backButton}>
            ← Kthehu Mbrapa
          </button>

          <div style={styles.messageContainer}>
            {messages.map((m, index) => (
              <div key={index} style={styles.messageCard}>
                <strong style={styles.sender}>{m.emri} ({m.email})</strong>
                <p style={styles.message}>{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles në objekt javascript (mund t’i kthesh në CSS nëse preferon)
const styles = {
  container: {
    display: 'flex',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  phoneFrame: {
    width: 380,
    height: 820,
    backgroundColor: 'black',
    borderRadius: 50,
    boxShadow: '0 10px 20px rgba(0,0,0,0.9)',
    overflow: 'hidden',
  },
  notch: {
    width: 200,
    height: 30,
    backgroundColor: 'black',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    margin: '10px auto 0 auto',
  },
  statusBar: {
    height: 20,
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  appContent: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    height: 740,
    overflowY: 'auto',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  backButton: {
    marginBottom: 15,
    padding: '8px 12px',
    fontSize: 16,
    cursor: 'pointer',
    backgroundColor: '#4caf50',
    border: 'none',
    color: 'white',
    borderRadius: 8,
  },
  messageContainer: {
    paddingBottom: 20,
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sender: {
    color: '#333',
    marginBottom: 5,
    display: 'block',
  },
  message: {
    color: '#555',
    fontSize: 16,
    lineHeight: 1.4,
  },
};

export default AdminMessagesScreen;
