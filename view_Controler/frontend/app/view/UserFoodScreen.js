import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Sidebar from './Header';
import { useUFoodController } from '../Controller/UFoodController';

const UFoodScreen = ({ navigateToUFood, navigateToAboutUs, navigateToContactUs, navigateToLogin }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const {
    foodData,
    cart,
    activeScreen,
    checkoutData,
    events,
    selectedDate,
    selectedDateEvents,
    setActiveScreen,
    handleAddToCart,
    handleRemoveFromCart,
    handleCheckout,
    handleInputChange,
    confirmOrder,
    onDateSelected,
  } = useUFoodController();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const onDatePress = (day) => {
    const filteredEvents = onDateSelected(day);
    if (filteredEvents.length > 0) {
      Alert.alert('Event', filteredEvents[0].title);
    } else {
      Alert.alert('Event', 'Nuk ka evente për këtë datë.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.appContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.headerButton}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Fast Food</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.headerButton}>🔓</Text>
            </TouchableOpacity>
          </View>

          {sidebarVisible && (
            <Sidebar
              onNavigateHome={navigateToUFood}
              onNavigateAboutUs={navigateToAboutUs}
              onNavigateContactUs={navigateToContactUs}
              onNavigateEvents={() => {
                setActiveScreen('events');
                toggleSidebar();
              }}
              onClose={toggleSidebar}
            />
          )}

          <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 60 }}>
            {activeScreen === 'menu' && foodData.map(food => (
              <View key={food.id} style={styles.card}>
                <Image source={{ uri: food.image_url }} style={styles.foodImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodDesc}>{food.description}</Text>
                  <Text style={styles.foodPrice}>${food.price}</Text>
                  <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(food)}>
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {activeScreen === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <Text style={styles.emptyCartText}>Your cart is empty</Text>
                ) : (
                  cart.map((item, index) => (
                    <View key={index} style={styles.cartItem}>
                      <Text style={styles.cartItemText}>{item.name} - ${item.price}</Text>
                      <TouchableOpacity onPress={() => handleRemoveFromCart(index)}>
                        <Text style={styles.removeText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
                {cart.length > 0 && (
                  <TouchableOpacity style={styles.checkoutButton} onPress={() => handleCheckout()}>
                    <Text style={styles.checkoutButtonText}>
                      Checkout (${cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)})
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {activeScreen === 'checkout' && (
              <View style={styles.checkoutForm}>
                <Text style={styles.checkoutTitle}>Konfirmo Porosinë</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Emri"
                  value={checkoutData.name}
                  onChangeText={text => handleInputChange('name', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Lokacioni"
                  value={checkoutData.location}
                  onChangeText={text => handleInputChange('location', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Numri i Telefonit"
                  keyboardType="phone-pad"
                  value={checkoutData.phone}
                  onChangeText={text => handleInputChange('phone', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mënyra e Pagesës (p.sh. Cash, Card)"
                  value={checkoutData.paymentMethod}
                  onChangeText={text => handleInputChange('paymentMethod', text)}
                />

                <TouchableOpacity style={styles.confirmButton} onPress={confirmOrder}>
                  <Text style={styles.confirmButtonText}>Konfirmo Porosinë</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => setActiveScreen('cart')}>
                  <Text style={styles.cancelButtonText}>Anulo</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeScreen === 'events' && (
              <>
                <Calendar
                  onDayPress={onDatePress}
                  markedDates={events}
                  style={styles.calendar}
                />
                {selectedDate && selectedDateEvents.length > 0 && (
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>Eventet më {selectedDate}</Text>
                    {selectedDateEvents.map(event => (
                      <View key={event.id} style={styles.eventItem}>
                        <Text style={styles.eventItemTitle}>{event.title}</Text>
                        <Text>{event.description}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>

          <View style={styles.bottomNav}>
            <TouchableOpacity onPress={() => setActiveScreen('menu')} style={styles.navItem}>
              <Text style={[styles.navText, activeScreen === 'menu' && styles.navTextActive]}>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveScreen('cart')} style={styles.navItem}>
              <Text style={[styles.navText, activeScreen === 'cart' && styles.navTextActive]}>Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveScreen('events')} style={styles.navItem}>
              <Text style={[styles.navText, activeScreen === 'events' && styles.navTextActive]}>Events</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
   
  },
  phoneFrame: {
    width: 400,
    height: 830,
    backgroundColor: '#000',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#333',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  appContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 40,
   marginTop:26,
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
   headerButton: {
    color: '#fff',
    fontSize: 24,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
  },
 content: {
    flex: 1,
    paddingHorizontal: 14,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop:15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  foodImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  foodName: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 5,
  },
  foodDesc: {
    color: '#555',
    marginBottom: 5,
  },
  foodPrice: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2980b9',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#2980b9',
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyCartText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#777',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  cartItemText: {
    fontSize: 16,
  },
  removeText: {
    color: 'red',
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  checkoutForm: {
    padding: 10,
  },
  checkoutTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  calendar: {
    marginTop: 10,
  },
  eventDetails: {
    marginTop: 15,
  },
  eventTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 5,
  },
  eventItem: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  eventItemTitle: {
    fontWeight: '700',
  },
bottomNav: {
    height: 58,
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    color: '#cbd6e8',
    fontWeight: '600',
    fontSize: 13,
  },
  navTextActive: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default UFoodScreen;
