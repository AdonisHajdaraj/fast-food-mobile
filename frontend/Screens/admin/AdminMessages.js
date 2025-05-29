import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from 'react-native';
import axios from 'axios';
import { io } from 'socket.io-client';

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 30;

const socket = io('http://localhost:3012'); // Ndërro IP për telefonin fizik

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

  return (
    <View style={styles.container}>
      {/* Frame Telefoni */}
      <View style={styles.phoneFrame}>
        {/* Notch */}
        <View style={styles.notch} />

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        {/* Përmbajtja e aplikacionit */}
        <View style={styles.appContent}>
          <Text style={styles.title}>📥 Mesazhet e përdoruesve</Text>

          <ScrollView contentContainerStyle={styles.messageContainer}>
            {messages.map((m, index) => (
              <View key={index} style={styles.messageCard}>
                <Text style={styles.sender}>{m.emri} ({m.email})</Text>
                <Text style={styles.message}>{m.message}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    backgroundColor: 'black',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  notch: {
    width: 200,
    height: NOTCH_HEIGHT,
    backgroundColor: 'black',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
    zIndex: 2,
  },
  statusBar: {
    height: 20,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  appContent: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  messageContainer: {
    paddingBottom: 20,
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sender: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  message: {
    color: '#555',
    fontSize: 16,
    lineHeight: 22,
  },
});

export default AdminMessagesScreen;
