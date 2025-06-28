// components/Events.js
import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const Events = ({ events, eventData, selectedDate, setSelectedDate, setSelectedDateEvents, formatDate }) => {
  
  const onDateSelected = (day) => {
    const selectedDateStr = day.dateString;
    const filteredEvents = eventData.filter(event => formatDate(event.date) === selectedDateStr);

    if (filteredEvents.length > 0) {
      Alert.alert('Event', filteredEvents[0].title);
    } else {
      Alert.alert('Event', 'Nuk ka evente për këtë datë.');
    }

    setSelectedDate(selectedDateStr);
    setSelectedDateEvents(filteredEvents);
  };

  return (
    <View style={styles.eventsContainer}>
      <Text style={styles.title}>Eventet</Text>
      <Calendar
        markedDates={{
          ...events,
          [selectedDate]: { selected: true, selectedColor: '#2980b9' }
        }}
        onDayPress={onDateSelected}
      />
      {selectedDate && selectedDate.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Eventet e datës {selectedDate}:</Text>
          {eventData.filter(event => formatDate(event.date) === selectedDate).map(event => (
            <Text key={event.id} style={{ marginVertical: 5 }}>{event.title}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eventsContainer: {
    marginVertical: 20,
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2980b9',
  },
});

export default Events;
