import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Sidebar from './Header';
import { useContactUs } from '../Controller/ContactUsController';

const ContactUsScreen = ({
  navigateToUFood,
  navigateToAboutUs,
  navigateToContactUs,
  navigateToLogin,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const { checkoutData, handleInputChange, handleSendMessage } = useContactUs();

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.appContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.headerButton}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Fast Food</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.headerButton}>🔓</Text>
            </TouchableOpacity>
          </View>

          {sidebarVisible && (
            <Sidebar
              onNavigateHome={navigateToUFood}
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
              onChangeText={(text) => handleInputChange('name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Emaili juaj"
              keyboardType="email-address"
              value={checkoutData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Mesazhi juaj"
              multiline
              numberOfLines={4}
              value={checkoutData.message}
              onChangeText={(text) => handleInputChange('message', text)}
            />

            <TouchableOpacity style={styles.confirmButton} onPress={handleSendMessage}>
              <Text style={styles.confirmButtonText}>Dërgo Mesazhin</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity onPress={navigateToUFood} style={styles.navItem}>
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
    width: 400,
    height: 830,
    backgroundColor: '#000',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#333',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  appContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 40,
    marginTop: 26,
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  headerButton: {
    color: '#fff',
    fontSize: 26,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  content: {
    paddingHorizontal: 15,
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
    fontSize: 15,
  },
  confirmButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  bottomNav: {
    height: 55,
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
