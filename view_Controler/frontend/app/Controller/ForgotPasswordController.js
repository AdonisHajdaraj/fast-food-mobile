import { useState } from 'react';
import { Alert } from 'react-native';

const API_URL = 'http://10.0.2.2:3012/api/reset-password';

export function useForgotPassword(navigateToHome) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!email || !newPassword) {
      Alert.alert('Gabim', 'Ju lutemi plotësoni të dy fushat');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
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
      Alert.alert('Gabim', 'Nuk u arrit të lidhet me serverin');
    }
  };

  return {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    handleResetPassword,
  };
}
