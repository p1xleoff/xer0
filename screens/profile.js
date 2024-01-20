import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Switch,
} from 'react-native';
import { auth } from '../config/firebase';
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  update,
} from 'firebase/database';

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
      <View>
      <Text style={{fontSize: 22, fontWeight: '500', color: '#fff'}}>{item.clashName}</Text>
      <Text style={styles.itemText}>TH{item.clashTH}</Text>
      <Text style={styles.itemText}>#{item.clashId}</Text>
      </View>
      <View style={{justifyContent:'center', alignItems: 'center'}}>
      <Switch
        value={item.warStatus}
        onValueChange={() => toggleWarStatus(item.key, !item.warStatus)}
      />
        <Text style={styles.itemText}>{item.warStatus ? 'In' : 'Out'}</Text>
      </View>
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
      <View style={{marginHorizontal: 20}}>
      {userData ? (
        <View>
          <View style={styles.header}>
          <Text style={{fontSize: 28, fontWeight: 'bold'}}>{userData.username}</Text>
          <Text style={{fontSize: 16, fontWeight: '500'}}>{userData.email}</Text>
            </View>
            <Text style={{fontSize: 16, fontWeight: '500', marginTop: 20}}>Game Acounts:</Text>
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
          <Button title="Add Account" onPress={addProfile} />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: 'red',
    padding: 15
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    backgroundColor: '#1a1a1a',
    borderColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff'
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
