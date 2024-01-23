import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Button,
} from 'react-native';
import { auth, database, ref, onValue } from '../config/firebase';
import { update, getDatabase } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import { sendPushNotification } from '../config/pushNotifs';
import { registerForPushNotificationsAsync } from '../config/expoNotifs';

function TroopRequestPage() {
  const [troopRequests, setTroopRequests] = useState([]);
  const [hasTroopRequest, setHasTroopRequest] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    refreshTroopRequests();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  const refreshTroopRequests = async () => {
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val() || {};
      let allRequests = [];
      let userProfiles = [];

      Object.entries(usersData).forEach(([userId, user]) => {
        if (userId === auth.currentUser.uid) {
          userProfiles = user.profiles || {};
          setHasTroopRequest(user.request || false);
        }
        Object.entries(user.profiles || {}).forEach(([profileId, profile]) => {
          if (profile.request) {
            allRequests.push({ userId, profileId, ...profile });
          }
        });
      });

      setProfiles(userProfiles);
      setTroopRequests(allRequests);
    });
  };

  const sendTroopRequest = async () => {
    try {
      const userId = auth.currentUser.uid;

      if (hasTroopRequest) {
        Alert.alert(
          'Info',
          'You already have a troop request. Please wait for it to be completed.'
        );
        return;
      }

      await update(
        ref(database, `users/${userId}/profiles/${selectedProfileId}`),
        {
          request: true,
        }
      );

      const expoPushToken = await registerForPushNotificationsAsync();

      if (expoPushToken) {
        sendPushNotification(
          expoPushToken,
          'Hey Chief!',
          'Someone needs some reinforcements'
        );
      }

      refreshTroopRequests();
    } catch (error) {
      console.error('Error sending troop request:', error);
    }
  };

  const markAsCompleted = async (userId, profileId) => {
    try {
      await update(ref(database, `users/${userId}/profiles/${profileId}`), {
        request: false,
      });
      refreshTroopRequests();
    } catch (error) {
      console.error('Error marking troop request as completed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={troopRequests}
        keyExtractor={(item) => `${item.userId}-${item.profileId}`}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text>{`${item.clashName} needs reinforcements`}</Text>
            <Text>{`Clash TH: ${item.clashTH}`}</Text>
            <Button
              title="Mark as Completed"
              onPress={() => markAsCompleted(item.userId, item.profileId)}
            />
          </View>
        )}
      />
      <Picker
        selectedValue={selectedProfileId}
        onValueChange={(itemValue) => setSelectedProfileId(itemValue)}
        style={styles.picker}
      >
        {Object.entries(profiles).map(([id, profile]) => (
          <Picker.Item label={profile.clashName} value={id} key={id} />
        ))}
      </Picker>

      <TouchableOpacity
        style={[styles.button, hasTroopRequest && styles.disabledButton]}
        onPress={sendTroopRequest}
        disabled={hasTroopRequest}
      >
        <Text style={styles.text}>Send Troop Request</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  profileContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
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
  picker: {
    width: '90%',
    backgroundColor: '#fff',
  },
});

export default TroopRequestPage;
