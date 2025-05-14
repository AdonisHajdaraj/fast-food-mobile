import FoodCard from '..Screens/FoodCard'; // Importimi i komponentit FoodCard
import { FlatList, StyleSheet, Text, View } from 'react-native';

const foodData = [
  { id: '1', name: 'Burger', description: 'Delicious burger with cheese and lettuce' },
  { id: '2', name: 'Pizza', description: 'Tasty pizza with pepperoni and cheese' },
  { id: '3', name: 'Pasta', description: 'Italian pasta with tomato sauce' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fast Food Menu</Text>
      <FlatList
        data={foodData}
        renderItem={({ item }) => <FoodCard food={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
