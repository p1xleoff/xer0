import React from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';

import Home from '../screens/home.js';
import Register from '../screens/register.js'

const Stack = createStackNavigator();

export const Navigator = () => {
  const navigation = useNavigation();
  return (
    <PaperProvider>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
    </PaperProvider>
  );
};