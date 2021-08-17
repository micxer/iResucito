// @flow
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import {
  NativeBaseProvider,
  extendTheme,
  theme as BaseTheme,
} from 'native-base';
import * as Sentry from '@sentry/react-native';
import { MenuProvider } from 'react-native-popup-menu';
import DataContextWrapper from './DataContext';
import RootNavigator from './navigation/RootNavigator';

Sentry.init({
  dsn: 'https://645393af749a4f3da9d8074330a25da3@o469156.ingest.sentry.io/5498083',
});

const appTheme = {
  primary: BaseTheme.colors.rose,
};

const theme = extendTheme({ colors: appTheme });

const App = (): React.Node => {
  return (
    <DataContextWrapper>
      <NativeBaseProvider
        theme={theme}
        config={{ suppressColorAccessibilityWarning: true }}>
        <MenuProvider backHandler={true}>
          <NavigationContainer
            onReady={() => {
              /* Para evitar efecto de 'salto' en layout de android
               * y efecto 'aplicar idioma' en ambas plataformas
               * esperar un segundo y medio antes de ocultar */
              setTimeout(() => {
                RNBootSplash.hide({ fade: true });
              }, 1500);
            }}>
            <RootNavigator />
          </NavigationContainer>
        </MenuProvider>
      </NativeBaseProvider>
    </DataContextWrapper>
  );
};

export default App;
