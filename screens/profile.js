import React, { useState, useEffect, memo } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Switch } from 'react-native';
import { auth } from '../config/firebase';
import { getDatabase, ref, onValue, push, set, update } from 'firebase/database';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [clashId, setClashId] = useState('');
  const [clashName, setClashName] = useState('');
  const [clashTH, setClashTH] = useState('');
  const [warStatus, setWarStatus] = useState(false);

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

  const renderItem = ({ item }) => (
    <View style={styles.profileItem}>
      <Text>Clash ID: {item.clashId}</Text>
      <Text>Name: {item.clashName}</Text>
      <Text>TH Level: {item.clashTH}</Text>
      <Text>War Status: {item.warStatus ? 'In' : 'Out'}</Text>
      <Switch
        value={item.warStatus}
        onValueChange={() => toggleWarStatus(item.key, !item.warStatus)}
      />
    </View>
  );
  
  
  const toggleWarStatus = async (profileKey, newStatus) => {
    const database = getDatabase();
    const user = auth.currentUser;
  
    if (user) {
      const userId = user.uid;
      const profileRef = ref(database, `users/${userId}/profiles/${profileKey}/warStatus`);
  
      try {
        await set(profileRef, newStatus);
      } catch (error) {
        console.error('Error updating war status:', error);
      }
    }
  };
  
  
  
  const addProfile = async () => {
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
    }
  };
  
  return (
    <View style={styles.container}>
      {userData ? (
        <View>
          <Text>Username: {userData.username}</Text>
          <Text>Email: {userData.email}</Text>
          <FlatList
  data={userData && userData.profiles ? Object.entries(userData.profiles).map(([key, value]) => ({ key, ...value })) : []}
  renderItem={renderItem}
  keyExtractor={(item) => item.key}
/>

          {/* Form to add a new profile */}
          <TextInput
            style={styles.input}
            placeholder="Clash ID"
            value={clashId}
            onChangeText={setClashId}
          />
          <TextInput
            style={styles.input}
            placeholder="Clash Name"
            value={clashName}
            onChangeText={setClashName}
          />
          <TextInput
            style={styles.input}
            placeholder="TH Level"
            value={clashTH}
            onChangeText={setClashTH}
          />
          <Button
            title="Add Account"
            onPress={addProfile}
          />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

export default memo(Profile);
