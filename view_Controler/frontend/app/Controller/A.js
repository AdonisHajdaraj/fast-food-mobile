import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';

const API_URL = 'http://10.0.2.2:3012/api/orders';

export function useAdminController() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { params: { status: 'new' } });
      setOrders(res.data);
    } catch (error) {
      Alert.alert('Gabim', 'Nuk mund të merren porositë');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u fshi porosia');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    deleteOrder,
  };
}
