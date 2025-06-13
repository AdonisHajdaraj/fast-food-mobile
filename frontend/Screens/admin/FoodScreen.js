import React, { useEffect, useState } from 'react';
import {
  Alert, Image, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, Platform
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import WeatherCard from '../user/WeatherCard';
import { Calendar } from 'react-native-calendars';

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 30;

const API_URL = 'http://localhost:3012/foods';
const API_EVENTS_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3012/events'
  : 'http://localhost:3012/events';

const FoodScreen = ({
  navigateToHome, navigateToAboutUs, navigateToAdminScreen, navigateToAdminMessage
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [foodData, setFoodData] = useState([]);
  const [newFood, setNewFood] = useState({ name: '', description: '', price: '', image_url: '' });
  const [newMessagesCount, setNewMessagesCount] = useState(3);
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(API_URL);
      setFoodData(response.data);
    } catch (error) {
      console.error('Gabim gjatë marrjes së ushqimeve:', error);
    }
  };

  const deleteFood = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setFoodData(foodData.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u fshi ushqimi');
    }
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

  const editFood = async (food) => {
    try {
      await axios.put(`${API_URL}/${food.id}`, { ...food, name: food.name + ' (edited)' });
      fetchFoods();
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u ndryshua ushqimi');
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_EVENTS_URL);
      setEvents(res.data);
      const marks = {};
      res.data.forEach(ev => {
        marks[ev.date] = { marked: true, dotColor: 'blue' };
      });
      setMarkedDates(marks);
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u ngarkuan eventet');
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

  useEffect(() => {
    fetchFoods();
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.notch} />
        <View style={styles.statusBar}><Text style={styles.statusBarText}>9:41 AM</Text></View>

        <View style={styles.appContent}>
          <TouchableOpacity style={styles.sidebarButton} onPress={toggleSidebar}>
            <Text style={styles.buttonText}>☰</Text>
          </TouchableOpacity>

          <View style={styles.bellContainer}>
            <TouchableOpacity onPress={navigateToAdminMessage}>
              <Icon name="notifications-outline" size={28} color="#000" />
              {newMessagesCount > 0 && (
                <View style={styles.notificationBadge}><Text style={styles.badgeText}>{newMessagesCount}</Text></View>
              )}
            </TouchableOpacity>
          </View>

          {isSidebarOpen && (
            <View style={styles.sidebar}>
              <TouchableOpacity onPress={() => { toggleSidebar(); navigateToHome(); }}><Text style={styles.sidebarItem}>• Home</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { toggleSidebar(); navigateToAdminScreen(); }}><Text style={styles.sidebarItem}> Admin Panel</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { toggleSidebar(); navigateToAboutUs(); }}><Text style={styles.sidebarItem}>• About us</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { toggleSidebar(); navigateToAdminMessage(); }}><Text style={styles.sidebarItem}>• Admin Messages</Text></TouchableOpacity>
              <TouchableOpacity onPress={toggleSidebar}><Text style={styles.sidebarItem}>• Close</Text></TouchableOpacity>
              <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: '#bbb', paddingTop: 10 }}>
                <WeatherCard />
              </View>
            </View>
          )}

          <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 60 }}>
            <Text style={styles.title}>Our Menu</Text>

            <View style={styles.addSection}>
              <TextInput style={styles.input} placeholder="Name" value={newFood.name} onChangeText={(text) => setNewFood({ ...newFood, name: text })} />
              <TextInput style={styles.input} placeholder="Description" value={newFood.description} onChangeText={(text) => setNewFood({ ...newFood, description: text })} />
              <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" value={newFood.price} onChangeText={(text) => setNewFood({ ...newFood, price: text })} />
              <TextInput style={styles.input} placeholder="Image URL" value={newFood.image_url} onChangeText={(text) => setNewFood({ ...newFood, image_url: text })} />
              <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={addFood}>
                <Text style={styles.buttonText}>Add Food</Text>
              </TouchableOpacity>
            </View>

            {foodData.map((food) => (
              <View key={food.id} style={styles.foodItem}>
                <Image source={{ uri: food.image_url }} style={styles.foodImage} />
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodDescription}>{food.description}</Text>
                <Text style={styles.foodPrice}>${food.price}</Text>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#007bff' }]} onPress={() => editFood(food)}>
                  <Text style={styles.buttonText}>Edit</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#dc3545' }]} onPress={() => deleteFood(food.id)}>
                  <Text style={styles.buttonText}>Delete</Text></TouchableOpacity>
              </View>
            ))}

            {/* Event Calendar UI */}
            <Text style={[styles.title, { marginTop: 40 }]}>Event Calendar</Text>
            <Calendar
              onDayPress={day => { setSelectedDate(day.dateString); setNewEventDate(day.dateString); }}
              markedDates={{ ...markedDates, ...(selectedDate ? { [selectedDate]: { selected: true, selectedColor: 'purple' } } : {}) }}
            />
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontWeight: 'bold' }}>Add New Event</Text>
              <TextInput placeholder="Event Title" style={styles.input} value={newEventTitle} onChangeText={setNewEventTitle} />
              <TextInput placeholder="Date (YYYY-MM-DD)" style={styles.input} value={newEventDate} onChangeText={setNewEventDate} />
              <TouchableOpacity onPress={addEvent} style={[styles.button, { backgroundColor: 'blue' }]}>
                <Text style={styles.buttonText}>Add Event</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={navigateToHome}><Text style={styles.link}>Back to Home</Text></TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  phoneFrame: {
    width: PHONE_WIDTH, height: PHONE_HEIGHT, backgroundColor: 'black', borderRadius: 50,
    shadowColor: '#000', shadowOpacity: 0.9, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, overflow: 'hidden'
  },
  notch: {
    width: 200, height: NOTCH_HEIGHT, backgroundColor: 'black',
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20, alignSelf: 'center', marginTop: 10, zIndex: 2
  },
  statusBar: { height: 20, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
  statusBarText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  appContent: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 0 },
  sidebarButton: {
    position: 'absolute', top: 10, left: 10, backgroundColor: '#4CAF50',
    padding: 10, borderRadius: 5, zIndex: 10,
  },
  bellContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
  },
  notificationBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sidebar: {
    position: 'absolute', top: 0, left: 0, bottom: 0, width: 250,
    backgroundColor: '#333', paddingTop: 60, paddingLeft: 20, zIndex: 9,
  },
  sidebarItem: { color: '#fff', fontSize: 20, marginBottom: 20 },
  scrollContainer: { flex: 1, marginTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  addSection: { marginBottom: 30 },
  input: {
    height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10,
    paddingHorizontal: 10, borderRadius: 5, backgroundColor: '#fff'
  },
  foodItem: {
    marginBottom: 20, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
    padding: 15
  },
  foodImage: { width: '100%', height: 180, borderRadius: 10, marginBottom: 10 },
  foodName: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  foodDescription: { fontSize: 14, color: '#666', marginBottom: 5 },
  foodPrice: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50', marginBottom: 10 },
  button: {
    paddingVertical: 10, borderRadius: 5, marginBottom: 10, alignItems: 'center'
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  link: {
    textAlign: 'center', color: '#007bff', fontSize: 16, marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default FoodScreen;
