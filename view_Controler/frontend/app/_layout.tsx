import React, { useState } from 'react';

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


// Importimi i Komponentëve për Ekranet
import AboutUs from './view/AboutUs';
import ContactUs from './view/ContactUs';
import FoodScreen from './view/FoodScreen';
import ForgotPasswordScreen from './view/ForgotPasswordScreen';
import LoginScreen from './view/LoginScreen';
import SignupScreen from './view/SignupScreen';
import UFoodScreen from './view/UserFoodScreen';
import HomeScreen from './view/HomeScreen';
import AdminMessagesScreen from './view/AdminMessages';
import AdminScreen from './view/AdminScreen';
import TasksScreen from './view/TasksScreen';




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
  const navigateToTasks = () => setScreen('tasks');


  

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
          navigateToFood={navigateToFood}
          navigateToTasks={navigateToTasks}
          navigateToAdminMessage={navigateToAdminMessages}
          navigateToAdminScreen={navigateToAdminScreen} navigateToLogin={navigateToLogin}        />
      )}

      {/* Ekrani About Us dhe Contact Us */}
      {screen === 'aboutUs' && (
        <AboutUs
         
          navigateToAboutUs={navigateToAboutUs}
          navigateToContactUs={navigateToContactUs}
          navigateToUFood={navigateToUFood}
           navigateToLogin={navigateToLogin}
          
        />
      )}
      {screen === 'contactUs' && (
        <ContactUs
           navigateToUFood={navigateToUFood}  
          navigateToAboutUs={navigateToAboutUs}
          navigateToContactUs={navigateToContactUs}
         
             navigateToLogin={navigateToLogin}
        />
      )}
  {/* Ekrani Admin Messages */}
{screen === 'adminMessages' && <AdminMessagesScreen navigateToFood={navigateToFood} navigateToLogin={navigateToLogin}  
navigateToAdminScreen={navigateToAdminScreen} 
navigateToAdminMessage={navigateToAdminMessages} 
navigateToTasks={navigateToTasks}/>}

{screen === 'admin' && <AdminScreen  
        navigateToFood={navigateToFood}
        navigateToAdminMessage={navigateToAdminMessages} 
        navigateToAdminScreen={navigateToAdminScreen} 
        navigateToTasks={navigateToTasks}
        navigateToLogin={navigateToLogin}
        />}



      {/* Ekrani UFood */}
    {screen === 'UFood' && (
  <UFoodScreen 
    navigateToUFood={navigateToUFood}
    navigateToAboutUs={navigateToAboutUs} 
    navigateToContactUs={navigateToContactUs} 
   
     navigateToLogin={navigateToLogin}
    
  />
)}
{screen === 'tasks' && (
  <TasksScreen navigateToFood={navigateToFood} navigateToAdminScreen={navigateToAdminScreen} navigateToAdminMessage={navigateToAdminMessages} navigateToTasks={navigateToTasks} navigateToLogin={navigateToLogin} />
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
