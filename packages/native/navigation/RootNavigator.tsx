import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import {
  SongPreviewPdfDialog,
  SongPreviewScreenDialog,
  ContactImportDialog,
  ContactChooserDialog,
  ListNameDialog,
} from '../screens';
import MenuNavigator from './MenuNavigator';
import SongChooserNavigator, { ChooserParamList } from './SongChooserNavigator';
import { useStackNavOptions } from './useStackNavOptions';
import { ListAction, ListType } from '@iresucito/core';

export type RootStackParamList = {
  Menu: undefined;
  SongChooser: NavigatorScreenParams<ChooserParamList>;
  ContactChooser: { target: { listName: string; listKey: string } };
  ListName: {
    listName: string;
    action: ListAction;
    type?: ListType;
  };
  ContactImport: undefined;
  SongPreviewScreen: undefined;
  SongPreviewPdf: { uri: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const options = useStackNavOptions();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="Menu"
        component={MenuNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Group
        screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <Stack.Screen name="SongChooser" component={SongChooserNavigator} />
        <Stack.Screen name="ContactChooser" component={ContactChooserDialog} />
        <Stack.Screen name="ListName" component={ListNameDialog} />
        <Stack.Screen name="ContactImport" component={ContactImportDialog} />
        <Stack.Screen
          name="SongPreviewScreen"
          component={SongPreviewScreenDialog}
        />
        <Stack.Screen name="SongPreviewPdf" component={SongPreviewPdfDialog} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootNavigator;
