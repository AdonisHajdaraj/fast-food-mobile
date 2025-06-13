import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ORDER_API_URL = 'http://localhost:3012/api/orders';

const statuses = [
  { label: 'Të gjitha', value: 'all' },
  { label: 'Porosi e re', value: 'new' },
  { label: 'Në dërgim', value: 'in-delivery' },
  { label: 'E kryer', value: 'completed' },
];

const AdminScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

useEffect(() => {
  fetchOrders(filterStatus);
}, [filterStatus]);

const fetchOrders = async (status = 'all') => {
  try {
    setLoading(true);
    const res = await axios.get(ORDER_API_URL, {
      params: { status }
    });
    setOrders(res.data);
  } catch (error) {
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
          },
        },
      ]
    );
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  // Butonat e statusit për filtrim
  const renderFilterButtons = () => {
    return (
      <View style={styles.filterButtonsContainer}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status.value}
            style={[
              styles.filterButton,
              filterStatus === status.value && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus(status.value)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === status.value && styles.filterButtonTextActive,
              ]}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Butonat e ndryshimit te statusit per secilen porosi
  const renderStatusChangeButtons = (order) => {
    // Statuset qe mund te ndryshohen, per shembull:
    // Nga 'new' mund te shkoje 'in-delivery' ose 'completed'
    // Nga 'in-delivery' mund te shkoje 'completed'
    // Nga 'completed' nuk ndryshon (vetem fshihet)
    const nextStatuses = [];

    if (order.status === 'new') {
      nextStatuses.push({ label: 'Në dërgim', value: 'in-delivery' });
      nextStatuses.push({ label: 'E kryer', value: 'completed' });
    } else if (order.status === 'in-delivery') {
      nextStatuses.push({ label: 'E kryer', value: 'completed' });
    }

    return (
      <View style={styles.statusButtonsContainer}>
        {nextStatuses.map((st) => (
          <TouchableOpacity
            key={st.value}
            style={styles.statusChangeButton}
            onPress={() => changeStatus(order.id, st.value)}
          >
            <Text style={styles.statusChangeButtonText}>{st.label}</Text>
          </TouchableOpacity>
        ))}

        {order.status === 'completed' && (
          <TouchableOpacity
            style={[styles.statusChangeButton, styles.deleteButton]}
            onPress={() => deleteOrder(order.id)}
          >
            <Text style={styles.statusChangeButtonText}>Fshi</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menaxhimi i Porosive</Text>

      {renderFilterButtons()}

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredOrders.length === 0 && (
            <Text style={styles.noOrders}>Nuk ka porosi për momentin.</Text>
          )}
          {filteredOrders.map((order) => (
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
              <Text style={[styles.bold, { marginTop: 5 }]}>
                Totali: ${parseFloat(order.total).toFixed(2)}
              </Text>

              {renderStatusChangeButtons(order)}
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
  filterButtonsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15, flexWrap: 'wrap' },
  filterButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    color: '#555',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: 'white',
  },
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
  statusButtonsContainer: { flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' },
  statusChangeButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 5,
  },
  statusChangeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});

export default AdminScreen;
