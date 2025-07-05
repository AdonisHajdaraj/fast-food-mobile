import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAdminMessagesController } from '../Controller/AdminMessagesController';

const { width, height } = Dimensions.get('window');

const AdminMessagesScreen = ({
  navigateToFood,
  navigateToAdminScreen,
  navigateToAdminMessage,
  navigateToTasks,
  navigateToLogin,
}) => {
  const { messages } = useAdminMessagesController();

  return (
    <View style={styles.container}>
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

        <TouchableOpacity style={styles.navItem} onPress={navigateToLogin}>
          <Icon name="log-out-outline" size={28} color="#e53935" />
          <Text style={[styles.navText, { color: '#e53935' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  scrollContainer: {
    paddingBottom: 100,
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
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
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    width: '100%',   
    alignSelf: 'center',      
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  navText: { fontSize: 12, marginTop: 4, color: '#333' },
});

export default AdminMessagesScreen;
