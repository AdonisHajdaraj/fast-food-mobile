import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://192.168.100.11:3012'); // IP e serverit

export function useAdminMessagesController() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios
      .get('http://10.0.2.2:3012/admin/messages')
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    socket.on('newMessage', (msg) => {
      setMessages(prev => [msg, ...prev]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  return { messages };
}
