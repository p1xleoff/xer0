import React from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';

import Home from '../screens/home.js';
import Register from '../screens/register.js';
import Login from '../screens/login.js';
import Profile from '../screens/profile.js';
import Status from '../screens/status.js';
import Tester from '../screens/tester.js';
import Welcome from '../screens/welcome.js';
import Account from '../screens/account.js';
import Requests from '../screens/requests.js';
import Events from '../screens/events.js';
import Admin from '../screens/admin.js';
import Landing from '../screens/landing.js';

const Stack = createStackNavigator();

export const Navigator = () => {
  const navigation = useNavigation();
  return (
    <PaperProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#040404',
            elevation: 0,
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Tester" component={Tester} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="Requests" component={Requests} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Status" component={Status} options={{ title: 'Player War Status' }} />
      </Stack.Navigator>
    </PaperProvider>
  );
};
