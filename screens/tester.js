import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import { auth, database, ref, push, onValue,} from '../config/firebase';
import { update } from '@firebase/database';
import { sendPushNotification } from '../config/pushNotifs';
import { registerForPushNotificationsAsync } from '../config/expoNotifs';
import * as Notifications from 'expo-notifications';
import { Picker } from '@react-native-picker/picker';

function TroopRequestPage() {
  const [troopRequests, setTroopRequests] = useState([]);
  const [hasTroopRequest, setHasTroopRequest] = useState(false);

  const sendTroopRequest = async () => {
    try {
      const userId = auth.currentUser.uid;

      // Check if the user already has a troop request
      if (hasTroopRequest) {
        // Show an alert indicating that the user has a pending request
        Alert.alert('Info', 'You already have a troop request. Please wait for it to be completed.');
        return;
      }

      // Update the user's request status to true
      await update(ref(database, `users/${userId}`), { request: true });

      const expoPushToken = await registerForPushNotificationsAsync();

      if (expoPushToken) {
        // Send a push notification with the Expo Push Token
        sendPushNotification(expoPushToken, 'Hey Chief!', 'Someone needs some reinforcements');
      }
    } catch (error) {
      console.error('Error sending troop request:', error);
    }
  };

  const markAsCompleted = async (userId) => {
    try {
      // Update the user's request status to false
      await update(ref(database, `users/${userId}`), { request: false });

      // Refresh the troop requests
      refreshTroopRequests();
    } catch (error) {
      console.error('Error marking troop request as completed:', error);
    }
  };

  const refreshTroopRequests = async () => {
    const troopRequestsRef = ref(database, 'users');
    const handleTroopRequests = (snapshot) => {
      const usersData = snapshot.val();

      if (usersData) {
        const troopRequestsArray = Object.entries(usersData)
          .map(([key, value]) => ({ id: key, ...value }))
          .filter((user) => user.request);

        setTroopRequests(troopRequestsArray);

        // Check if the current user has a troop request
        const currentUser = troopRequestsArray.find((user) => user.id === auth.currentUser.uid);
        setHasTroopRequest(!!currentUser);
      }
    };

    onValue(troopRequestsRef, handleTroopRequests);
  };

  useEffect(() => {
    console.log("Setting up notification listeners");
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      // Handle the notification if needed
    });

    // Fetch initial troop requests
    refreshTroopRequests();

    // Clean up the listeners when the component unmounts
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, hasTroopRequest && styles.disabledButton]}
        onPress={sendTroopRequest}
        disabled={hasTroopRequest}
      >
        <Text style={styles.text}>Send Notification</Text>
      </TouchableOpacity>

      <FlatList
        data={troopRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text>{`${item.username}: needs reinforcements`}</Text>
             <Text>{`TH: ${item.profiles[Object.keys(item.profiles)[0]].clashTH}`}</Text>
            <TouchableOpacity onPress={() => markAsCompleted(item.id)}>
              <Text style={styles.markCompleted}>Mark as Completed</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    width: '90%',
    borderRadius: 9,
    marginVertical: '2%',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: '3%',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  requestItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  markCompleted: {
    color: 'blue',
  },
});

export default TroopRequestPage;
