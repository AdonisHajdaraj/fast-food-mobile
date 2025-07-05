import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';

const API_URL = 'http://10.0.2.2:3012/foods';
const API_EVENTS_URL = 'http://10.0.2.2:3012/events';

export function useFoodController() {
  const [foodData, setFoodData] = useState([]);
  const [newFood, setNewFood] = useState({ name: '', description: '', price: '', image_url: '' });
  const [editingFood, setEditingFood] = useState(null);
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');

  const fetchFoods = async () => {
    try {
      const response = await axios.get(API_URL);
      setFoodData(response.data);
    } catch (error) {
      console.error('Gabim gjatë marrjes së ushqimeve:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_EVENTS_URL);
      setEvents(res.data);
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u ngarkuan eventet');
    }
  };

  const deleteFood = async (id) => {
    Alert.alert('Konfirmim', 'A jeni i sigurt që doni të fshini ushqimin?', [
      { text: 'Jo' },
      {
        text: 'Po',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${id}`);
            setFoodData(foodData.filter(item => item.id !== id));
          } catch (error) {
            Alert.alert('Gabim', 'Nuk u fshi ushqimi');
          }
        },
      },
    ]);
  };

  const addFood = async () => {
    if (!newFood.name || !newFood.price || !newFood.image_url) {
      Alert.alert('Gabim', 'Plotëso të gjitha fushat!');
      return;
    }
    try {
      await axios.post(API_URL, { ...newFood, price: parseFloat(newFood.price) });
      setNewFood({ name: '', description: '', price: '', image_url: '' });
      fetchFoods();
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u shtua ushqimi');
    }
  };

  const updateFood = async () => {
    if (!editingFood.name || !editingFood.price || !editingFood.image_url) {
      Alert.alert('Gabim', 'Plotëso të gjitha fushat!');
      return;
    }
    try {
      await axios.put(`${API_URL}/${editingFood.id}`, {
        ...editingFood,
        price: parseFloat(editingFood.price),
      });
      setEditingFood(null);
      fetchFoods();
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u përditësua ushqimi');
    }
  };

  const addEvent = async () => {
    if (!newEventTitle || !newEventDate) {
      Alert.alert('Gabim', 'Plotëso Titullin dhe Datën për eventin');
      return;
    }
    try {
      await axios.post(API_EVENTS_URL, { title: newEventTitle, date: newEventDate });
      setNewEventTitle('');
      setNewEventDate('');
      fetchEvents();
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u shtua eventi');
    }
  };

  const deleteEvent = async (id) => {
    Alert.alert('Fshi Eventin', 'A doni me të vërtetë të fshini këtë event?', [
      { text: 'Anulo' },
      {
        text: 'Fshi',
        onPress: async () => {
          try {
            await axios.delete(`${API_EVENTS_URL}/${id}`);
            setEvents(events.filter(ev => ev.id !== id));
          } catch (error) {
            Alert.alert('Gabim', 'Nuk u fshi eventi');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchFoods();
    fetchEvents();
  }, []);

  return {
    foodData,
    newFood,
    setNewFood,
    editingFood,
    setEditingFood,
    events,
    newEventTitle,
    setNewEventTitle,
    newEventDate,
    setNewEventDate,
    deleteFood,
    addFood,
    updateFood,
    addEvent,
    deleteEvent,
  };
}
