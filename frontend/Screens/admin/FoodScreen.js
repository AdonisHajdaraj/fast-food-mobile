import React, { useEffect, useState } from 'react';
import {
  Alert, Image, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, Modal
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 35;


const API_URL = 'http://localhost:3012/foods';
const API_EVENTS_URL = 'http://localhost:3012/events';

const FoodScreen = ({
  navigateToHome,
  navigateToAdminScreen,
  navigateToAdminMessage,
  navigateToTasks,
  navigateToLogin,
}) => {
  const [foodData, setFoodData] = useState([]);
  const [newFood, setNewFood] = useState({ name: '', description: '', price: '', image_url: '' });
  const [editingFood, setEditingFood] = useState(null); // <-- shtuar për edit
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [modalVisibleFood, setModalVisibleFood] = useState(false);
  const [modalVisibleEvent, setModalVisibleEvent] = useState(false);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(API_URL);
      setFoodData(response.data);
    } catch (error) {
      console.error('Gabim gjatë marrjes së ushqimeve:', error);
    }
  };

  const deleteFood = async (id) => {
    Alert.alert(
      'Konfirmim',
      'A jeni i sigurt që doni të fshini ushqimin?',
      [
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
          }
        }
      ]
    );
  };

  const addFood = async () => {
    if (!newFood.name || !newFood.price || !newFood.image_url) {
      Alert.alert('Gabim', 'Plotëso të gjitha fushat!');
      return;
    }
    try {
      await axios.post(API_URL, { ...newFood, price: parseFloat(newFood.price) });
      setNewFood({ name: '', description: '', price: '', image_url: '' });
      setModalVisibleFood(false);
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
        name: editingFood.name,
        description: editingFood.description,
        price: parseFloat(editingFood.price),
        image_url: editingFood.image_url,
      });
      setEditingFood(null);
      setModalVisibleFood(false);
      fetchFoods();
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u përditësua ushqimi');
    }
  };

  const openEditModal = (food) => {
    setEditingFood({ ...food, price: String(food.price) }); // price në string për TextInput
    setModalVisibleFood(true);
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_EVENTS_URL);
      setEvents(res.data);
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
      setModalVisibleEvent(false);
      fetchEvents();
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u shtua eventi');
    }
  };

  const deleteEvent = async (id) => {
    Alert.alert(
      'Fshi Eventin',
      'A doni me të vërtetë të fshini këtë event?',
      [
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
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchFoods();
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.notch}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>
        <View style={styles.appContent}>
          <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 100 }}>
            <Text style={styles.title}>Our Menu</Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#28a745' }]}
              onPress={() => {
                setNewFood({ name: '', description: '', price: '', image_url: '' });
                setEditingFood(null);
                setModalVisibleFood(true);
              }}
            >
              <Text style={styles.buttonText}>Add Food</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#007bff' }]}
              onPress={() => setModalVisibleEvent(true)}
            >
              <Text style={styles.buttonText}>Add Event</Text>
            </TouchableOpacity>

            {foodData.map(food => (
              <View key={food.id} style={styles.foodItem}>
                <Image source={{ uri: food.image_url }} style={styles.foodImage} />
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodDescription}>{food.description}</Text>
                <Text style={styles.foodPrice}>${food.price}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#007bff', flex: 1, marginRight: 6 }]}
                    onPress={() => openEditModal(food)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#dc3545', flex: 1, marginLeft: 6 }]}
                    onPress={() => deleteFood(food.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {events.map(event => (
              <View key={event.id} style={styles.foodItem}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.foodName}>{event.title}</Text>
                  <TouchableOpacity onPress={() => deleteEvent(event.id)}>
                    <MaterialIcons name="delete" size={24} color="#dc3545" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.foodDescription}>Date: {event.date}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Modal për Add dhe Edit Food (një modal për të dyja) */}
          <Modal visible={modalVisibleFood} transparent animationType="fade">
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{editingFood ? 'Edit Food' : 'Add New Food'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={editingFood ? editingFood.name : newFood.name}
                  onChangeText={(text) => {
                    if (editingFood) setEditingFood({ ...editingFood, name: text });
                    else setNewFood({ ...newFood, name: text });
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={editingFood ? editingFood.description : newFood.description}
                  onChangeText={(text) => {
                    if (editingFood) setEditingFood({ ...editingFood, description: text });
                    else setNewFood({ ...newFood, description: text });
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  keyboardType="numeric"
                  value={editingFood ? editingFood.price : newFood.price}
                  onChangeText={(text) => {
                    if (editingFood) setEditingFood({ ...editingFood, price: text });
                    else setNewFood({ ...newFood, price: text });
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Image URL"
                  value={editingFood ? editingFood.image_url : newFood.image_url}
                  onChangeText={(text) => {
                    if (editingFood) setEditingFood({ ...editingFood, image_url: text });
                    else setNewFood({ ...newFood, image_url: text });
                  }}
                />
                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={[styles.button, { flex: 1, backgroundColor: editingFood ? '#007bff' : '#28a745', marginRight: 8 }]}
                    onPress={editingFood ? updateFood : addFood}
                  >
                    <Text style={styles.buttonText}>{editingFood ? 'Update' : 'Save'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { flex: 1, backgroundColor: '#ccc' }]}
                    onPress={() => {
                      setModalVisibleFood(false);
                      setEditingFood(null);
                      setNewFood({ name: '', description: '', price: '', image_url: '' });
                    }}
                  >
                    <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal visible={modalVisibleEvent} transparent animationType="fade">
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Event</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Event Title"
                  value={newEventTitle}
                  onChangeText={(text) => setNewEventTitle(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={newEventDate}
                  onChangeText={(text) => setNewEventDate(text)}
                />
                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={[styles.button, { flex: 1, backgroundColor: '#007bff', marginRight: 8 }]}
                    onPress={addEvent}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { flex: 1, backgroundColor: '#ccc' }]}
                    onPress={() => setModalVisibleEvent(false)}
                  >
                    <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={navigateToHome}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  phoneFrame: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  notch: {
    width: 210,
    height: NOTCH_HEIGHT,
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  statusBarText: { color: '#777', fontWeight: '600', fontSize: 13 },
  appContent: { flex: 1, backgroundColor: '#fafafa', padding: 20, paddingBottom: 90 },
  scrollContainer: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  foodItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  foodImage: { width: '100%', height: 150, borderRadius: 15, marginBottom: 8 },
  foodName: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  foodDescription: { fontSize: 14, color: '#555', marginBottom: 6 },
  foodPrice: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    width: PHONE_WIDTH,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 4, color: '#333' },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    width: PHONE_WIDTH * 0.9,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default FoodScreen;
