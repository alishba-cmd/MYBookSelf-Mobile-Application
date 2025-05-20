import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import axios from 'axios';

const BASE_URL = 'https://mybookshelf-16bd5-default-rtdb.firebaseio.com/';

const BookDetailScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre);

  const [message, setMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const showMessage = (msg) => {
    setMessage(msg);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setMessage(''));
      }, 2000);
    });
  };

 const handleUpdate = async () => {
  try {
    const updatedBook = {
      ...book,
      title,
      author,
      genre,
    };

    await axios.put(`${BASE_URL}/books/${book.id}.json`, updatedBook);

    showMessage('Book Updated Successfully!');
    setTimeout(() => {
      navigation.replace('Home', { user: book.userId, refresh: true });
    }, 1500);
  } catch (error) {
    console.error('Update Error:', error);
    Alert.alert('Error', 'Could not update book');
  }
};

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/books/${book.id}.json`);
      showMessage('Book Removed Successfully!');
      setTimeout(() => {
        navigation.replace('Home', { user: book.userId, refresh: true });
      }, 1500);
    } catch (error) {
      console.error('Delete Error:', error);
      Alert.alert('Error', 'Could not delete book');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Book</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#aaa"
      />
      <TextInput
        value={author}
        onChangeText={setAuthor}
        style={styles.input}
        placeholder="Author"
        placeholderTextColor="#aaa"
      />
      <TextInput
        value={genre}
        onChangeText={setGenre}
        style={styles.input}
        placeholder="Genre"
        placeholderTextColor="#aaa"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {message ? (
        <Animated.View style={[styles.messageBox, { opacity: fadeAnim }]}>
          <Text style={styles.messageText}>{message}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1b0039' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#8854d0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#2c0057',
    color: '#fff',
  },
  buttonContainer: { marginTop: 10, gap: 12 },
  updateButton: {
    backgroundColor: '#8854d0',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  messageBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#27ae60',
    borderRadius: 10,
    alignItems: 'center',
  },
  messageText: { color: '#fff', fontWeight: 'bold' },
});

export default BookDetailScreen;