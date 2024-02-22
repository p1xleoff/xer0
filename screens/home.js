// Home.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { ActivityIndicator, Divider, Icon } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getDatabase, ref, get } from 'firebase/database';
import Events from './events';

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
            console.error('User data not found in the database.');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.innerContainer}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.header}>xer0</Text>
            {/* <TouchableOpacity style={styles.cheeseIcon}>
          <Icon source="cheese" color='#fff' size={32} />
          </TouchableOpacity> */}
          </View>
          {/* <Divider style={{margin: 10}}/> */}
          <View>
            <View>
              <Text style={[styles.text, { color: '#fff' }]}>
                Village War Preference
              </Text>
              <TouchableOpacity
                style={styles.links}
                onPress={() => navigation.navigate('Profile')}
              >
                {userData ? (
                  <View>
                    {/* <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
            <Icon source="chevron-right" color='#fff' size={28} />
            </View>   */}
                    {userData.profiles &&
                      Object.values(userData.profiles).map((profile, index) => (
                        <View
                          key={index}
                          style={[
                            styles.statusBg,
                            {
                              backgroundColor: profile.warStatus
                                ? '#1eff00'
                                : '#fc5400',
                            },
                          ]}
                        >
                          {/* <Icon source="home" color='#fff' size={25} /> */}
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Text style={styles.thText}>
                              {profile.clashName}, TH{profile.clashTH}
                            </Text>
                          </View>
                          <Text style={styles.thText}>
                            {profile.warStatus ? 'In' : 'Out'}
                          </Text>
                        </View>
                      ))}
                  </View>
                ) : (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                  </View>
                )}
                <TouchableOpacity
                  style={[styles.goButton, { flexDirection: 'row' }]}
                  onPress={() => navigation.navigate('Profile')} >
                  <Text style={{ fontSize: 18 }}>
                    {userData && userData.profiles ? 'Change' : 'Add'}
                  </Text>
                  <Icon source="chevron-right" color="#000" size={28} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>
        </View>
<<<<<<< HEAD
        <Events />
      </ScrollView>
=======
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
>>>>>>> d99b9560b8b5fc1bf3f888d4f5256e5ed68327b7
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    paddingTop: StatusBar.currentHeight + 30,
  },
  innerContainer: {
    marginHorizontal: '5%',
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
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
  links: {
    // flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    elevation: 10,
    padding: 15,
    borderRadius: 7,
    // justifyContent: 'space-between',
    // alignItems: 'flex-end',
    marginTop: 5,
    elevation: 5,
  },
  cheeseIcon: {
    backgroundColor: '#101010',
    borderWidth: 2,
    borderRadius: 50,
    padding: 4,
    borderColor: '#fff',
  },
  thText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBg: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 7,
    padding: 10,
  },
  goButton: {
    backgroundColor: '#d6d6d6',
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    alignItems: 'center',
  },
});
export default Home;
