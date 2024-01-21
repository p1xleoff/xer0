import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Icon } from 'react-native-paper';

const WarStatus = () => {
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

  const renderItem = ({ item }) => {
    // Determine the color based on the war status
    // const iconColor = item.warStatus ? 'green' : 'red';
    const backgroundColor = item.warStatus ? 'lightgreen' : 'lightcoral';
    return (
      <View style={[styles.profileItem, { backgroundColor }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
              {item.clashName}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
              TH{item.clashTH}
            </Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {/* Use the dynamically determined color */}
            <Icon source="sword-cross" color="#000" size={30} />
            <Text style={styles.itemText}>{item.warStatus ? 'In' : 'Out'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.header}>Total Players: {warStatusData.length}</Text>
      </View>
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
    backgroundColor: '#fff'
  },
  profileItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 7,
    marginVertical: 5,
    elevation: 10
  },
  header: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 5
  },
});

export default WarStatus;
