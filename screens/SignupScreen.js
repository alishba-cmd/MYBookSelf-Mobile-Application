import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import axios from 'axios';

const BASE_URL = 'https://mybookshelf-16bd5-default-rtdb.firebaseio.com/';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    setErrorMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username || !email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/users.json`);
      const users = res.data || {};

      let exists = false;
      for (let key in users) {
        if (users[key].email.toLowerCase() === email.toLowerCase()) {
          exists = true;
          break;
        }
      }

      if (exists) {
        setErrorMessage('You already have an account. Try logging in.');
        return;
      }

      const newUser = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        createdAt: new Date().toISOString(),
      };

      await axios.post(`${BASE_URL}/users.json`, newUser);
      setErrorMessage('');
      Alert.alert('Success', 'Account created successfully');
      navigation.replace('Login');
    } catch (error) {
      console.error('Signup Error:', error.response?.data || error.message);
      setErrorMessage('Something went wrong during signup.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Sign up</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Enter username"
          placeholderTextColor="#BDAEFF"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter email"
          placeholderTextColor="#BDAEFF"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter password"
          placeholderTextColor="#BDAEFF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {errorMessage !== '' && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign up</Text>
        </TouchableOpacity>

        <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          Already have an account? Login
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4A1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#2c0057',
    padding: 25,
    borderRadius: 30,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  heading: {
    fontSize: 24,
    color: '#F7EFFF',
    marginBottom: 25,
    fontWeight: 'bold',
  },
  label: {
    color: '#F7EFFF',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#4a2560',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: '#A77CFF',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FFBABA',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  loginLink: {
    color: '#BDAEFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});

export default SignupScreen;
