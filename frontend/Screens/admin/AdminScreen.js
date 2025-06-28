import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'http://localhost:3012/api/orders';

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 35;

const AdminScreen = ({
  navigateToFood,
  navigateToAdminScreen,
  navigateToAdminMessage,
  navigateToTasks
}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

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

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        {/* Notch */}
        <View style={styles.notch}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        {/* Content */}
        <View style={styles.appContent}>
          <Text style={styles.title}>📦 Porositë e Reja</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 90, alignItems: 'center' }}>
              {orders.length === 0 ? (
                <Text style={styles.noOrders}>Nuk ka porosi të reja për momentin.</Text>
              ) : (
                orders.map(order => (
                  <View key={order.id} style={styles.card}>
                    <Text style={styles.orderTitle}>Porosia Nr: {order.id}</Text>
                    <Text style={styles.orderLine}><Text style={styles.label}>👤 Emri:</Text> {order.name}</Text>
                    <Text style={styles.orderLine}><Text style={styles.label}>📍 Lokacioni:</Text> {order.location}</Text>
                    <Text style={styles.orderLine}><Text style={styles.label}>📞 Numri:</Text> {order.phone}</Text>
                    <Text style={styles.orderLine}><Text style={styles.label}>💳 Pagesa:</Text> {order.paymentMethod}</Text>

                    <Text style={[styles.label, { marginTop: 8 }]}>🍔 Ushqimet:</Text>
                    {order.items?.map((item, i) => (
                      <Text key={i} style={styles.itemText}>- {item.name} (${item.price})</Text>
                    ))}

                    <Text style={styles.total}>Totali: ${parseFloat(order.total).toFixed(2)}</Text>

                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteOrder(order.id)}>
                      <Text style={styles.deleteButtonText}>Fshi Porosinë</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          )}
        </View>

        {/* Navbar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={navigateToFood}>
            <Icon name="home-outline" size={26} color="#333" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={navigateToAdminScreen}>
            <Icon name="settings-outline" size={26} color="#333" />
            <Text style={styles.navText}>Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={navigateToAdminMessage}>
            <Icon name="chatbubble-ellipses-outline" size={26} color="#333" />
            <Text style={styles.navText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={navigateToTasks}>
            <Icon name="list-outline" size={26} color="#333" />
            <Text style={styles.navText}>Tasks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  phoneFrame: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.3,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  statusBarText: {
    color: '#777',
    fontWeight: '600',
    fontSize: 13,
  },
  appContent: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  noOrders: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  label: { fontWeight: 'bold', color: '#333' },
  orderLine: { marginBottom: 4, color: '#555' },
  itemText: { marginLeft: 8, fontSize: 14, color: '#444' },
  total: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: '#e53935',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    width: PHONE_WIDTH,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 4, color: '#333' },
});

export default AdminScreen;
