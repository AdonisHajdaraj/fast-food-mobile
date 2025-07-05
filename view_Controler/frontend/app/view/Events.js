import React from 'react';
import { View, Text, Alert, StyleSheet, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';

const { width, height } = Dimensions.get('window');

const Events = ({
  events,
  eventData,
  selectedDate,
  setSelectedDate,
  setSelectedDateEvents,
  formatDate
}) => {

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
        style={styles.calendar}
        theme={{
          selectedDayBackgroundColor: '#2980b9',
          todayTextColor: '#2980b9',
          arrowColor: '#2980b9',
          textSectionTitleColor: '#333',
          dayTextColor: '#333',
        }}
        markedDates={{
          ...events,
          [selectedDate]: { selected: true, selectedColor: '#2980b9' },
        }}
        onDayPress={onDateSelected}
      />
      {selectedDate && (
        <View style={styles.eventsList}>
          <Text style={styles.selectedDateText}>Eventet e datës {selectedDate}:</Text>
          {eventData
            .filter(event => formatDate(event.date) === selectedDate)
            .map(event => (
              <Text key={event.id} style={styles.eventItem}>{event.title}</Text>
            ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eventsContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#2980b9',
  },
  calendar: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  eventsList: {
    marginTop: 20,
  },
  selectedDateText: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  eventItem: {
    fontSize: 15,
    color: '#555',
    marginVertical: 4,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2980b9',
  },
});

export default Events;
