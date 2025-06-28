import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3012');

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 35;

const AdminMessagesScreen = ({
  navigateToFood,
  navigateToAdminScreen,
  navigateToAdminMessage,
  navigateToTasks,
}) => {
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
        <View style={styles.notch}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        <View style={styles.appContent}>
          <Text style={styles.title}>📥 Mesazhet e përdoruesve</Text>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {messages.length === 0 ? (
              <Text style={styles.noMessages}>Nuk ka mesazhe për momentin.</Text>
            ) : (
              messages.map((m, index) => (
                <View key={index} style={styles.messageCard}>
                  <View style={styles.header}>
                    <Icon name="person-circle-outline" size={32} color="#4CAF50" />
                    <View style={styles.senderInfo}>
                      <Text style={styles.sender}>{m.emri}</Text>
                      <Text style={styles.email}>{m.email}</Text>
                    </View>
                  </View>
                  <Text style={styles.message}>{m.message}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={navigateToFood}>
            <Icon name="home-outline" size={28} color="#333" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={navigateToAdminScreen}>
            <Icon name="settings-outline" size={28} color="#333" />
            <Text style={styles.navText}>Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={navigateToAdminMessage}>
            <Icon name="chatbubble-ellipses-outline" size={28} color="#333" />
            <Text style={styles.navText}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={navigateToTasks}>
            <Icon name="list-outline" size={28} color="#333" />
            <Text style={styles.navText}>Tasks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  phoneFrame: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  notch: {
    width: 210,
    height: NOTCH_HEIGHT,
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  statusBarText: {
    color: '#777',
    fontWeight: '600',
    fontSize: 13,
  },
  appContent: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2c3e50',
  },
  scrollContainer: {
    paddingBottom: 90,
  },
  noMessages: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  senderInfo: {
    marginLeft: 12,
  },
  sender: {
    fontWeight: '700',
    fontSize: 18,
    color: '#27ae60',
  },
  email: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 4, color: '#333' },
});

export default AdminMessagesScreen;
