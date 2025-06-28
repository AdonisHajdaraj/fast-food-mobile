import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import PushNotification from "react-native-push-notification";

const ContactUsScreen = ({ navigateToHome, navigateToAboutUs, navigateToContactUs }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: "default-channel-id",
        channelName: "Default Channel",
        channelDescription: "A default channel for notifications",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const handleInputChange = (field, value) => {
    setCheckoutData({ ...checkoutData, [field]: value });
  };

  const handleSendMessage = () => {
    const { name, email, message } = checkoutData;
    if (!name || !email || !message) {
      Alert.alert('Plotësoni të gjitha fushat e kontaktit.');
      return;
    }

    // Këtu krijojmë njoftimin lokal
    PushNotification.localNotification({
      channelId: "default-channel-id",
      title: "Mesazhi u dërgua",
      message: `Faleminderit, ${name}. Ne do t'ju kontaktojmë së shpejti!`,
      playSound: true,
      soundName: 'default',
      importance: "high",
      vibrate: true,
    });

    Alert.alert('Mesazhi u dërgua', `Faleminderit, ${name}. Ne do t'ju kontaktojmë së shpejti!`);
    setCheckoutData({ name: '', email: '', message: '' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.notch}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        <View style={styles.appContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.headerButton}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Fast Food</Text>
            <TouchableOpacity onPress={navigateToHome}>
              <Text style={styles.headerButton}>🏠</Text>
            </TouchableOpacity>
          </View>

          {sidebarVisible && (
            <Sidebar
              onNavigateHome={navigateToHome}
              onNavigateAboutUs={navigateToAboutUs}
              onNavigateContactUs={navigateToContactUs}
              onClose={toggleSidebar}
            />
          )}

          <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 60 }}>
            <Text style={styles.contactTitle}>Na Kontakto</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Emri juaj"
              value={checkoutData.name}
              onChangeText={text => handleInputChange('name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Emaili juaj"
              keyboardType="email-address"
              value={checkoutData.email}
              onChangeText={text => handleInputChange('email', text)}
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Mesazhi juaj"
              multiline
              numberOfLines={4}
              value={checkoutData.message}
              onChangeText={text => handleInputChange('message', text)}
            />

            <TouchableOpacity style={styles.confirmButton} onPress={handleSendMessage}>
              <Text style={styles.confirmButtonText}>Dërgo Mesazhin</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity onPress={navigateToHome} style={styles.navItem}>
              <Text style={styles.navText}>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToAboutUs} style={styles.navItem}>
              <Text style={styles.navText}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToContactUs} style={styles.navItem}>
              <Text style={[styles.navText, styles.navTextActive]}>Contact Us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 380,
    height: 820,
    backgroundColor: '#000',
    borderRadius: 40,
    paddingTop: 35,
    shadowColor: '#333',
    shadowOpacity: 0.7,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: 140,
    width: 120,
    height: 35,
    backgroundColor: '#111',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  statusBarText: {
    color: '#eee',
    fontWeight: '600',
  },
  appContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  header: {
    height: 50,
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerButton: {
    color: '#fff',
    fontSize: 28,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
  },
  content: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  contactTitle: {
    fontWeight: '700',
    fontSize: 22,
    marginVertical: 20,
    textAlign: 'center',
    color: '#2980b9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  bottomNav: {
    height: 60,
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    color: '#cbd6e8',
    fontWeight: '600',
  },
  navTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ContactUsScreen;
