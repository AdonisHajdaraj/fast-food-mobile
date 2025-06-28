import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, FlatList, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const NOTCH_HEIGHT = 35;

const TASKS_STORAGE_KEY = '@tasks_list';

const TasksScreen = ({ navigateToFood, navigateToAdminScreen, navigateToAdminMessage, navigateToTasks }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  // Ngarko detyrat nga AsyncStorage kur komponenti ngarkohet
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      Alert.alert('Gabim', 'Nuk mund të ngarkohen detyrat');
    }
  };

  const saveTasks = async (tasksToSave) => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (error) {
      Alert.alert('Gabim', 'Nuk mund të ruhen detyrat');
    }
  };

  const addTask = () => {
    if (newTaskText.trim() === '') {
      Alert.alert('Paralajmërim', 'Shkruaj një detyrë para se ta shtosh.');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTaskText('');
  };

 const deleteTask = (id) => {
  const filteredTasks = tasks.filter(task => task.id !== id);
  setTasks(filteredTasks);
  saveTasks(filteredTasks);
};

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.text}</Text>
     <TouchableOpacity onPress={() => deleteTask(item.id)} style={{ padding: 10 }}>
  <Text style={{ color: 'red', fontWeight: 'bold' }}>Fshi</Text>
</TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.notch}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        <View style={styles.appContent}>
          <Text style={styles.title}>Tasks</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Shto një detyrë të re"
              value={newTaskText}
              onChangeText={setNewTaskText}
              onSubmitEditing={addTask}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Icon name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <Text style={styles.noTasksText}>Nuk ka detyra për momentin.</Text>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={item => item.id}
              renderItem={renderTask}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </View>

        {/* Bottom navigation bar */}
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
  statusBarText: {
    color: '#777',
    fontWeight: '600',
    fontSize: 13,
  },
  appContent: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    height: 44,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 4, color: '#333' },
});

export default TasksScreen;
