import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tasks';

const TaskManager = () => {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (e) {
      Alert.alert('Gabim', 'Nuk u ngarkuan detyrat nga ruajtja lokale');
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      Alert.alert('Gabim', 'Nuk u ruajt detyra');
    }
  };

  const addTask = () => {
    if (!taskInput.trim()) {
      Alert.alert('Gabim', 'Ju lutem shkruani një detyrë.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: taskInput,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  // Toggle complete vetëm nëse klikohet tek përfunduarat (mos e përdor më për kalim)
  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Funksioni për të kaluar një detyrë tek "të përfunduarat" vetëm nëse është aktive
  const markAsCompleted = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    ));
    setShowCompleted(true);  // Kaloj në shikimin e të përfunduarave automatikisht
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Filtrim sipas statusit aktiv/përfunduar
  const filteredTasks = tasks.filter(task =>
    showCompleted ? task.completed : !task.completed
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Detyrat e Mia</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Shto një detyrë..."
          value={taskInput}
          onChangeText={setTaskInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Shto</Text>
        </TouchableOpacity>
      </View>

      {/* Filterat: Aktiv / Të përfunduar */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, !showCompleted && styles.filterButtonActive]}
          onPress={() => setShowCompleted(false)}
        >
          <Text style={[styles.filterText, !showCompleted && styles.filterTextActive]}>
            Aktiv
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, showCompleted && styles.filterButtonActive]}
          onPress={() => setShowCompleted(true)}
        >
          <Text style={[styles.filterText, showCompleted && styles.filterTextActive]}>
            Të përfunduar
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>

            {/* Nëse detyra është aktive, shto butonin për përfundim */}
            {!item.completed ? (
              <>
                <Text style={styles.taskText}>{item.text}</Text>
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => markAsCompleted(item.id)}
                >
                  <Text style={styles.completeButtonText}>Përfundo</Text>
                </TouchableOpacity>
              </>
            ) : (
              // Nëse është përfunduar, thjesht shfaq tekstin me stilin e përfunduar
              <>
                <Text style={[styles.taskText, styles.completed]}>{item.text}</Text>
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Text style={styles.delete}>❌</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        )}
      />
    </View>
  );
};

export default TaskManager;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fafafa',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#4caf50',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4caf50',
    marginHorizontal: 10,
  },
  filterButtonActive: {
    backgroundColor: '#4caf50',
  },
  filterText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: 'white',
  },
  taskItem: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
    maxWidth: '70%',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  completeButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  delete: {
    fontSize: 16,
    color: 'red',
  },
});
