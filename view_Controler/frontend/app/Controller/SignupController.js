import { useState } from 'react';
import { Alert } from 'react-native';

const SIGNUP_API_URL = 'http://10.0.2.2:3012/api/register';

export function useSignup(navigateToLogin) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Signup Failed', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(SIGNUP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Signup Success', 'You have successfully signed up!');
        navigateToLogin();
      } else {
        Alert.alert('Signup Failed', data.message || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Signup Failed', 'An error occurred. Please try again later.');
      console.error(error);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    handleSignup,
  };
}
