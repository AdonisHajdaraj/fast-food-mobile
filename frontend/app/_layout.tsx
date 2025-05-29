import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Importimi i Komponentëve për Ekranet
import AboutUs from '../Screens/user/AboutUs';
import ContactUs from '../Screens/user/ContactUs';
import FoodScreen from '../Screens/admin/FoodScreen';
import ForgotPasswordScreen from '../Screens/components/ForgotPasswordScreen';
import LoginScreen from '../Screens/components/LoginScreen';
import SignupScreen from '../Screens/components/SignupScreen';
import UFoodScreen from '../Screens/user/UserFoodScreen';
import HomeScreen from '../Screens/components/HomeScreen';
import AdminMessagesScreen from '../Screens/admin/AdminMessages';
import AdminScreen from '../Screens/admin/AdminScreen';

export default function App() {
  const [screen, setScreen] = useState('home'); // Përdorim state për të kontrolluar cilin ekran të shfaqim

  // Funksionet për navigim
  const navigateToLogin = () => setScreen('login');
  const navigateToSignup = () => setScreen('signup');
  const navigateToForgotPassword = () => setScreen('forgotPassword');
  const navigateToFood = () => setScreen('food');
  const navigateToHome = () => setScreen('home');
  const navigateToAboutUs = () => setScreen('aboutUs');
  const navigateToContactUs = () => setScreen('contactUs');
  const navigateToUFood = () => setScreen('UFood');
  const navigateToAdminMessages = () => setScreen('adminMessages');
  const navigateToAdminScreen = () => setScreen('admin');
  

  return (
    <View style={styles.container}>
      {/* Ekrani Home */}
      {screen === 'home' && (
        <HomeScreen
          navigateToLogin={navigateToLogin}
        
          navigateToUFood={navigateToUFood}
        />
  
      )}

      {/* Ekrani Login */}
      {screen === 'login' && (
        <LoginScreen
          navigateToHome={navigateToHome}
          navigateToSignup={navigateToSignup}
          navigateToForgotPassword={navigateToForgotPassword}
          navigateToFood={navigateToFood}
          navigateToUFood={navigateToUFood}
        
        />
      )}

      {/* Ekrani Signup */}
      {screen === 'signup' && <SignupScreen navigateToLogin={navigateToLogin} />}

      {/* Ekrani Forgot Password */}
      {screen === 'forgotPassword' && <ForgotPasswordScreen navigateToHome={navigateToHome} />}

      {/* Ekrani Food Menu */}
      {screen === 'food' && (
        <FoodScreen
          navigateToHome={navigateToHome}
          navigateToAboutUs={navigateToAboutUs}
          navigateToAdminMessage={navigateToAdminMessages}
          navigateToAdminScreen={navigateToAdminScreen}
        />
      )}

      {/* Ekrani About Us dhe Contact Us */}
      {screen === 'aboutUs' && <AboutUs navigateToHome={navigateToHome} />}
      {screen === 'contactUs' && <ContactUs navigateToHome={navigateToHome} />}
  {/* Ekrani Admin Messages */}
{screen === 'adminMessages' && <AdminMessagesScreen />}
{screen === 'admin' && <AdminScreen />}



      {/* Ekrani UFood */}
    {screen === 'UFood' && (
  <UFoodScreen 
    navigateToHome={navigateToHome}
    navigateToAboutUs={navigateToAboutUs} 
    navigateToContactUs={navigateToContactUs} 
  />
)}

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
