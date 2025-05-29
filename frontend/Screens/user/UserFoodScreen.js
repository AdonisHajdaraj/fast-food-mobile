import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import axios from 'axios';

const API_URL = 'http://localhost:3012/foods';
const ORDER_API_URL = 'http://localhost:3012/orders';

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 30;

const UFoodScreen = ({ navigateToHome, navigateToAboutUs, navigateToContactUs }) => {
  const [foodData, setFoodData] = useState([]);
  const [cart, setCart] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState('menu'); // 'menu' or 'cart' or 'checkout'
  
  // Form fields për checkout
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    location: '',
    phone: '',
    paymentMethod: '',
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(API_URL);
      setFoodData(response.data);
    } catch (error) {
      console.error('Gabim gjatë marrjes së ushqimeve:', error);
      Alert.alert('Gabim', 'Nuk u morën të dhënat e ushqimeve.');
    }
  };

  const handleAddToCart = (food) => {
    setCart([...cart, food]);
    Alert.alert('Shtuar në shportë', `${food.name} u shtua me sukses.`);
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  // Përditëso fushat e formës
  const handleInputChange = (field, value) => {
    setCheckoutData({ ...checkoutData, [field]: value });
  };

  // Kur klikojmë "Checkout" nga shporta
  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Shporta është bosh', 'Ju lutem shtoni ushqime para se të blini.');
      return;
    }
    setActiveScreen('checkout');
  };

  // Konfirmimi i porosisë me dërgim në backend
  const confirmOrder = async () => {
    const { name, location, phone, paymentMethod } = checkoutData;
    if (!name || !location || !phone || !paymentMethod) {
      Alert.alert('Gabim', 'Ju lutem plotësoni të gjitha fushat.');
      return;
    }

    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

    try {
      const response = await axios.post(ORDER_API_URL, {
        name,
        location,
        phone,
        paymentMethod,
        items: cart,
        total,
      });

      Alert.alert('Porosi e suksesshme', `Faleminderit ${name}! Porosia juaj u regjistrua me ID: ${response.data.orderId}.`);
      setCart([]);
      setCheckoutData({ name: '', location: '', phone: '', paymentMethod: '' });
      setActiveScreen('menu');
    } catch (error) {
      console.error('Gabim gjatë dërgimit të porosisë:', error);
      Alert.alert('Gabim', 'Ndodhi një problem gjatë dërgimit të porosisë.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Phone Frame */}
      <View style={styles.phoneFrame}>
        {/* Notch */}
        <View style={styles.notch} />

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>9:41 AM</Text>
        </View>

        {/* App Content */}
        <View style={styles.appContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.headerButton}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>UFood</Text>
            <TouchableOpacity onPress={navigateToHome}>
              <Text style={styles.headerButton}>🏠</Text>
            </TouchableOpacity>
          </View>

          {/* Sidebar */}
          {sidebarVisible && (
            <View style={styles.sidebar}>
              <TouchableOpacity onPress={() => { toggleSidebar(); navigateToHome(); }}>
                <Text style={styles.sidebarItem}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { toggleSidebar(); navigateToAboutUs(); }}>
                <Text style={styles.sidebarItem}>About Us</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { toggleSidebar(); navigateToContactUs(); }}>
                <Text style={styles.sidebarItem}>Contact Us</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSidebar}>
                <Text style={[styles.sidebarItem, { color: 'red' }]}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          <ScrollView style={styles.content}>
            {/* MENU SCREEN */}
            {activeScreen === 'menu' && (
              foodData.map(food => (
                <View key={food.id} style={styles.card}>
                  <Image source={{ uri: food.image_url }} style={styles.foodImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodDesc}>{food.description}</Text>
                    <Text style={styles.foodPrice}>${food.price}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(food)}>
                      <Text style={styles.addButtonText}>Add to Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            {/* CART SCREEN */}
            {activeScreen === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <Text style={styles.emptyCartText}>Your cart is empty</Text>
                ) : (
                  cart.map((item, index) => (
                    <View key={index} style={styles.cartItem}>
                      <Text style={styles.cartItemText}>{item.name} - ${item.price}</Text>
                      <TouchableOpacity onPress={() => handleRemoveFromCart(index)}>
                        <Text style={styles.removeText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
                {cart.length > 0 && (
                  <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>
                      Checkout (${cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)})
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* CHECKOUT SCREEN */}
            {activeScreen === 'checkout' && (
              <View style={styles.checkoutForm}>
                <Text style={styles.checkoutTitle}>Konfirmo Porosinë</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Emri"
                  value={checkoutData.name}
                  onChangeText={text => handleInputChange('name', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Lokacioni"
                  value={checkoutData.location}
                  onChangeText={text => handleInputChange('location', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Numri i Telefonit"
                  keyboardType="phone-pad"
                  value={checkoutData.phone}
                  onChangeText={text => handleInputChange('phone', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mënyra e Pagesës (p.sh. Cash, Card)"
                  value={checkoutData.paymentMethod}
                  onChangeText={text => handleInputChange('paymentMethod', text)}
                />

                <TouchableOpacity style={styles.confirmButton} onPress={confirmOrder}>
                  <Text style={styles.confirmButtonText}>Konfirmo Porosinë</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => setActiveScreen('cart')}>
                  <Text style={styles.cancelButtonText}>Anulo</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity onPress={() => setActiveScreen('menu')} style={[styles.navButton, activeScreen === 'menu' && styles.navButtonActive]}>
              <Text style={styles.navButtonText}>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveScreen('cart')} style={[styles.navButton, activeScreen === 'cart' && styles.navButtonActive]}>
              <Text style={styles.navButtonText}>Cart ({cart.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333', // sfondi jashtë telefonit
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  appContent: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  header: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerButton: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sidebar: {
    position: 'absolute',
    top: 50,
    left: 0,
    width: 140,
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    zIndex: 10,
  },
  sidebarItem: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    marginBottom: 60,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  foodImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
  },
  foodDesc: {
    fontSize: 14,
    marginVertical: 5,
    color: '#555',
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyCartText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  cartItemText: {
    fontSize: 16,
  },
  removeText: {
    color: 'red',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkoutForm: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  checkoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 55,
    backgroundColor: '#eee',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonActive: {
    backgroundColor: '#ddd',
  },
  navButtonText: {
    fontSize: 16,
  },
});

export default UFoodScreen;
