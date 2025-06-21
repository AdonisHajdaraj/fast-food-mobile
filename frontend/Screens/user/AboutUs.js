import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 30;

const AboutUsScreen = ({ navigateToUFood }) => {
  return (
    <View style={styles.container}>
      {/* Phone Frame */}
      <View style={styles.phoneFrame}>
        {/* Notch */}
        <View style={styles.notch} />

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        {/* App Content */}
        <View style={styles.appContent}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              bite is an experience worth savoring. We are committed to providing excellent service and using
              only the best ingredients.
            </Text>

            <Text style={styles.subtitle}>Our Vision</Text>
            <Text style={styles.description}>
              Our vision is to be the go-to destination for fast food lovers everywhere. We strive to create
              a brand that is synonymous with quality, convenience, and satisfaction.
            </Text>

            <TouchableOpacity style={styles.button} onPress={navigateToUFood}>
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fafafa',
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginBottom: 15,
    borderRadius: 25,
    alignSelf: 'center',
    minWidth: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AboutUsScreen;
