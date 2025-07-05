import { useState } from 'react';
import { Alert } from 'react-native';

const LOGIN_API_URL = 'http://10.0.2.2:3012/api/login';

export function useLogin(navigateToFood, navigateToUFood) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Login Failed', 'Please fill in both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(LOGIN_API_URL, {
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
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
  };
}
