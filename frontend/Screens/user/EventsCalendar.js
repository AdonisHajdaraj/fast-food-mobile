import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Agenda } from 'react-native-calendars';
import axios from 'axios';

const EVENTS_API_URL = 'http://localhost:3012/events'; // supozojmë që ke një endpoint të tillë

const EventsScreen = () => {
  const [events, setEvents] = useState({});
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(EVENTS_API_URL);
      const eventData = response.data;

      // Konvertojmë eventet në formatin e kërkuar nga Calendar
      const formattedEvents = {};
      eventData.forEach(event => {
        formattedEvents[event.date] = { marked: true, dotColor: 'red', customStyles: { container: { backgroundColor: '#f99' } } };
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Gabim gjatë marrjes së eventeve:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ghghg</Text>
      <Calendar
        markedDates={events}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          arrowColor: 'orange',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15
  }
});

export default EventsScreen;
