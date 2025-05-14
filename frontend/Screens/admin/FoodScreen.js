import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';

// Zëvendësoje me IP të kompjuterit tënd
const API_URL = 'http://localhost:3012/foods';

const FoodScreen = ({ navigateToHome, navigateToAboutUs, navigateToContactUs }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [foodData, setFoodData] = useState([]);
  const [newFood, setNewFood] = useState({ name: '', description: '', price: '', image_url: '' });

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
      await axios.post(API_URL, {
        ...newFood,
        price: parseFloat(newFood.price),
      });
      setNewFood({ name: '', description: '', price: '', image_url: '' });
      fetchFoods();
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u shtua ushqimi');
    }
  };

  const editFood = async (food) => {
    try {
      await axios.put(`${API_URL}/${food.id}`, {
        ...food,
        name: food.name + ' (edited)',
      });
      fetchFoods();
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u ndryshua ushqimi');
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sidebarButton} onPress={toggleSidebar}>
        <Text style={styles.buttonText}>☰</Text>
      </TouchableOpacity>

      {isSidebarOpen && (
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={() => { toggleSidebar(); navigateToHome(); }}>
            <Text style={styles.sidebarItem}>• Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { toggleSidebar(); navigateToAboutUs(); }}>
            <Text style={styles.sidebarItem}>• About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { toggleSidebar(); navigateToContactUs(); }}>
            <Text style={styles.sidebarItem}>• Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSidebar}>
            <Text style={styles.sidebarItem}>• Close</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Our Menu</Text>

        <View style={styles.addSection}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newFood.name}
            onChangeText={(text) => setNewFood({ ...newFood, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newFood.description}
            onChangeText={(text) => setNewFood({ ...newFood, description: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={newFood.price}
            onChangeText={(text) => setNewFood({ ...newFood, price: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={newFood.image_url}
            onChangeText={(text) => setNewFood({ ...newFood, image_url: text })}
          />
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

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#007bff' }]}
              onPress={() => editFood(food)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#dc3545' }]}
              onPress={() => deleteFood(food.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={navigateToHome}>
          <Text style={styles.link}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  scrollContainer: { flex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  addSection: { marginBottom: 30 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  foodItem: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  foodImage: { width: '100%', height: 200, resizeMode: 'cover' },
  foodName: { fontSize: 24, fontWeight: 'bold', margin: 10, color: '#333' },
  foodDescription: {
    fontSize: 16,
    marginHorizontal: 10,
    marginBottom: 10,
    color: '#777',
  },
  foodPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  link: { color: '#1E90FF', textAlign: 'center', marginTop: 20 },

  sidebarButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    zIndex: 2,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#333',
    paddingTop: 60,
    paddingLeft: 20,
    zIndex: 1,
  },
  sidebarItem: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
});

export default FoodScreen;
