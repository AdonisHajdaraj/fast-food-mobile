import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const ORDER_API_URL = 'http://localhost:3012/api/orders';

const statusColors = {
  new: '#4CAF50', // e gjelbër për porosi të reja
};

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 30;

const AdminScreen = ({ navigateToFood }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ORDER_API_URL, { params: { status: 'new' } });
      setOrders(res.data);
    } catch (error) {
      Alert.alert('Gabim', 'Nuk mund të merren porositë');
    } finally {
      setLoading(false);
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

  return (
    <View style={styles.container}>
      {/* Frame telefoni origjinal */}
      <View style={styles.phoneFrame}>
        <View style={styles.notch} />
        <View style={styles.statusBar}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        <View style={styles.appContent}>
          <Text style={styles.title}>Porositë e Reja</Text>

          <View style={styles.navigationButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={navigateToFood}>
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
          ) : (
            <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 30 }}>
              {orders.length === 0 && (
                <Text style={styles.noOrders}>Nuk ka porosi të reja për momentin.</Text>
              )}
              {orders.map((order) => (
                <View
                  key={order.id}
                  style={[
                    styles.card,
                    { borderLeftColor: statusColors[order.status], borderLeftWidth: 6 },
                  ]}
                >
                  <Text style={styles.orderTitle}>Porosia Nr: {order.id}</Text>
                  <Text>
                    <Text style={styles.bold}>Emri:</Text> {order.name}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Lokacioni:</Text> {order.location}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Numri:</Text> {order.phone}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Mënyra e Pagesës:</Text> {order.paymentMethod}
                  </Text>
                  <Text style={styles.bold}>Ushqimet:</Text>
                  {order.items &&
                    order.items.map((item, idx) => (
                      <Text key={idx}>
                        {' '}
                        - {item.name} (${item.price})
                      </Text>
                    ))}
                  <Text style={[styles.bold, { marginTop: 5 }]}>
                    Totali: ${parseFloat(order.total).toFixed(2)}
                  </Text>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteOrder(order.id)}
                  >
                    <Text style={styles.deleteButtonText}>Fshi</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
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
    backgroundColor: 'black',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  notch: {
    width: 200,
    height: NOTCH_HEIGHT,
    backgroundColor: 'black',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
    zIndex: 2,
  },
  statusBar: {
    height: 20,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  appContent: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  navigationButtonContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  deleteButton: {
    marginTop: 15,
    backgroundColor: '#e53935',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdminScreen;
