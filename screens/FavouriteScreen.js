import React, { useEffect, useState } from 'react';
import { Linking, View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';

const BASE_URL = 'https://mybookshelf-16bd5-default-rtdb.firebaseio.com/';

const FavouriteScreen = ({ navigation, route }) => {
  const user = route.params?.user;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only favourite books of this user
  const fetchFavouriteBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/books.json`);
      const data = response.data || {};

      const favBooks = Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .filter((book) => book.userId === user.id && book.favourite === true);

      setBooks(favBooks);
    } catch (error) {
      console.error('Error fetching favourite books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavouriteBooks();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavouriteBooks();
    });
    return unsubscribe;
  }, [navigation]);

  const handleToggleReadingNow = async (bookId, currentStatus) => {
    const newStatus = currentStatus === 'reading' ? 'library' : 'reading';
    try {
      await axios.patch(`${BASE_URL}/books/${bookId}.json`, { status: newStatus });
      fetchFavouriteBooks();
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };

  const handleToggleFavourite = async (bookId, currentFavourite) => {
    try {
      await axios.patch(`${BASE_URL}/books/${bookId}.json`, { favourite: !currentFavourite });
      fetchFavouriteBooks();
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };

  const renderItem = ({ item }) => {
    const isReading = item.status === 'reading';

    const handleOpenPdf = () => {
      if (item.pdfUrl) {
        Linking.openURL(item.pdfUrl).catch((err) => console.error('Failed to open PDF:', err));
      } else {
        alert('No PDF available for this book.');
      }
    };

    return (
      <View style={styles.card}>
        {/* Edit Icon */}
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => navigation.navigate('BookDetailScreen', { book: item })}
        >
          <Feather name="edit-3" size={16} color="#fff" />
        </TouchableOpacity>

        {/* Favourite Heart Icon */}
        <TouchableOpacity
          style={styles.favIcon}
          onPress={() => handleToggleFavourite(item.id, item.favourite)}
        >
          <Feather
            name="heart"
            size={18}
            color={item.favourite ? '#ff4d6d' : '#fff'}
          />
        </TouchableOpacity>

        {/* Read Icon */}
        {item.pdfUrl && (
          <TouchableOpacity
            style={styles.readIcon}
            onPress={handleOpenPdf}
          >
            <Feather name="book-open" size={16} color="#fff" />
          </TouchableOpacity>
        )}

        <Image source={{ uri: item.coverImageUrl }} style={styles.bookImage} />

        <View style={{ flex: 1 }}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>by {item.author}</Text>

          {item.pdfUrl ? (
            <>
              {isReading ? (
                <TouchableOpacity
                  style={[styles.readNowBtn, styles.readingBtn]}
                  onPress={() => handleToggleReadingNow(item.id, item.status)}
                >
                  <Text style={styles.readNowText}>Remove from Reading Now</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.readNowBtn}
                  onPress={() => handleToggleReadingNow(item.id, item.status)}
                >
                  <Text style={styles.readNowText}>Add to Reading Now</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.noPdf}>No PDF uploaded</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❤️ My Favourites</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : books.length === 0 ? (
        <Text style={styles.emptyText}>No favourite books yet.</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

export default FavouriteScreen;

// Styles (same as HomeScreen for consistency)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c0072',
    padding: 15,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#511a80',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    position: 'relative',
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#ccc',
  },
  bookTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
  },
  noPdf: {
    color: '#f8baba',
    fontStyle: 'italic',
  },
  readNowBtn: {
    backgroundColor: '#a77cff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  readingBtn: {
    backgroundColor: '#3aff86',
  },
  readNowText: {
    color: '#000',
    fontWeight: 'bold',
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#6a4fbf',
    padding: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  favIcon: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#6a4fbf',
    padding: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  readIcon: {
    position: 'absolute',
    top: 70,
    right: 10,
    backgroundColor: '#6a4fbf',
    padding: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});