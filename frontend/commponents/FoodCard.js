import { StyleSheet, Text, View } from 'react-native';

export default function FoodCard({ food }) {
  return (
    <View style={styles.card}>
      <Text style={styles.foodName}>{food.name}</Text>
      <Text style={styles.foodDescription}>{food.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodDescription: {
    marginTop: 10,
    color: 'gray',
  },
});
