// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, ref, onValue, off, push } from 'firebase/database';
// import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv22dLgxpV4ePPEomcPt0Hf6s83_W5Vso",
  authDomain: "xer0-4fde7.firebaseapp.com",
  databaseURL: "https://xer0-4fde7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xer0-4fde7",
  storageBucket: "xer0-4fde7.appspot.com",
  messagingSenderId: "380173312613",
  appId: "1:380173312613:web:f29fc23f11a99f53b19c8c",
  measurementId: "G-G4R3DGSWEM"
};
export const checkAuthState = (onUserAuthenticated, onUserLoggedOut) => {
  const auth = getAuth();
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is authenticated
      onUserAuthenticated(user);

      // Fetch additional user information from the database
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        console.log("User Data:", userData);

        // Now you can use the user data to display information on the home screen
      } else {
        console.error("User data not found in the database.");
      }
    } else {
      // User is logged out
      onUserLoggedOut();
    }
  });
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
// const firestore = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);
export { auth, app, database, ref, onAuthStateChanged, onValue, off, push };
// const analytics = getAnalytics(app);