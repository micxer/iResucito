import React from 'react';
import { connect } from 'react-redux';
import { FlatList, Modal, TouchableOpacity, Image } from 'react-native';
import {
  Content,
  Header,
  Title,
  Container,
  ListItem,
  Left,
  Right,
  Body,
  Text,
  Icon,
  Button,
  H1
} from 'native-base';
import DeviceInfo from 'react-native-device-info';
import { appNavigatorConfig } from '../AppNavigator';
import { SET_ABOUT_VISIBLE } from '../actions';

const MenuScreen = props => {
  return (
    <Container>
      <Modal animationTyper="slide" visible={props.aboutVisible}>
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
          onPress={() => props.closeAbout()}>
          <Image
            source={require('../../img/cristo.jpg')}
            style={{ width: 300, height: 400 }}
            resizeMode="contain"
          />
          <H1 style={{ color: 'red', fontWeight: 'bold' }}>iResucitó</H1>
          <Text>Versión: {DeviceInfo.getReadableVersion()}</Text>
          <Text>Javier Castro, 2017</Text>
        </TouchableOpacity>
      </Modal>
      <FlatList
        data={props.screens}
        keyExtractor={item => item.title}
        renderItem={({ item }) => {
          if (item.divider) {
            return (
              <ListItem itemDivider>
                <Text>{item.title}</Text>
              </ListItem>
            );
          }
          return (
            <ListItem
              avatar
              onPress={() => {
                props.navigation.navigate(item.route, item.params);
              }}>
              <Left>{item.badge}</Left>
              <Body>
                <Text>{item.title}</Text>
                <Text note>{item.note}</Text>
              </Body>
            </ListItem>
          );
        }}
      />
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    screens: state.ui.get('menu'),
    aboutVisible: state.ui.get('about_visible')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showAbout: () => {
      dispatch({ type: SET_ABOUT_VISIBLE, visible: true });
    },
    closeAbout: () => {
      dispatch({ type: SET_ABOUT_VISIBLE, visible: false });
    }
  };
};

const AboutIcon = props => {
  return (
    <Icon
      name="help-circle"
      style={{
        color: props.navigationOptions.headerTitleStyle.color,
        paddingRight: 10
      }}
      onPress={() => props.showAbout()}
    />
  );
};

const ConnectedAboutIcon = connect(mapStateToProps, mapDispatchToProps)(
  AboutIcon
);

MenuScreen.navigationOptions = props => ({
  title: 'iResucitó',
  headerRight: <ConnectedAboutIcon {...props} />
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);
