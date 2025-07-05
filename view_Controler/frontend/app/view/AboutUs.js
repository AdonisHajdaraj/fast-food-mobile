import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Sidebar from './Header'; // Ndrysho sipas strukturës tënde

const { width, height } = Dimensions.get('window'); // për Pixel 4: 380x820

const AboutUsScreen = ({
  navigateToLogin,
  navigateToAboutUs,
  navigateToContactUs,
  navigateToUFood
 
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  return (
    <View style={styles.container}>
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

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContainer}>
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

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={navigateToUFood} style={styles.navItem}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  appContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 40,
   marginTop:26,
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  headerButton: {
    color: '#fff',
    fontSize: 24,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
  },
  scrollContainer: {
    paddingBottom: 80,
    paddingTop: 16,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
    color: '#2980b9',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  bottomNav: {
    height: 58,
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
    fontSize: 13,
  },
  navTextActive: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default AboutUsScreen;
