import React from 'react';
import { View, StyleSheet, Image, Pressable, StatusBar, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//import theme from '../config/theme';

function Welcome(props) {
    
    const navigation = useNavigation();
    const toRegister = () => {
      navigation.navigate('Register');
    };
    const toLogin = () => {
        navigation.navigate('Login');
      };
    
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../assets/clash.png')} />
        <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={toRegister}>
          <Text style={styles.text}>Sign Up</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={toLogin}>
          <Text style={styles.text}>Log In</Text>
        </Pressable>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#000',
    },
    image: {
        height: '100%',
        width: '100%',
    },
    buttonContainer:  {
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
        color: '#000',
    },
})

export default Welcome;