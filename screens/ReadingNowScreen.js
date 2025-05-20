import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Linking, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const BASE_URL = 'https://mybookshelf-16bd5-default-rtdb.firebaseio.com/';

const ReadingNowScreen = ({ route }) => {
  const user = route?.params?.user;
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/books.json`);
      const data = await response.json();
      if (!data) return;

      const booksArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      const readingNowBooks = booksArray.filter(
        book => book.status === 'reading' && String(book.userId) === String(user?.id)
      );

      setBooks(readingNowBooks);
    } catch (error) {
      console.error('Error fetching reading books:', error);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      {item.coverImageUrl ? (
        <Image source={{ uri: item.coverImageUrl }} style={styles.coverImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={{ color: '#999' }}>No Cover</Text>
        </View>
      )}

      <View style={styles.bookDetails}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>by {item.author}</Text>
        <Text style={styles.genre}>Genre: {item.genre}</Text>

        {item.pdfUrl ? (
          <TouchableOpacity
            style={styles.readIcon}
            onPress={() => Linking.openURL(item.pdfUrl)}
          >
            <Feather name="book-open" size={18} color="#fff" />
            <Text style={styles.readText}>Read</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noPdf}>No PDF uploaded</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {books.length === 0 ? (
        <Text style={styles.emptyText}>Reading list is empty</Text>
      ) : (
        <FlatList data={books} renderItem={renderItem} keyExtractor={(item) => item.id} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f7f7f7',
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  coverImage: {
    width: 80,
    height: 110,
    borderRadius: 8,
    marginRight: 15,
  },
  placeholderImage: {
    width: 80,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  author: {
    color: '#555',
    marginBottom: 5,
  },
  genre: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  noPdf: {
    fontStyle: 'italic',
    color: 'red',
    marginTop: 5,
  },
  readIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6a4fbf',
    padding: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  readText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default ReadingNowScreen;