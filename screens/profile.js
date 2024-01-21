import React, { useState, useEffect, memo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { auth } from '../config/firebase';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { Divider, Icon, Switch, TextInput } from 'react-native-paper';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [clashId, setClashId] = useState('');
  const [clashName, setClashName] = useState('');
  const [clashTH, setClashTH] = useState('');
  const [warStatus, setWarStatus] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useEffect(() => {
    const database = getDatabase();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const userRef = ref(database, `users/${userId}`);

      const unsubscribe = onValue(userRef, (snapshot) => {
        setUserData(snapshot.val());
      });

      return () => unsubscribe();
    }
  }, []);

  const bottomSheetRef = useRef(null);
  const snapPoints = ['1%', '60%', '90%'];

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

  const validateInput = () => {
    if (!clashName.trim() || !clashId.trim() || !clashTH.trim()) {
      Alert.alert('Validation Error', 'All fields must be filled in');
      return false;
    }

    // Village ID regex validation
    const startsWithHash = clashId.startsWith('#');
    const villageIdRegex = /^[A-Z0-9]{1,10}$/;
  
    if (!startsWithHash || !villageIdRegex.test(clashId.slice(1))) {
      Alert.alert('Validation Error', 'Invalid Player ID');
      return false;
    }
    const townHallRegex = /^(0?[1-9]|1[0-9]|16)$/;

    if (!townHallRegex.test(clashTH)) {
      Alert.alert(
        'Validation Error',
        `Umm, Chief, I don't think that Town Hall Level is correct.`
      );
      return false;
    }
    // Additional validation rules can be added here if needed

    return true;
  };

  const deleteProfile = (profileKey) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to remove this profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            const database = getDatabase();
            const user = auth.currentUser;

            if (user) {
              const userId = user.uid;
              const profileRef = ref(
                database,
                `users/${userId}/profiles/${profileKey}`
              );

              try {
                // Remove the profile
                await set(profileRef, null);
              } catch (error) {
                console.error('Error deleting profile:', error);
              }
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.profileItem}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: '500', color: '#fff' }}>
            {item.clashName}
          </Text>
          <Text style={styles.itemText}>TH{item.clashTH}</Text>
          <Text style={styles.itemText}>#{item.clashId}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Switch
            value={item.warStatus}
            color="lightgreen"
            onValueChange={() => toggleWarStatus(item.key, !item.warStatus)}
          />
          <Text style={styles.itemText}>{item.warStatus ? 'In' : 'Out'}</Text>
        </View>
      </View>
      <Divider style={{ marginVertical: 10 }} />
      <TouchableOpacity
        style={styles.remove}
        onPress={() => deleteProfile(item.key)}
      >
        <Text style={[styles.itemText, { paddingRight: 10 }]}>Remove</Text>
        <Icon source="delete" color="red" size={20} />
      </TouchableOpacity>
    </View>
  );

  const toggleWarStatus = async (profileKey, newStatus) => {
    const database = getDatabase();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const profileRef = ref(
        database,
        `users/${userId}/profiles/${profileKey}/warStatus`
      );

      try {
        await set(profileRef, newStatus);
      } catch (error) {
        console.error('Error updating war status:', error);
      }
    }
  };

  const addProfile = async () => {
    if (!validateInput()) {
      return;
    }
    const database = getDatabase();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const profilesRef = ref(database, `users/${userId}/profiles`);

      const newProfileRef = push(profilesRef);
      const newProfileId = newProfileRef.key;

      const newProfileData = {
        clashId,
        clashName,
        clashTH,
        warStatus,
      };

      try {
        // Optimistic update
        setUserData((prevUserData) => ({
          ...prevUserData,
          profiles: {
            ...prevUserData.profiles,
            [newProfileId]: newProfileData,
          },
        }));

        await set(newProfileRef, newProfileData);

        console.log('LOG: User Data State Updated:', userData); // Log updated user data state

        // Clear the form fields after adding a profile
        setClashId('');
        setClashName('');
        setClashTH('');
        setWarStatus(false);

        console.log('LOG: Form Fields Cleared'); // Log that form fields are cleared
      } catch (error) {
        console.error('Error adding profile:', error);
      }
      closeBottomSheet(Keyboard.dismiss);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isBottomSheetOpen ? 'dark-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <View style={{ marginHorizontal: 20, flex: 1 }}>
        {userData ? (
          <View>
            <View style={styles.header}>
              <Icon source="sword-cross" color="#fff" size={50} />
              <View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#fff',
                    marginLeft: 15,
                  }}
                >
                  {userData.username}
                </Text>
                {/* <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: '#fff',
                    marginLeft: 15,
                  }}
                >
                  {userData.email}
                </Text> */}
              </View>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 20, color: '#fff' }}>
              Game Accounts:
            </Text>
            <FlatList
              data={
                userData && userData.profiles
                  ? Object.entries(userData.profiles).map(([key, value]) => ({
                      key,
                      ...value,
                    }))
                  : []
              }
              renderItem={renderItem}
              keyExtractor={(item) => item.key}
              style={{ marginBottom: 220 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
        <TouchableOpacity onPress={openBottomSheet} style={styles.button}>
          <Text style={styles.buttonText}>Add Account</Text>
        </TouchableOpacity>
      </View>

      {/* Dark overlay behind the bottom sheet */}
      {isBottomSheetOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={closeBottomSheet}
          activeOpacity={1}
        />
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        enableOverDrag={false}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: '#fff' }}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', paddingHorizontal: 20 }}
        backgroundStyle={{ backgroundColor: '#1a1a1a', paddingHorizontal: 20 }}
        onChange={() => {}}
      >
        {/* Form to add a new profile in the bottom sheet */}
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
            Account Details
          </Text>
          <TouchableOpacity onPress={closeBottomSheet}>
            <Icon source="close-circle-outline" color="#e63200" size={30} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          mode="flat"
          activeUnderlineColor="#fff"
          label="Village Name"
          textColor="#fff"
          value={clashName}
          onChangeText={setClashName}
        />
        <TextInput
          style={styles.input}
          label="Village ID"
          activeUnderlineColor="#fff"
          textColor="#fff"
          value={clashId}
          mode="flat"
          onChangeText={(text) => setClashId(text.toUpperCase())}
        />
        <TextInput
          style={styles.input}
          mode="flat"
          label="Town Hall Level"
          activeUnderlineColor="#fff"
          textColor="#fff"
          value={clashTH}
          onChangeText={setClashTH}
        />

        <TouchableOpacity
          style={[
            styles.modalButton,
            {
              backgroundColor: '#fff',
              bottom: 10,
              width: '100%',
            },
          ]}
          title="Add Account"
          onPress={addProfile}
        >
          <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
            ADD
          </Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    borderRadius: 5,
    paddingHorizontal: 15,
    elevation: 7
  },
  profileItem: {
    marginTop: 10,
    backgroundColor: '#1e1e1e',
    borderColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 9,
    elevation: 7
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  input: {
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#1a1a1a',
    fontWeight: 'bold',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  button: {
    position: 'absolute',
    bottom: 15,
    padding: 15,
    borderRadius: 5,
    elevation: 10,
    alignItems: 'center',
    backgroundColor: '#000',
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  modalButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  remove: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    paddingHorizontal: 5,
  },
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(Profile);
