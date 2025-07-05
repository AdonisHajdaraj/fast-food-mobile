import React from 'react';
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
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useLogin } from '../Controller/LoginController';

const { width } = Dimensions.get('window');

const LoginScreen = ({
  navigateToFood,
  navigateToSignup,
  navigateToForgotPassword,
  navigateToUFood,
  
}) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
  } = useLogin(navigateToFood, navigateToUFood);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20}
      >
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
          }}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome Back</Text>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
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
    width: width * 0.9,
    height: 52,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    width: width * 0.9,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9CCC9C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  linkText: {
    color: '#3498db',
    fontSize: 16,
    marginVertical: 6,
    textAlign: 'center',
  },
});

export default LoginScreen;
