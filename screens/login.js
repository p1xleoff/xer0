import React, { useState, useEffect, useContext } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

function Login() {

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
  const toRegister = () => {
    navigation.navigate('Register');
  };  
  const toHome = (userInfo) => {
    navigation.navigate('Landing', { userInfo });
  };

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Landing");
      }
    });
  }, []);

  const handleLogIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Save the user's login info to local storage
        //console.log('Logged in with: ', user.email);
        // Navigate to Home screen and pass user information
        toHome({ email: user.email });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Incorrect Email or Password');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LogIn</Text>
      <TextInput
        style={styles.input}
        mode="outlined"
        activeOutlineColor='#fff'
        textColor='#fff'
        label="Email"
        keyboardType='email-address'
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Password"
        activeOutlineColor='#fff'
        textColor='#fff'
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry={!passwordVisible}
        right={
          <TextInput.Icon 
            icon={passwordVisible ?'eye' : 'eye-off'} 
            onPress={() => setPasswordVisible(!passwordVisible)}/>
          } 
      />
      <View>
        <TouchableOpacity 
        style={styles.button}
        onPress={handleLogIn}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity> 
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.text}>
            Dont have an account? 
                <Text 
                  onPress={toRegister}
                  style={{fontWeight: 'bold', fontSize: 24}}> Sign Up
                </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#101010',
    flex: 1,
    padding: 20,
  },
  input: {
    backgroundColor: '#000',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18
  },
  button: {
    width: '100%',
    borderRadius: 9,
    marginVertical: '10%',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: '3%',
    elevation: 10,
  },  
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  title: {
    marginVertical: '20%',
    width: '100%',
    fontSize: 66,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#fff',
  },
  textWrap: {
    alignItems: 'center',
  },
  text: {
    color:  '#fff',
    fontSize: 20,
  },
});

export default Login;