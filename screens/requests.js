import React, { useState, useEffect, useRef } from 'react';
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
import BottomSheet from '@gorhom/bottom-sheet';
import { Divider, Icon } from 'react-native-paper';

function Requests() {
  const [troopRequests, setTroopRequests] = useState([]);
  const [hasTroopRequest, setHasTroopRequest] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const bottomSheetRef = useRef(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useEffect(() => {
    refreshTroopRequests();
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

      //check if a profile is selected
      if (!selectedProfileId) {
        Alert.alert(
          'Huh',
          'Hey Chief, Please select a village before sending a troop request.'
        );
        return;
      }

      //check if a request already exists for the selected village
      const existingRequest = troopRequests.find(
        (request) =>
          request.userId === userId && request.profileId === selectedProfileId
      );

      if (existingRequest) {
        Alert.alert(
          'Huh',
          'A troop request for this village already exists. Please wait for it to be completed.'
        );
        return;
      }

      await update(
        ref(database, `users/${userId}/profiles/${selectedProfileId}`),
        {
          request: true,
        }
      );
      refreshTroopRequests();
    } catch (error) {
      //console.error('Error sending troop request:', error);
    }
  };

  const markAsCompleted = async (userId, profileId) => {
    try {
      await update(ref(database, `users/${userId}/profiles/${profileId}`), {
        request: false,
      });
      refreshTroopRequests();
    } catch (error) {
      //console.error('Error marking troop request as completed:', error);
    }
  };

  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
      setIsBottomSheetOpen(true);
    }
  };

  const closeBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
      setIsBottomSheetOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.itemText,
          {
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 20,
            marginVertical: 20,
          },
        ]}
      >
        Active Requests
      </Text>
      <View style={styles.listContainer}>
        <FlatList
          data={troopRequests}
          keyExtractor={(item) => `${item.userId}-${item.profileId}`}
          renderItem={({ item }) => (
            <View
              style={[
                styles.requestItem,
                item.userId === auth.currentUser.uid &&
                  styles.currentUserRequestItem,
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.itemText,
                    { fontSize: 22, fontWeight: 'bold' },
                  ]}
                >
                  {item.clashName}
                </Text>
                <Text
                  style={styles.itemText}
                >{`Town Hall ${item.clashTH}`}</Text>
              </View>
              <TouchableOpacity
                onPress={() => markAsCompleted(item.userId, item.profileId)}
              >
                <Icon source="check-circle-outline" color="#0fdb46" size={30} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        onPress={openBottomSheet}
        style={[styles.button, { width: '90%', marginHorizontal: 20 }]}
      >
        <Text style={styles.buttonText}>Send Request</Text>
      </TouchableOpacity>
      {/* Dark overlay behind the bottom sheet */}
      {isBottomSheetOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={closeBottomSheet}
          activeOpacity={1}
        />
      )}
      {isBottomSheetOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={closeBottomSheet}
          activeOpacity={1}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['1%', '50%', '80%']}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: '#fff' }}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', paddingHorizontal: 20 }}
        backgroundStyle={{ backgroundColor: '#1a1a1a', paddingHorizontal: 20 }}
      >
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              letterSpacing: 1,
            }}
          >
            Villages
          </Text>
          <TouchableOpacity onPress={closeBottomSheet}>
            <Icon source="close-circle-outline" color="#e63200" size={30} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={Object.entries(profiles)}
          keyExtractor={([id]) => id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.profileCard,
                selectedProfileId === item[0] && styles.activeProfileCard,
              ]}
              onPress={() => {
                setSelectedProfileId(item[0]);
              }}
            >
              <Text
                style={[
                  styles.profileText,
                  selectedProfileId === item[0] && styles.activeProfileText,
                ]}
              >
                {item[1].clashName}
              </Text>
              <Text
                style={[
                  styles.profileText && { fontSize: 16, color: '#fff' },
                  selectedProfileId === item[0] &&
                    styles.activeProfileText && { fontSize: 16, color: '#000' },
                ]}
              >{`TH${item[1].clashTH}`}</Text>
              {/* Add any other profile information you want to display */}
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={[styles.button, hasTroopRequest && styles.disabledButton]}
          onPress={() => {
            sendTroopRequest();
            closeBottomSheet(); // Close bottom sheet after pressing the button
          }}
          disabled={hasTroopRequest}
        >
          <Text style={styles.buttonText}>Send Request</Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    paddingTop: StatusBar.currentHeight
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  listContainer: {
    marginHorizontal: 20,
  },
  itemText: {
    color: '#fff',
  },
  profileContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  requestItem: {
    flexDirection: 'row',
    padding: 15,
    paddingHorizontal: 20,
    marginBottom: 5,
    backgroundColor: '#2e2e2e',
    borderRadius: 7,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentUserRequestItem: {
    backgroundColor: 'green',
  },
  markCompleted: {
    color: 'blue',
  },
  picker: {
    width: '90%',
    backgroundColor: '#fff',
  },
  button: {
    position: 'absolute',
    bottom: 15,
    padding: 12,
    borderRadius: 5,
    elevation: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileCard: {
    padding: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#191919',
    borderRadius: 7,
    elevation: 5,
    borderColor: '#666666',
    borderWidth: 1,
  },
  activeProfileCard: {
    backgroundColor: '#e8e8e8',
  },
  profileText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  activeProfileText: {
    color: '#000',
  },
});

export default Requests;
