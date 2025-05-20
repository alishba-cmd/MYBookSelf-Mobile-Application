import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import {View,Text,TouchableOpacity,FlatList,Image,StyleSheet,ActivityIndicator,} from 'react-native';
import axios from 'axios';

const BASE_URL = 'https://mybookshelf-16bd5-default-rtdb.firebaseio.com/';

const HomeScreen = ({ navigation, route }) => {
  const user = route.params?.user;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/books.json`);
      const data = response.data || {};

      const filteredBooks = Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .filter((book) => book.userId === user.id);

      setBooks(filteredBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Refresh on screen focus (after update, etc.)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBooks();
    });
    return unsubscribe;
  }, [navigation]);

  const handleToggleReadingNow = async (bookId, currentStatus) => {
    const newStatus = currentStatus === 'reading' ? 'library' : 'reading';

    try {
      await axios.patch(`${BASE_URL}/books/${bookId}.json`, { status: newStatus });
      fetchBooks();
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };
const handleToggleFavourite = async (bookId, currentFavourite) => {
  try {
    await axios.patch(`${BASE_URL}/books/${bookId}.json`, { favourite: !currentFavourite });
    fetchBooks();
  } catch (error) {
    console.error('Error updating favourite status:', error);
  }
};
  const renderItem = ({ item }) => {
  const isReading = item.status === 'reading';
  const isInAllTab = selectedCategory === 'All';
  const isInReadingNowTab = selectedCategory === 'Reading Now';

  const handleOpenPdf = () => {
    if (item.pdfUrl) {
      Linking.openURL(item.pdfUrl).catch((err) =>
        console.error('Failed to open PDF:', err)
      );
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
      {item.pdfUrl && isInReadingNowTab && (
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
            {isReading && isInAllTab && (
              <View style={styles.readingBadge}>
                <Text style={styles.badgeText}>Reading</Text>
              </View>
            )}

            {isReading && isInReadingNowTab && (
              <TouchableOpacity
                style={[styles.readNowBtn, styles.readingBtn]}
                onPress={() => handleToggleReadingNow(item.id, item.status)}
              >
                <Text style={styles.readNowText}>Remove from Reading Now</Text>
              </TouchableOpacity>
            )}

            {!isReading && (
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



  const filteredBooks = books.filter((book) => {
    if (selectedCategory === 'Reading Now') return book.status === 'reading';
      if (selectedCategory === 'Favourites') return book.favourite === true;
    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 My Bookshelf</Text>

  <View style={styles.tabs}>
  <TouchableOpacity
    style={[styles.tabButton, selectedCategory === 'All' && styles.activeTab]}
    onPress={() => setSelectedCategory('All')}
  >
    <Text style={styles.tabText}>All</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.tabButton, selectedCategory === 'Reading Now' && styles.activeTab]}
    onPress={() => setSelectedCategory('Reading Now')}
  >
    <Text style={styles.tabText}>Reading Now</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.tabButton, selectedCategory === 'Favourites' && styles.activeTab]}
    onPress={() => setSelectedCategory('Favourites')}
  >
    <Text style={styles.tabText}>Favourites</Text>
  </TouchableOpacity>
</View>


      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddBook', { user })}
      >
        <Text style={styles.addButtonText}>＋ Add Book</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

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
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    backgroundColor: '#6a4fbf',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#a77cff',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
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
  readingBadge: {
    backgroundColor: '#3aff86',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#a77cff',
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
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
  readIcon: {
  position: 'absolute',
  top: 40, // Below the edit icon
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
}

});