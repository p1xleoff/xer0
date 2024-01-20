// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './config/navigator';
import 'react-native-reanimated';
import 'react-native-gesture-handler';

export default function App() {
  return (
    <NavigationContainer>
        <Navigator />
    </NavigationContainer>
  );
}