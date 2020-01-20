// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import CommunityScreen from '../screens/CommunityScreen';

const CommunityNavigator = createStackNavigator(
  {
    Community: CommunityScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return StackNavigatorOptions();
    }
  }
);

CommunityNavigator.navigationOptions = () => ({
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="contacts"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  }
});

export default CommunityNavigator;
