// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBv22dLgxpV4ePPEomcPt0Hf6s83_W5Vso",
    authDomain: "xer0-4fde7.firebaseapp.com",
    projectId: "xer0-4fde7",
    storageBucket: "xer0-4fde7.appspot.com",
    messagingSenderId: "380173312613",
    appId: "1:380173312613:web:f29fc23f11a99f53b19c8c",
    measurementId: "G-G4R3DGSWEM",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default auth;