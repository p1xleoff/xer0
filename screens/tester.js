import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, FlatList } from 'react-native';
import { auth, database, ref, push, onValue, off } from '../config/firebase';
import { remove } from '@firebase/database';
import { sendPushNotification } from '../config/pushNotifs';
import { registerForPushNotificationsAsync } from '../config/expoNotifs';
import * as Notifications from 'expo-notifications';

function TroopRequestPage() {
  const [troopRequests, setTroopRequests] = useState([]);

  const sendTroopRequest = async () => {
    try {
      const userId = auth.currentUser.uid;
  
      // Push troop request to the database with a timestamp
      await push(ref(database, 'troopRequests'), {
        userId,
        message: 'I need reinforcements!',
        timestamp: Date.now(),
        completed: false,
      });
  
      const expoPushToken = await registerForPushNotificationsAsync();
  
      if (expoPushToken) {
        // Send a push notification with the Expo Push Token
        sendPushNotification(expoPushToken, 'Troop Request', 'I need reinforcements!');
      }
    } catch (error) {
      console.error('Error sending troop request:', error);
    }
  };

  const markAsCompleted = async (troopRequestId) => {
    try {
      // Remove the troop request from the database
      await remove(ref(database, `troopRequests/${troopRequestId}`));

      // Update the local state to reflect the removal of the completed troop request
      setTroopRequests((prevTroopRequests) => prevTroopRequests.filter((item) => item.id !== troopRequestId));
    } catch (error) {
      console.error('Error marking troop request as completed:', error);
    }
  };

  useEffect(() => {
    console.log("Setting up notification listeners");
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      // Handle the notification if needed
    });

    // Listen for changes in the 'troopRequests' node
    const troopRequestsRef = ref(database, 'troopRequests');
    const handleNewTroopRequest = (snapshot) => {
      const troopRequestsData = snapshot.val();

      if (troopRequestsData) {
        // Extract the troop requests from the nested structure
        const troopRequestsArray = Object.entries(troopRequestsData)
          .map(([key, value]) => ({ id: key, ...value }))
          .filter((troopRequest) => !troopRequest.completed && troopRequest.timestamp >= Date.now() - 86400000);

        // Update troopRequests state to display in a list
        setTroopRequests(troopRequestsArray);
      }
    };

    onValue(troopRequestsRef, handleNewTroopRequest);

    // Clean up the listeners when the component unmounts
    return () => {
      off(troopRequestsRef, 'value', handleNewTroopRequest);
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={sendTroopRequest}>
        <Text style={styles.text}>Send Notification</Text>
      </TouchableOpacity>

      <FlatList
        data={troopRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text>{`${item.userId}: ${item.message}`}</Text>
            {!item.completed && (
              <TouchableOpacity onPress={() => markAsCompleted(item.id)}>
                <Text style={styles.markCompleted}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
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
    marginTop: StatusBar.currentHeight,
  },
  button: {
    width: '90%',
    borderRadius: 9,
    marginVertical: '2%',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: '3%',
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
