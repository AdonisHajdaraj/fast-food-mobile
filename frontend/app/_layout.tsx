import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Importimi i Komponentëve për Ekranet
import AboutUs from '../Screens/admin/AboutUs';
import ContactUs from '../Screens/admin/ContactUs';
import FoodScreen from '../Screens/admin/FoodScreen';
import ForgotPasswordScreen from '../Screens/admin/ForgotPasswordScreen';
import LoginScreen from '../Screens/admin/LoginScreen';
import SignupScreen from '../Screens/admin/SignupScreen';


export default function App() {
  const [screen, setScreen] = useState('home'); // Përdorim state për të kontrolluar cilin ekran të shfaqim

  // Funksionet për navigim
  const navigateToLogin = () => setScreen('login');
  const navigateToSignup = () => setScreen('signup');
  const navigateToForgotPassword = () => setScreen('forgotPassword');
  const navigateToFood = () => setScreen('food');
  const navigateToHome = () => setScreen('home');
  const navigateToAboutUs = () => setScreen('aboutUs');
  const navigateToContactUs = () => setScreen('contactUs') // Funksioni për "Rreth Nesh"

  return (
    <View style={styles.container}>
      {/* Ekrani Home */}
      {screen === 'home' && (
        <View style={styles.screen}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Welcome to Our Fast Food</Text>
            <Text style={styles.subtitle}>Delicious Meals. Fast Service.</Text>
            
            <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
              <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={navigateToFood}>
              <Text style={styles.buttonText}>Go to Food Menu</Text>
            </TouchableOpacity>
      
          </ScrollView>
        </View>
      )}

      {/* Ekrani Login */}
      {screen === 'login' && (
        <LoginScreen
          navigateToHome={navigateToHome}
          navigateToSignup={navigateToSignup}
          navigateToForgotPassword={navigateToForgotPassword}
          navigateToFood={navigateToFood}
        />
      )}

      {/* Ekrani Signup */}
      {screen === 'signup' && <SignupScreen navigateToLogin={navigateToLogin} />}

      {/* Ekrani Forgot Password */}
      {screen === 'forgotPassword' && <ForgotPasswordScreen navigateToHome={navigateToHome} />}

      {/* Ekrani Food Menu */}
      {screen === 'food' && <FoodScreen navigateToHome={navigateToHome} navigateToAboutUs={navigateToAboutUs} navigateToContactUs={navigateToContactUs} />}

          {screen === 'contactUs' && <ContactUs navigateToHome={navigateToHome} />}
          {screen === 'aboutUs' && <AboutUs navigateToHome={navigateToHome} />}

      {/* Ekrani About Us */}

   
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FAFAFA' 
  },
  screen: { 
    alignItems: 'center', 
    padding: 20, 
    width: '100%',
    flex: 1 
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
    color: '#333' 
  },
  subtitle: { 
    fontSize: 18, 
    marginBottom: 20, 
    color: '#777', 
    fontStyle: 'italic' 
  },
  text: { 
    fontSize: 18, 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#555' 
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
    fontWeight: 'bold' 
  },
});
