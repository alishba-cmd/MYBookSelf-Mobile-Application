import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logobook.jpg')} style={styles.logoImage} />

      <Text style={styles.logo}>📚 MyBookShelf</Text>
      <Text style={styles.tagline}>
        Inspiring Reading Solutions for a Brighter Future
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c0057',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
 logoImage: {
  width: 120,
  height: 120,
  borderRadius: 16,         
  borderWidth: 2,           
  borderColor: '#BFAFFF',   
  resizeMode: 'cover',
  marginBottom: 20,
  shadowColor: '#fff',      
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5,            
},

  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#BFAFFF',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#E0CFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#8A56F0',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SplashScreen;