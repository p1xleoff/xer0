// WarStatusList.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';

const WarStatusList = () => {
  const [warStatusData, setWarStatusData] = useState([]);

  useEffect(() => {
    const database = getDatabase();
    const profilesRef = ref(database, 'users');

    const unsubscribe = onValue(profilesRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        const profiles = Object.values(userData).map((user) => {
          return user.profiles ? Object.values(user.profiles) : [];
        });
        const flattenedProfiles = profiles.flat();
        setWarStatusData(flattenedProfiles);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.profileItem}>
      <Text>Clash ID: {item.clashId}</Text>
      <Text>Clash Name: {item.clashName}</Text>
      <Text>War Status: {item.warStatus ? 'In' : 'Out'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={warStatusData}
        renderItem={renderItem}
        keyExtractor={(item) => item.clashId}
      />
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
});

export default WarStatusList;
