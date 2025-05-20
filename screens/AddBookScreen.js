import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,Alert,ScrollView,StyleSheet,} from 'react-native';
import axios from 'axios';

const BASE_URL = 'https://mybookshelf-16bd5-default-rtdb.firebaseio.com/';

const AddBookScreen = ({ navigation, route }) => {
  const user = route.params?.user;
  const onBookAdded = route.params?.onBookAdded; // 👈 callback to refresh HomeScreen

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  const handleAddBook = async (status = 'library') => {
    if (!title || !author || !genre) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    if (!user || !user.id) {
      Alert.alert('Error', 'User information missing. Please login again.');
      return;
    }

    const bookData = {
      title,
      author,
      genre,
      status,
      pdfUrl: pdfUrl || '',
      coverImageUrl: coverImageUrl || '',
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(`${BASE_URL}/books.json`, bookData);
      Alert.alert('Success', 'Book added successfully!');

      // Reset form fields
      setTitle('');
      setAuthor('');
      setGenre('');
      setPdfUrl('');
      setCoverImageUrl('');

      // 🔁 Trigger book list refresh in HomeScreen
      onBookAdded?.();

      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error adding book:', error);
      Alert.alert('Error', 'Could not add book.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Add a New Book 📚</Text>

        <TextInput
          placeholder="Title *"
          placeholderTextColor="#BDAEFF"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Author *"
          placeholderTextColor="#BDAEFF"
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          placeholder="Genre *"
          placeholderTextColor="#BDAEFF"
          style={styles.input}
          value={genre}
          onChangeText={setGenre}
        />
        <TextInput
          placeholder="PDF URL (optional)"
          placeholderTextColor="#BDAEFF"
          style={styles.input}
          value={pdfUrl}
          onChangeText={setPdfUrl}
        />
        <TextInput
          placeholder="Cover Image URL (optional)"
          placeholderTextColor="#BDAEFF"
          style={styles.input}
          value={coverImageUrl}
          onChangeText={setCoverImageUrl}
        />

        <TouchableOpacity style={styles.button} onPress={() => handleAddBook('library')}>
          <Text style={styles.buttonText}>Add to Library</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleAddBook('reading')}>
          <Text style={styles.buttonText}>Add to Reading Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6A4FBF', marginTop: 30 }]}
          onPress={() => {
            navigation.navigate('BookDetail', {
              book: {
                id: 'temp-id',
                title: '',
                author: '',
                genre: '',
                pdfUrl: '',
                coverImageUrl: '',
              },
            });
          }}
        >
          <Text style={styles.buttonText}>Go to Book Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddBookScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#C4A1FF',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#2c0057',
    padding: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  heading: {
    fontSize: 24,
    color: '#F7EFFF',
    marginBottom: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#4a2560',
    color: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#A77CFF',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});