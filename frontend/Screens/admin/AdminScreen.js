import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ORDER_API_URL = 'http://localhost:3012/api/orders';

const AdminScreen = () => {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState('new');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ORDER_API_URL);
      console.log('Te dhenat nga serveri:', res.data);
      setOrders(res.data);
    } catch (error) {
      console.error('Gabim ne marrjen e porosive:', error);
      Alert.alert('Gabim', 'Nuk mund të merren porositë');
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${ORDER_API_URL}/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      Alert.alert('Gabim', 'Ndryshimi i statusit dështoi');
    }
  };

  const deleteOrder = (id) => {
    Alert.alert(
      'Fshi porosinë',
      'A jeni i sigurt që doni ta fshini këtë porosi?',
      [
        { text: 'Jo' },
        { 
          text: 'Po', 
          onPress: async () => {
            try {
              await axios.delete(`${ORDER_API_URL}/${id}`);
              fetchOrders();
            } catch (error) {
              Alert.alert('Gabim', 'Fshirja dështoi');
            }
          }
        }
      ]
    );
  };

  // Për testim, shfaq të gjitha pa filtrim
  const filteredOrders = orders;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menaxhimi i Porosive</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeStatus === 'new' && styles.activeTab]} 
          onPress={() => setActiveStatus('new')}
        >
          <Text style={[styles.tabText, activeStatus === 'new' && styles.activeTabText]}>Porosi e re</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeStatus === 'in-delivery' && styles.activeTab]} 
          onPress={() => setActiveStatus('in-delivery')}
        >
          <Text style={[styles.tabText, activeStatus === 'in-delivery' && styles.activeTabText]}>Në dërgim</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeStatus === 'completed' && styles.activeTab]} 
          onPress={() => setActiveStatus('completed')}
        >
          <Text style={[styles.tabText, activeStatus === 'completed' && styles.activeTabText]}>E kryer</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{marginTop: 20}} />
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredOrders.length === 0 && (
            <Text style={styles.noOrders}>Nuk ka porosi për momentin.</Text>
          )}
          {filteredOrders.map(order => (
            <View key={order.id} style={styles.card}>
              <Text style={styles.orderTitle}>Porosia Nr: {order.id}</Text>
              <Text><Text style={styles.bold}>Emri:</Text> {order.name}</Text>
              <Text><Text style={styles.bold}>Lokacioni:</Text> {order.location}</Text>
              <Text><Text style={styles.bold}>Numri:</Text> {order.phone}</Text>
              <Text><Text style={styles.bold}>Mënyra e Pagesës:</Text> {order.paymentMethod}</Text>
              <Text style={styles.bold}>Ushqimet:</Text>
              {order.items && order.items.map((item, idx) => (
                <Text key={idx}> - {item.name} (${item.price})</Text>
              ))}
              <Text style={[styles.bold, {marginTop: 5}]}>
                Totali: ${parseFloat(order.total).toFixed(2)}
              </Text>

              <View style={styles.actions}>
                {order.status === 'new' && (
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => changeStatus(order.id, 'in-delivery')}
                  >
                    <Text style={styles.actionText}>Dërgo</Text>
                  </TouchableOpacity>
                )}

                {order.status === 'in-delivery' && (
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => changeStatus(order.id, 'completed')}
                  >
                    <Text style={styles.actionText}>Krye</Text>
                  </TouchableOpacity>
                )}

                {order.status === 'completed' && (
                  <TouchableOpacity 
                    style={[styles.actionButton, {backgroundColor: 'red'}]} 
                    onPress={() => deleteOrder(order.id)}
                  >
                    <Text style={styles.actionText}>Fshi</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#ddd' },
  activeTab: { backgroundColor: '#2196F3' },
  tabText: { fontWeight: 'bold', color: '#555' },
  activeTabText: { color: 'white' },
  scrollView: { flex: 1 },
  noOrders: { textAlign: 'center', fontSize: 18, color: '#777', marginTop: 20 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  orderTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  bold: { fontWeight: 'bold' },
  actions: { marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  actionText: { color: 'white', fontWeight: 'bold' },
});

export default AdminScreen;
