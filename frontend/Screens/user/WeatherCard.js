import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

const cities = ['Prishtina', 'Prizren', 'Fushë Kosovë', 'Ferizaj', 'Drenas'];
const API_KEY = '983e8027a89ebdeeabca92036596ea3f';

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityIndex, setCityIndex] = useState(0);

  const city = cities[cityIndex];

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );
        setWeather(response.data);
      } catch (err) {
        setError('Nuk mund të ngarkohen të dhënat e motit');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const nextCity = () => {
    setCityIndex((prev) => (prev + 1) % cities.length);
  };

  if (loading) return <ActivityIndicator size="small" color="#000" />;

  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{weather.name}</Text>
      <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
      <Text style={styles.desc}>{weather.weather[0].description}</Text>

      <TouchableOpacity onPress={nextCity} style={styles.button}>
        <Text style={styles.buttonText}>Qyteti tjetër</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#bbb',
    marginTop: 10,
    alignItems: 'center',
  },
  city: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  temp: {
    fontSize: 18,
  },
  desc: {
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default WeatherCard;
