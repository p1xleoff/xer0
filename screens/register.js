import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
      navigation.replace("Home")    
      }
    });
  }, [] )
  
  const toLogin = () => {
    navigation.navigate('Login');
  };

  //sign up
  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert('Please enter an email, password, and username');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Please enter a valid email address');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert('The password must be at least 8 characters long');
      return;
    }

    const auth = getAuth();
    const database = getDatabase();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user information in Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, { email, username });

      navigation.replace('Home');
      console.log('Registered with:', user.email);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      Alert.alert('Email already in use');
    }
  };
  const isValidEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };
  const isValidPassword = (password) => {
    return password.length >= 6;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        mode="outlined"
        activeOutlineColor='#000'
        label="Email"
        keyboardType='email-address'
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Password"       
        value={password}
        activeOutlineColor='#000'
        onChangeText={text => setPassword(text)}
        secureTextEntry={!passwordVisible}
        right={
        <TextInput.Icon 
          icon={passwordVisible ?'eye' : 'eye-off'} 
          onPress={() => setPasswordVisible(!passwordVisible)}/>
      }     
        />                   
      <TextInput
        style={styles.input}
        mode="outlined"
        activeOutlineColor='#000'
        label="Username"
        onChangeText={(text) => setUsername(text)}
      />
      <View>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignUp}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.text}>
            Already have an account? 
                <Text onPress={toLogin}
                  style={{fontWeight: 'bold', fontSize: 24}}> Log In
                </Text>
        </Text>
        {/* <TouchableOpacity style={styles.button} onPress={toLanding}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 9,
    marginBottom: 10,
    color: '#000',
  },
  button: {
    width: '100%',
    borderRadius: 9,
    marginVertical: '10%',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: '3%',
    elevation: 5,
},  
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
},
  title: {
    marginVertical: '20%',
    width: '100%',
    fontSize: 66,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#000',
},
  textWrap: {
  alignItems: 'center',
},
  text: {
  color: '#000',
  fontSize: 20,
},
});

export default Register; 