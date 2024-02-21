import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

import Home from '../screens/home.js';
import Status from '../screens/status.js';
import Requests from '../screens/requests.js';
import Events from '../screens/events.js';

const HomeRoute = () => <Home />;
const ProfileRoute = () => <Status />;
const WarRoute = () => <Requests />;
// const EventRoute = () => <Events />;

const Landing = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'warStatus', title: 'War Status', focusedIcon: 'shield', unfocusedIcon: 'shield-outline' },
    { key: 'profile', title: 'Troop Requests', focusedIcon: 'arrow-right-bold-box', unfocusedIcon: 'arrow-right-bold-box-outline' },
    // { key: 'requests', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    warStatus: ProfileRoute,
    profile: WarRoute,
    // requests: EventRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor='#fff'
      inactiveColor='#636363'
      barStyle={{ backgroundColor: '#000' }}
      theme={{colors: {secondaryContainer: 'transparent'}}}
      sceneAnimationEnabled={true}
      sceneAnimationType='shifting'
    />
  );
};

export default Landing;