import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  StatusBar
} from 'react-native';
import { Divider, Icon, Avatar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getDatabase, ref, get } from 'firebase/database';

function Account() {
  const route = useRoute();
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      <View style={styles.innerContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
          <Icon source="chevron-left" color="#fff" size={28} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
          <Icon source="close" color="#fff" size={28} />
        </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Avatar.Image
            size={80}
            source={require('../assets/avatar1.png')}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.text}>
              {userData ? userData.username : userEmail}
            </Text>
            <Text style={{ fontSize: 18, color: '#fff', fontWeight: '500' }}>
              {userEmail}
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.info} onPress={handleSignOut}>
            <Icon source="power" color="#fff" size={28} />
            <Text style={[styles.text, { color: '#fff', marginLeft: 20 }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Icon source="sword-cross" color="#fff" size={28} />
          <View>
            <Text style={[styles.text, { color: '#fff', marginLeft: 20 }]}>
              xer0
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                fontWeight: '500',
                marginLeft: 20,
              }}
            >
              Version 0.1
            </Text>
          </View>
        </View>
        <View style={styles.policy}>
          <Text style={styles.policyText}>
          This material is unofficial and is not endorsed by Supercell. For more information see Supercell's Fan Content Policy:
          </Text>
          <Text
            onPress={() => Linking.openURL('https://www.google.com')}
            style={[styles.policyText, { fontWeight: 'bold' }]}
          >
            https://supercell.com/en/fan-content-policy/
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  innerContainer: {
    marginHorizontal: 20,
    marginVertical: 5,
    top: StatusBar.currentHeight * 2,
  },
  info: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    elevation: 7,
    marginBottom: 10,
  },
  avatar: {
    marginRight: 15,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    borderRadius: 7,
    marginVertical: 7,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  policy: {
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    elevation: 7,
    marginBottom: 10,
  },
  policyText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 15,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Account;
