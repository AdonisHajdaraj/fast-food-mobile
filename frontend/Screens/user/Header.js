import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import WeatherCard from '../user/WeatherCard'; // kontrollo rrugën në varësi të strukturës sate

const Sidebar = ({
  onNavigateHome,
  onNavigateAboutUs,
  onNavigateContactUs,
  onNavigateEvents,
  onClose,
}) => {
  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={() => { onClose(); onNavigateHome(); }}>
        <Text style={styles.sidebarItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { onClose(); onNavigateAboutUs(); }}>
        <Text style={styles.sidebarItem}>About Us</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { onClose(); onNavigateContactUs(); }}>
        <Text style={styles.sidebarItem}>Contact Us</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { onClose(); onNavigateEvents(); }}>
        <Text style={styles.sidebarItem}>Events</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <Text style={[styles.sidebarItem, { color: 'red' }]}>Close</Text>
      </TouchableOpacity>
      
      

      <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: '#bbb', paddingTop: 10 }}>
        <WeatherCard />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 70,
    left: 0,
    width: 200,
    backgroundColor: '#ddd',
    padding: 15,
    zIndex: 100,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  sidebarItem: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default Sidebar;
