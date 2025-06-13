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
import WeatherCard from '../user/WeatherCard';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { Platform } from 'react-native';

const API_URL = 'http://localhost:3012/foods';
const ORDER_API_URL = 'http://localhost:3012/orders';

const API_EVENTS_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3012/events'
  : 'http://localhost:3012/events';

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 30;

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

  // Funksion për nxjerrjen vetëm të pjesës së datës nga datetime string
  const formatDate = (datetime) => {
    if (!datetime) return '';
    return datetime.split('T')[0]; // merr vetëm YYYY-MM-DD
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
        <View style={styles.notch} />
        <View style={styles.statusBar}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>9:41 AM</Text>
        </View>

        <View style={styles.appContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.headerButton}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>UFood</Text>
            <TouchableOpacity onPress={navigateToHome}>
              <Text style={styles.headerButton}>🏠</Text>
            </TouchableOpacity>
          </View>

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
              <TouchableOpacity onPress={() => { toggleSidebar(); setActiveScreen('events'); }}>
                <Text style={styles.sidebarItem}>Events</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSidebar}>
                <Text style={[styles.sidebarItem, { color: 'red' }]}>Close</Text>
              </TouchableOpacity>
              <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: '#bbb', paddingTop: 10 }}>
                <WeatherCard />
              </View>
            </View>
          )}

          <ScrollView style={styles.content}>
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
              <View style={styles.eventsContainer}>
                <Text style={styles.checkoutTitle}>Evente</Text>
                <Calendar
                  markedDates={{
                    ...events,
                    [selectedDate]: { selected: true, selectedColor: 'blue' }
                  }}
                  onDayPress={onDateSelected}
                />
                {selectedDate && selectedDateEvents.length > 0 && (
                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>Eventet e datës {selectedDate}:</Text>
                    {selectedDateEvents.map(event => (
                      <Text key={event.id} style={{ marginVertical: 5 }}>{event.title}</Text>
                    ))}
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => setActiveScreen('menu')}>
              <Text style={styles.footerButton}>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveScreen('cart')}>
              <Text style={styles.footerButton}>Cart ({cart.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveScreen('events')}>
              <Text style={styles.footerButton}>Events</Text>
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
    backgroundColor: 'black',
    borderRadius: 40,
    overflow: 'hidden',
  },
  notch: {
    height: NOTCH_HEIGHT,
    backgroundColor: 'black',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  statusBar: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 50,
    backgroundColor: '#2e86de',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerButton: {
    color: 'white',
    fontSize: 24,
  },
  sidebar: {
    position: 'absolute',
    top: 70,
    left: 0,
    width: 200,
    backgroundColor: '#ddd',
    padding: 15,
    zIndex: 100,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  sidebarItem: {
    fontSize: 16,
    marginVertical: 10,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  foodImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  foodName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  foodDesc: {
    fontSize: 14,
    color: '#555',
  },
  foodPrice: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#27ae60',
    paddingVertical: 6,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cartItemText: {
    fontSize: 16,
  },
  removeText: {
    color: 'red',
  },
  checkoutButton: {
    backgroundColor: '#2980b9',
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  checkoutForm: {
    padding: 10,
  },
  checkoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 10,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  eventsContainer: {
    marginTop: 10,
  },
  footer: {
    height: 50,
    backgroundColor: '#2e86de',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerButton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UFoodScreen;