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
  Platform,
} from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import Sidebar from '../user/Header';  // Kontrollo rrugën sipas strukturës tënde

const API_URL = 'http://localhost:3012/foods';
const ORDER_API_URL = 'http://localhost:3012/orders';

const API_EVENTS_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3012/events'
  : 'http://localhost:3012/events';

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 35;

const UFoodScreen = ({ navigateToHome, navigateToAboutUs, navigateToContactUs }) => {
  const [foodData, setFoodData] = useState([]);
  const [cart, setCart] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState('menu');
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    location: '',
    phone: '',
    paymentMethod: '',
  });

  const [events, setEvents] = useState({});
  const [eventData, setEventData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  // Nxjerr vetëm datën nga datetime string
  const formatDate = (datetime) => {
    if (!datetime) return '';
    return datetime.split('T')[0];
  };

  useEffect(() => {
    fetchFoods();
    fetchEvents();
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

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_EVENTS_URL);
      const eventDataResponse = response.data;

      const formattedEvents = {};
      eventDataResponse.forEach(event => {
        const date = formatDate(event.date);
        formattedEvents[date] = { marked: true, dotColor: 'red' };
      });

      setEvents(formattedEvents);
      setEventData(eventDataResponse);
    } catch (error) {
      console.error('Gabim gjatë marrjes së eventeve:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleAddToCart = (food) => {
    setCart([...cart, food]);
    Alert.alert('Ushqimi u shtua në karrocë');
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Shporta është bosh');
      return;
    }
    setActiveScreen('checkout');
  };

  const handleInputChange = (field, value) => {
    setCheckoutData({ ...checkoutData, [field]: value });
  };

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

  const onDateSelected = (day) => {
    const selectedDateStr = day.dateString;

    const filteredEvents = eventData.filter(event => formatDate(event.date) === selectedDateStr);

    if (filteredEvents.length > 0) {
      Alert.alert('Event', filteredEvents[0].title);
    } else {
      Alert.alert('Event', 'Nuk ka evente për këtë datë.');
    }

    setSelectedDate(selectedDateStr);
    setSelectedDateEvents(filteredEvents);
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        {/* Notch */}
        <View style={styles.notch}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        {/* App Content */}
        <View style={styles.appContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.headerButton}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Fast Food</Text>
            <TouchableOpacity onPress={navigateToHome}>
              <Text style={styles.headerButton}>🏠</Text>
            </TouchableOpacity>
          </View>

          {sidebarVisible && (
            <Sidebar
              onNavigateHome={navigateToHome}
              onNavigateAboutUs={navigateToAboutUs}
              onNavigateContactUs={navigateToContactUs}
              onNavigateEvents={() => {
                setActiveScreen('events');
                toggleSidebar();
              }}
              onClose={toggleSidebar}
            />
          )}

          <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 60 }}>
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

            {activeScreen === 'events' && (
              <>
                <Calendar
                  onDayPress={onDateSelected}
                  markedDates={events}
                  style={styles.calendar}
                />
                {selectedDate && selectedDateEvents.length > 0 && (
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>Eventet më {selectedDate}</Text>
                    {selectedDateEvents.map(event => (
                      <View key={event.id} style={styles.eventItem}>
                        <Text style={styles.eventItemTitle}>{event.title}</Text>
                        <Text>{event.description}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>

          {/* Bottom navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity onPress={() => setActiveScreen('menu')} style={styles.navItem}>
              <Text style={[styles.navText, activeScreen === 'menu' && styles.navTextActive]}>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveScreen('cart')} style={styles.navItem}>
              <Text style={[styles.navText, activeScreen === 'cart' && styles.navTextActive]}>Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveScreen('events')} style={styles.navItem}>
              <Text style={[styles.navText, activeScreen === 'events' && styles.navTextActive]}>Events</Text>
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
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    backgroundColor: '#000',
    borderRadius: 40,
    paddingTop: NOTCH_HEIGHT,
    shadowColor: '#333',
    shadowOpacity: 0.7,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: PHONE_WIDTH / 2 - 60,
    width: 120,
    height: NOTCH_HEIGHT,
    backgroundColor: '#111',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  statusBarText: {
    color: '#eee',
    fontWeight: '600',
  },
  appContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  header: {
    height: 50,
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerButton: {
    color: '#fff',
    fontSize: 28,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
  },
  content: {
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#999',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  foodImage: {
    width: 110,
    height: 110,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2980b9',
  },
  foodDesc: {
    fontSize: 14,
    color: '#666',
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  addButton: {
    marginTop: 8,
    backgroundColor: '#2980b9',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyCartText: {
    marginTop: 40,
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartItemText: {
    fontSize: 16,
    color: '#333',
  },
  removeText: {
    color: '#d9534f',
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 20,
    marginHorizontal: 50,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  checkoutForm: {
    padding: 20,
  },
  checkoutTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2980b9',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2980b9',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2980b9',
    fontWeight: '700',
    fontSize: 18,
  },
  bottomNav: {
    height: 60,
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    color: '#cbd6e8',
    fontWeight: '600',
  },
  navTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  calendar: {
    marginTop: 20,
    marginBottom: 10,
  },
  eventDetails: {
    padding: 15,
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    marginBottom: 30,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2980b9',
  },
  eventItem: {
    marginBottom: 12,
  },
  eventItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UFoodScreen;
