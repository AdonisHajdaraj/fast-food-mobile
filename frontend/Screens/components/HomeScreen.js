import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 30;

export default function HomeScreen({ navigateToLogin, navigateToUFood }) {
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
            <Text style={styles.title}>Welcome to Our Fast Food</Text>
            <Text style={styles.subtitle}>Delicious Meals. Fast Service.</Text>

            <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
              <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={navigateToUFood}>
              <Text style={styles.buttonText}>Go to UFood (User View)</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333', // sfondi jashtë telefonit
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginBottom: 15,
    borderRadius: 25,
    width: '80%',
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
