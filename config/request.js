import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import * as Notifications from 'expo-notifications';

function TroopRequestHandler() {
  const handleTroopRequestNotification = (troopRequest) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Troop Request',
        body: `${troopRequest.userId} needs reinforcements: ${troopRequest.message}`,
      },
      trigger: null, // Send immediately
    });
  };

  useEffect(() => {
    const database = firebase.database();

    const handleNewTroopRequest = (snapshot) => {
      const troopRequest = snapshot.val();
      console.log('Received troop request:', troopRequest);
      
      // Trigger notification or update UI as needed
      handleTroopRequestNotification(troopRequest);
    };

    // Listen for changes in the 'troopRequests' node
    const troopRequestsRef = database.ref('troopRequests');
    troopRequestsRef.on('child_added', handleNewTroopRequest);

    // Clean up the listener when the component unmounts
    return () => troopRequestsRef.off('child_added', handleNewTroopRequest);
  }, []); // Run this effect once when the component mounts

  return (
    <View style={styles.container}>
      {/* Add any UI components you need for handling troop requests */}
      <Text>Handle Troop Requests Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: StatusBar.currentHeight,
  },
});

export default TroopRequestHandler;
