import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://mybookshelf-16bd5-default-rtdb.firebaseio.com/';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Validation Error', 'Please enter both email and password');
    return;
  }

  try {
    const res = await axios.get(`${BASE_URL}/users.json`);
    const users = res.data;

    let loggedInUser = null;

    for (let key in users) {
      if (
        users[key].email.toLowerCase() === email.toLowerCase() &&
        users[key].password === password
      ) {
        loggedInUser = { id: key, ...users[key] };
        break;
      }
    }

    if (loggedInUser) {
  await AsyncStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));


  Alert.alert('Login Success', `Welcome back, ${loggedInUser.username || 'User'}!`);

  navigation.reset({
    index: 0,
    routes: [{ name: 'MainTabs', params: { user: loggedInUser } }],
  });
} else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    Alert.alert('Login Error', 'Something went wrong while logging in.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log in</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#BDAEFF"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        placeholderTextColor="#BDAEFF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.sharedButton} onPress={handleLogin}>
        <Text style={styles.sharedButtonText}>Log in</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>Don't have an account?</Text>

      <TouchableOpacity style={styles.sharedButton} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.sharedButtonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c0057',
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#EBD6FF',
    marginBottom: 30,
    textAlign: 'left',
  },
  label: {
    color: '#EBD6FF',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#4a2560',
    padding: 12,
    borderRadius: 12,
    color: '#fff',
    marginBottom: 20,
  },
  sharedButton: {
    backgroundColor: '#A77CFF',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    width: '100%',
  },
  sharedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#EBD6FF',
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 14,
  },
});

export default LoginScreen;