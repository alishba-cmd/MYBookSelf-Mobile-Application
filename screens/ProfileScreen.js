import React, { useEffect, useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Alert,Image,TextInput,Modal,} from 'react-native';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://mybookshelf-16bd5-default-rtdb.firebaseio.com/';

const ProfileScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const userId = user?.id;

  const [userData, setUserData] = useState({ email: '', username: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/${userId}.json`);
        if (response.data) {
          setUserData({
            email: response.data.email || 'N/A',
            username: response.data.username || 'N/A',
          });
        } else {
          setUserData({ email: 'N/A', username: 'N/A' });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to load user information.');
        setUserData({ email: 'N/A', username: 'N/A' });
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      await axios.patch(`${BASE_URL}/users/${userId}.json`, {
        password: newPassword,
      });
      Alert.alert('Success', 'Password changed successfully.');
      setModalVisible(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password change error:', error);
      Alert.alert('Error', 'Failed to update password.');
    }
  };
const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('loggedInUser');
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (e) {
    console.log("Logout error:", e);
  }
};
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/avatar.png')}
        style={styles.profileImage}
      />
      <Text style={styles.username}>{userData.username}</Text>
      <Text style={styles.email}>{userData.email}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <View style={styles.iconTextContainer}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#d9534f" style={styles.icon} />
          <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              placeholder="New Password"
              secureTextEntry
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#BDAEFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#1a0033',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderColor: '#d9534f',
    borderWidth: 2,
  },
  logoutText: {
    color: '#d9534f',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginBottom: 15,
    paddingVertical: 5,
  },
  modalButton: {
    backgroundColor: '#1a0033',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;