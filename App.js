// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './config/navigator';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import initializeFirebase from './config/firebase';

export default function App() {

  return (
    <NavigationContainer>
        <Navigator />
    </NavigationContainer>
  );
}
