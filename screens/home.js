// Home.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Divider, Icon } from "react-native-paper";
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const Home = () => {
  const route = useRoute();
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

  const auth = getAuth();
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    // Fetch the current user's email when the component mounts
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const navigateToStatus = () => {
    navigation.navigate('Status', { userEmail: userEmail });
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
          <Text style={{ fontSize: 22 }}>hello there, <Text style={styles.header}>{userEmail}</Text></Text>
          <Text style={styles.text}>Lets get some stuff done today!</Text>
        </View>
        <Divider style={{margin: 10}}/>
        <View>
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.text, {color: '#fff'}]}>Set War Preference</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.text, {color: '#fff'}]}>Check out routines</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.links} onPress={handleSignOut}>
              <Text style={[styles.text, {color: '#fff'}]}>Clear Data</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>          
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Profile")}>
              <Text style={[styles.text, {color: '#fff'}]}>huh</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>          
          <TouchableOpacity style={styles.links} onPress={navigateToStatus}>
              <Text style={[styles.text, {color: '#fff'}]}>Status</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight+30
  },
  innerContainer: {
    marginHorizontal: "5%",
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    elevation: 10,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 7,
    marginVertical: 10,
  },
  links:  {
    flexDirection: 'row',
    backgroundColor: '#000',
    elevation: 10,
    padding: 15,
    borderRadius: 7,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
export default Home;