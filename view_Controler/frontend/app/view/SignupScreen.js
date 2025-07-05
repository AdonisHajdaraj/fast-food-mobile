import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSignup } from '../Controller/SignupController';

const { width } = Dimensions.get('window');

const SignupScreen = ({ navigateToLogin }) => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    handleSignup,
  } = useSignup(navigateToLogin);

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

        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.link}>Already have an account? Login</Text>
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
    marginBottom: 30,
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
    marginBottom: 20,
    alignItems: 'center',
    width: width * 0.9,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  link: {
    fontSize: 16,
    color: '#3498db',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
