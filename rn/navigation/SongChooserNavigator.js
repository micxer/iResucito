// @flow
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SongChooserDialog from '../screens/SongChooserDialog';
import SongPreviewScreenDialog from '../screens/SongPreviewScreenDialog';
import useStackNavOptions from './useStackNavOptions';

const Stack = createStackNavigator();

const SongChooserNavigator = (): React.Node => {
  const options = useStackNavOptions();
  return (
    <Stack.Navigator
      screenOptions={{ ...options, headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="Dialog" component={SongChooserDialog} />
      <Stack.Screen name="ViewSong" component={SongPreviewScreenDialog} />
    </Stack.Navigator>
  );
};

export default SongChooserNavigator;
