import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3012'); // ndrysho IP nëse teston në pajisje reale

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 30;

const AdminMessagesScreen = ({ navigateToFood }) => {
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
      <View style={styles.phoneFrame}>
        <View style={styles.notch} />
        <View style={styles.statusBar}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        <View style={styles.appContent}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>📥 Mesazhet e përdoruesve</Text>

            <TouchableOpacity onPress={navigateToFood} style={styles.button}>
              <Text style={styles.buttonText}>← Kthehu Mbrapa</Text>
            </TouchableOpacity>

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
    backgroundColor: '#fafafa',
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 20,
    borderRadius: 25,
    alignSelf: 'center',
    minWidth: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sender: {
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    color: '#555',
    fontSize: 16,
    lineHeight: 22,
  },
});

export default AdminMessagesScreen;
