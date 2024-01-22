// App.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './config/navigator';
import 'react-native-reanimated';
import 'react-native-gesture-handler';

export default function App() {

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Navigator />
    </NavigationContainer>
  );
}
