import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, FlatList, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const TASKS_STORAGE_KEY = '@tasks_list';

const TasksScreen = ({
  navigateToFood,
  navigateToAdminScreen,
  navigateToAdminMessage,
  navigateToTasks,
  navigateToLogin
}) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (saved !== null) {
        setTasks(JSON.parse(saved));
      }
    } catch {
      Alert.alert('Gabim', 'Nuk mund të ngarkohen detyrat.');
    }
  };

  const saveTasks = async (data) => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(data));
    } catch {
      Alert.alert('Gabim', 'Nuk mund të ruhen detyrat.');
    }
  };

  const addTask = () => {
    if (newTaskText.trim() === '') {
      Alert.alert('Paralajmërim', 'Shkruaj një detyrë.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveTasks(updated);
    setNewTaskText('');
  };

  const deleteTask = (id) => {
    const updated = tasks.filter(task => task.id !== id);
    setTasks(updated);
    saveTasks(updated);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.text}</Text>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Icon name="trash-outline" size={24} color="#e53935" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Detyrat</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Shto një detyrë"
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
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          style={{ flexGrow: 1 }}
        />
      )}

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
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    height: 44,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 12,
    borderRadius: 10,
    padding: 10,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    marginRight: 12,
    flexShrink: 1,
    flexWrap: 'wrap',
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

export default TasksScreen;
