import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Sidebar from '../user/Header'; // Kontrollo rrugën sipas strukturës tënde

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 35;

const AboutUsScreen = ({ navigateToHome, navigateToAboutUs, navigateToContactUs }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        {/* Notch */}
        <View style={styles.notch}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        {/* App Content */}
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

          {/* Content */}
          <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 60 }}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png' }}
              style={styles.logo}
            />
            <Text style={styles.title}>About Us</Text>

            <Text style={styles.subtitle}>Welcome to Our Fast Food Restaurant!</Text>
            <Text style={styles.description}>
              We are passionate about delivering the best fast food with the highest quality ingredients.
              From our delicious burgers to our crispy fries, we aim to bring joy and satisfaction to every meal.
            </Text>

            <Text style={styles.subtitle}>Our Mission</Text>
            <Text style={styles.description}>
              Our mission is to serve fast, fresh, and flavorful food in a welcoming atmosphere, where every
              bite is an experience worth savoring.
            </Text>

            <Text style={styles.subtitle}>Our Vision</Text>
            <Text style={styles.description}>
              Our vision is to be the go-to destination for fast food lovers everywhere.
            </Text>
          </ScrollView>

          {/* Bottom navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity onPress={navigateToHome} style={styles.navItem}>
              <Text style={styles.navText}>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToAboutUs} style={styles.navItem}>
              <Text style={[styles.navText, styles.navTextActive]}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToContactUs} style={styles.navItem}>
              <Text style={styles.navText}>Contact Us</Text>
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
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    backgroundColor: '#000',
    borderRadius: 40,
    paddingTop: NOTCH_HEIGHT,
    shadowColor: '#333',
    shadowOpacity: 0.7,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: PHONE_WIDTH / 2 - 60,
    width: 120,
    height: NOTCH_HEIGHT,
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
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
    color: '#2980b9',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
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

export default AboutUsScreen;
