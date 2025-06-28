import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const IPHONE_13_PRO_WIDTH = 390;
const IPHONE_13_PRO_HEIGHT = 844;
const NOTCH_HEIGHT = 35;

const HomeScreen = ({ navigateToLogin, navigateToUFood }) => {
  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        {/* Notch */}
        <View style={styles.notch}>
          <Text style={styles.statusBarText}>9:41 AM</Text>
        </View>

        {/* App Content */}
        <ScrollView
          contentContainerStyle={styles.appContent}
          showsVerticalScrollIndicator={false}
        >
          {/* E njëjta logo si në Login */}
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
            }}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Welcome to Our Fast Food</Text>
          <Text style={styles.subtitle}>Delicious Meals. Fast Service.</Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={navigateToLogin}
          >
            <MaterialIcons
              name="login"
              size={24}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={navigateToUFood}
          >
            <MaterialIcons
              name="fastfood"
              size={24}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Go to UFood (User View)</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333', // i njejti si Login
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: IPHONE_13_PRO_WIDTH,
    height: IPHONE_13_PRO_HEIGHT,
    backgroundColor: '#fff', // e bardha si në LoginScreen
    borderRadius: 50, // e njejta si në Login
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  notch: {
    width: 210,
    height: NOTCH_HEIGHT,
    backgroundColor: '#f0f0f0', // si në Login
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignSelf: 'center',

    justifyContent: 'center', // qendërso tek vertikalisht
    alignItems: 'center',     // qendërso horizontalisht
    marginTop: 12,
  },
  statusBarText: {
    color: '#777', // i njejti si në Login
    fontWeight: '600',
    fontSize: 13,
  },
  appContent: {
    paddingHorizontal: 32,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: IPHONE_13_PRO_WIDTH * 0.8,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default HomeScreen;
