import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import WeatherCard from '../user/WeatherCard';

const Sidebar = ({
  onNavigateHome,
  onNavigateAboutUs,
  onNavigateContactUs,
  onNavigateEvents,
  onClose,
}) => {
  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.sidebarCard}>
        <SidebarItem icon="home-outline" label="Home" onPress={() => { onClose(); onNavigateHome(); }} />
        <SidebarItem icon="information-circle-outline" label="About Us" onPress={() => { onClose(); onNavigateAboutUs(); }} />
        <SidebarItem icon="call-outline" label="Contact Us" onPress={() => { onClose(); onNavigateContactUs(); }} />
        <SidebarItem icon="calendar-outline" label="Events" onPress={() => { onClose(); onNavigateEvents(); }} />
        <View style={styles.divider} />
        <SidebarItem icon="close-outline" label="Close" onPress={onClose} color="#e74c3c" />
      </View>

      <View style={styles.weatherSection}>
        <WeatherCard />
      </View>
    </View>
  );
};

const SidebarItem = ({ icon, label, onPress, color = '#34495e' }) => (
  <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
    <Icon name={icon} size={26} color={color} style={styles.icon} />
    <Text style={[styles.itemText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sidebarContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    width: 280,
    backgroundColor: '#fefefe',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 5, height: 5 },
    elevation: 12,
    paddingVertical: 25,
    paddingHorizontal: 20,
    zIndex: 110,
  },
  sidebarCard: {
    // Empty container to hold items nicely spaced
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ee',
    marginHorizontal: -20, // negate paddingHorizontal for full width
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  icon: {
    width: 30,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#dfe6e9',
    marginVertical: 20,
  },
  weatherSection: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
});

export default Sidebar;
