import { useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';

const CONTACT_API_URL = 'http://10.0.2.2:3012/contact';

export function useContactUs() {
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (field, value) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendMessage = async () => {
    const { name, email, message } = checkoutData;

    if (!name || !email || !message) {
      Alert.alert('Plotësoni të gjitha fushat e kontaktit.');
      return;
    }

    try {
      await axios.post(CONTACT_API_URL, {
        emri: name,
        email,
        message,
      });

      Alert.alert('Mesazhi u dërgua', `Faleminderit, ${name}. Ne do t'ju kontaktojmë së shpejti!`);
      setCheckoutData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Gabim gjatë dërgimit:', error);
      Alert.alert('Gabim', 'Nuk u dërgua mesazhi. Provo më vonë.');
    }
  };

  return {
    checkoutData,
    handleInputChange,
    handleSendMessage,
  };
}
