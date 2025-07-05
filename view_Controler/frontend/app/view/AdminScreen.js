import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAdminController } from '../Controller/A';

const { width } = Dimensions.get('window');

const AdminScreen = ({
  navigateToFood,
  navigateToAdminScreen,
  navigateToAdminMessage,
  navigateToTasks,
  navigateToLogin,
}) => {
  const { orders, loading, deleteOrder } = useAdminController();

  return (
    <View style={styles.container}>
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

      {/* Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={navigateToFood}>
          <Icon name="home-outline" size={28} color="#333" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToAdminScreen}>
          <Icon name="settings-outline" size={28} color="#333" />
          <Text style={styles.navText}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToAdminMessage}>
          <Icon name="chatbubble-ellipses-outline" size={28} color="#333" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToTasks}>
          <Icon name="list-outline" size={28} color="#333" />
          <Text style={styles.navText}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToLogin}>
          <Icon name="log-out-outline" size={28} color="#e53935" />
          <Text style={[styles.navText, { color: '#e53935' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingTop: 50,
    paddingHorizontal: 16,
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
    width: '100%',   
    alignSelf: 'center',      
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    alignItems: 'center',
    marginHorizontal: 12,      
  },
  navText: { fontSize: 12, marginTop: 4, color: '#333' },
});

export default AdminScreen;
