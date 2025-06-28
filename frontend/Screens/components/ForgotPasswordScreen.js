import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;
const NOTCH_HEIGHT = 35;

const ForgotPasswordScreen = ({ navigateToHome }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!email || !newPassword) {
      Alert.alert('Gabim', 'Ju lutemi plotësoni të dy fushat');
      return;
    }

    try {
      const response = await fetch('http://localhost:3012/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Nuk ishte JSON:', text);
        Alert.alert('Gabim', 'Përgjigje e pavlefshme nga serveri');
        return;
      }

      if (response.ok) {
        Alert.alert('Sukses', data.message);
        navigateToHome();
      } else {
        Alert.alert('Gabim', data.message || 'Ndodhi një gabim');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Gabim', 'Nuk u arrit të lidhet me serverin');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.notch}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        <View style={styles.appContent}>
          {/* Logo */}
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
            }}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Reset Password</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="#777" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Shkruani email-in"
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
              placeholder="Fjalëkalimi i ri"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Ndrysho Fjalëkalimin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneFrame: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
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
    paddingTop: 30,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 34,
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
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default ForgotPasswordScreen;
