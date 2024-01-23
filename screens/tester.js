import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { auth, database, ref, push, onValue, off } from '../config/firebase';
import { remove } from '@firebase/database';
import * as Notifications from 'expo-notifications';

function TroopRequestPage() {
  const [troopRequests, setTroopRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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
    } catch (error) {
      console.error('Error sending troop request:', error);
    }
  };

  const handleTroopRequestNotification = (troopRequest) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Troop Request',
        body: `${troopRequest.userId} needs reinforcements: ${troopRequest.message}`,
      },
      trigger: null, // Send immediately
    });
  };

  const markAsCompleted = async (troopRequestId) => {
    try {
      // Remove the troop request from the database
      await remove(ref(database, 'troopRequests/' + troopRequestId));

      // Update the local state to reflect the removal of the completed troop request
      setTroopRequests((prevTroopRequests) => prevTroopRequests.filter((item) => item.id !== troopRequestId));
    } catch (error) {
      console.error('Error marking troop request as completed:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Fetch updated troop requests
    // ...

    setRefreshing(false);
  }, []);

  useEffect(() => {
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

    // Listen for changes in the 'troopRequests' node
    const troopRequestsRef = ref(database, 'troopRequests');
    onValue(troopRequestsRef, handleNewTroopRequest);

    // Clean up the listener when the component unmounts
    return () => {
      off(troopRequestsRef, 'value', handleNewTroopRequest);
    };
  }, [onRefresh]);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
