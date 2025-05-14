import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginScreen = ({ navigateToHome, navigateToSignup, navigateToForgotPassword, navigateToFood }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (email && password) {
      setIsLoading(true);

      try {
        // Kërkesa për login
        const response = await fetch('http://localhost:3012/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert('Login Success', 'You have successfully logged in!');
          console.log('Role:', data.role);  // Roli është dërguar nga serveri

          // Kontrollojmë rolin për të drejtuar përdoruesin në ekranin përkatës
          if (data.role === 'admin') {
            navigateToHome();  // Admin do të kalojë në ekranin admin
          } else {
            navigateToFood();  // Përdoruesi do të kalojë në ekranin e ushqimeve
          }
        } else {
          Alert.alert('Login Failed', data.message || 'Invalid credentials');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong, please try again.');
        console.error(error);
      } finally {
        setIsLoading(false); // Hiqim ngarkimin kur përfundon kërkesa
      }
    } else {
      Alert.alert('Login Failed', 'Please fill in both email and password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToSignup}>
        <Text style={styles.forgotPassword}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  forgotPassword: {
    color: '#1E90FF',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;
