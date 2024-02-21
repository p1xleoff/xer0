// Home.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Divider, Icon } from "react-native-paper";
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getDatabase, ref, get } from "firebase/database";
import { Notifications } from 'expo';
const Home = () => {
  const route = useRoute();
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

  const auth = getAuth();

  useEffect(() => {
    // Fetch the current user's email when the component mounts
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);

      // Fetch additional user information from the Realtime Database
      const db = getDatabase();
      const userRef = ref(db, `users/${currentUser.uid}`);
      
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
           // console.log("User Data:", userData);

            // Set user data to state
            setUserData(userData);
          } else {
            //console.error("User data not found in the database.");
          }
        })
        .catch((error) => {
          //console.error("Error fetching user data:", error);
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
          <Text style={{ fontSize: 22, color: '#fff' }}>hello there, <Text style={styles.header}>{userData ? userData.username : userEmail}</Text></Text>
        </View>
        <Divider style={{margin: 10}}/>
        <View>
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Profile")}>
              <Text style={[styles.text, {color: '#fff'}]}>Profile</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>          
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Status")}>
              <Text style={[styles.text, {color: '#fff'}]}>War</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Account")}>
              <Text style={[styles.text, {color: '#fff'}]}>account</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>          
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Requests")}>
              <Text style={[styles.text, {color: '#fff'}]}>Requests</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>           
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Tester")}>
              <Text style={[styles.text, {color: '#fff'}]}>Tester</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>          
           <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.text, {color: '#fff'}]}>Login</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>            
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Events")}>
              <Text style={[styles.text, {color: '#fff'}]}>Events</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>            
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Admin")}>
              <Text style={[styles.text, {color: '#fff'}]}>admin</Text>
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
    backgroundColor: '#101010',
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
    backgroundColor: '#1a1a1a',
    elevation: 10,
    padding: 15,
    borderRadius: 7,
    justifyContent: 'space-between',
    marginVertical: 10,
    elevation: 5,
  },
});
export default Home;