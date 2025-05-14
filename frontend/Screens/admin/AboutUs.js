import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AboutUsScreen = ({ navigateToHome }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://example.com/fastfood-logo.jpg' }} // Vendos logo reale
              style={styles.logo}
            />
            <Text style={styles.title}>About Us</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>Welcome to Our Fast Food Restaurant!</Text>
            <Text style={styles.description}>
              We are passionate about delivering the best fast food with the highest quality ingredients.
              From our delicious burgers to our crispy fries, we aim to bring joy and satisfaction to every meal.
            </Text>

            <Text style={styles.subtitle}>Our Mission</Text>
            <Text style={styles.description}>
              Our mission is to serve fast, fresh, and flavorful food in a welcoming atmosphere, where every
              bite is an experience worth savoring. We are committed to providing excellent service and using
              only the best ingredients.
            </Text>

            <Text style={styles.subtitle}>Our Vision</Text>
            <Text style={styles.description}>
              Our vision is to be the go-to destination for fast food lovers everywhere. We strive to create
              a brand that is synonymous with quality, convenience, and satisfaction.
            </Text>

            <TouchableOpacity style={styles.button} onPress={navigateToHome}>
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  container: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 20, // Reduktojmë radiusin e këndit për të bërë dizajnin më të vogël
    overflow: 'hidden', // Kjo ndihmon që përmbajtja të mos dalë jashtë kufijve të kontenierit
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8, // Reduktim i hijes për t'u përshtatur më mirë në ekranet e vogla
  },
  header: {
    backgroundColor: '#FF6347',
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderTopLeftRadius: 20, // Përshtatje e këndit të lakuar
    borderTopRightRadius: 20,
  },
  logo: {
    width: 80, // Logo më e vogël për ekranin më të vogël
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 26, // Font më i vogël për titullin
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  subtitle: {
    fontSize: 20, // Font më i vogël për nëndihmesat
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14, // Font më i vogël për përshkrimet
    lineHeight: 22,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginTop: 15,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16, // Font më i vogël për butonin
    fontWeight: 'bold',
  },
});

export default AboutUsScreen;
