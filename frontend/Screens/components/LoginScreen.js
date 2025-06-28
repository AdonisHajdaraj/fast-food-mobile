import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const IPHONE_13_PRO_WIDTH = 390;
const IPHONE_13_PRO_HEIGHT = 844;
const NOTCH_HEIGHT = 35;

const LoginScreen = ({
  navigateToHome,
  navigateToSignup,
  navigateToForgotPassword,
  navigateToUFood,
  navigateToFood,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (email && password) {
      setIsLoading(true);

      try {
        const response = await fetch(`http://localhost:3012/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert('Login Success', 'You have successfully logged in!');
          if (data.role === 'admin') {
            navigateToFood();
          } else {
            navigateToUFood();
          }
        } else {
          Alert.alert('Login Failed', data.message || 'Invalid credentials');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong, please try again.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Login Failed', 'Please fill in both email and password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.notch}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.appContent}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={20}
        >
          {/* Logo Image from URL */}
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
            }}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Welcome Back</Text>

          {/* Email Input with Icon */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="#777" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Password Input with Icon */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#777" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToForgotPassword}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToSignup}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
    width: IPHONE_13_PRO_WIDTH,
    height: IPHONE_13_PRO_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  notch: {
    width: 210,
    height: NOTCH_HEIGHT,
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignSelf: 'center',
    marginTop: 12,

    // Center content vertically and horizontally
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBarText: {
    color: '#777',
    fontWeight: '600',
    fontSize: 13,
  },
  appContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 40,
    color: '#222',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#9CCC9C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  linkText: {
    color: '#3498db',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 6,
  },
});

export default LoginScreen;
