import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';

const API_URL = `http://10.0.2.2:3012/foods`;
const ORDER_API_URL = `http://10.0.2.2:3012/orders`;
const API_EVENTS_URL = `http://10.0.2.2:3012/events`;

export function useUFoodController() {
  const [foodData, setFoodData] = useState([]);
  const [cart, setCart] = useState([]);
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

  const handleAddToCart = (food) => {
    setCart(prevCart => [...prevCart, food]);
    Alert.alert('Ushqimi u shtua në karrocë');
  };

  const handleRemoveFromCart = (index) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Shporta është bosh');
      return false;
    }
    setActiveScreen('checkout');
    return true;
  };

  const handleInputChange = (field, value) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }));
  };

  const confirmOrder = async () => {
    const { name, location, phone, paymentMethod } = checkoutData;
    if (!name || !location || !phone || !paymentMethod) {
      Alert.alert('Gabim', 'Ju lutem plotësoni të gjitha fushat.');
      return false;
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
      return true;
    } catch (error) {
      console.error('Gabim gjatë dërgimit të porosisë:', error);
      Alert.alert('Gabim', 'Ndodhi një problem gjatë dërgimit të porosisë.');
      return false;
    }
  };

  const onDateSelected = (day) => {
    const selectedDateStr = day.dateString;

    const filteredEvents = eventData.filter(event => formatDate(event.date) === selectedDateStr);

    setSelectedDate(selectedDateStr);
    setSelectedDateEvents(filteredEvents);

    return filteredEvents;
  };

  return {
    foodData,
    cart,
    activeScreen,
    checkoutData,
    events,
    selectedDate,
    selectedDateEvents,
    setActiveScreen,
    handleAddToCart,
    handleRemoveFromCart,
    handleCheckout,
    handleInputChange,
    confirmOrder,
    onDateSelected,
    toggleSidebar: () => {}, // leave empty here; sidebar state is UI specific, keep in screen
    setSelectedDate,
  };
}
