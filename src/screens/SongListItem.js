// @flow
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, Alert, View } from 'react-native';
import {
  ListItem,
  Left,
  Right,
  Body,
  Text,
  Badge,
  Icon,
  Button
} from 'native-base';
import Highlighter from 'react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import badges from '../badges';
import commonTheme from '../native-base-theme/variables/platform';
import textTheme from '../native-base-theme/components/Text';
import I18n from '../translations';
import { DataContext } from '../DataContext';

const textStyles = textTheme(commonTheme);
const noteStyles = textStyles['.note'];
delete textStyles['.note'];

const SongListItem = (props: any) => {
  const data = useContext(DataContext);
  const {
    navigation,
    highlight,
    song,
    showBadge,
    devModeDisabled,
    patchSectionDisabled
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { keys } = data.settings;
  const { getSongLocalePatch, setSongLocalePatch } = data.songsMeta;
  const [developerMode, setDeveloperMode] = useState();
  const [firstHighlighted, setFirstHighlighted] = useState();
  const [highlightedRest, setHighlightedRest] = useState();
  const [openHighlightedRest, setOpenHighlightedRest] = useState();
  const [bodyExtraContent, setBodyExtraContent] = useState();
  const [rightContent, setRightContent] = useState();

  const changeName = () => {
    getSongLocalePatch(song).then(patchObj => {
      var file = song.nombre;
      var rename = undefined;
      if (patchObj) {
        file = patchObj[I18n.locale].file;
        rename = patchObj[I18n.locale].rename;
      }
      // Definir cambio a realizar sobre el patch
      const applyChanges = renameTo => {
        setSongLocalePatch(song, file, renameTo);
      };
      navigation.navigate('SongChangeName', {
        song: song,
        nameToEdit: rename ? rename : file,
        action: applyChanges
      });
    });
  };

  const showEditor = () => {
    navigation.navigate('SongEditor', {
      song: song
    });
  };

  const confirmClearSongPatch = () => {
    Alert.alert(
      I18n.t('ui.confirmation'),
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          style: 'destructive',
          onPress: () => {
            setSongLocalePatch(song, undefined);
          }
        },
        {
          text: I18n.t('ui.cancel'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    var isOn = devModeDisabled === true ? false : keys.developerMode;
    setDeveloperMode(isOn);
  }, [keys.developerMode]);

  useEffect(() => {
    if (
      highlight &&
      !song.error &&
      song.fullText.toLowerCase().includes(highlight.toLowerCase())
    ) {
      var linesToHighlight = song.lines.filter(l =>
        l.toLowerCase().includes(highlight.toLowerCase())
      );
      var children = linesToHighlight.map((l, i) => {
        return (
          <Highlighter
            key={i}
            highlightStyle={{
              backgroundColor: 'yellow'
            }}
            searchWords={[highlight]}
            textToHighlight={l}
          />
        );
      });
      setFirstHighlighted(children.shift());
      if (children.length > 1) {
        setHighlightedRest(
          <Collapsible collapsed={isCollapsed}>{children}</Collapsible>
        );
        setOpenHighlightedRest(
          <Right>
            <TouchableOpacity
              onPress={() => {
                setIsCollapsed(!isCollapsed);
              }}>
              <Badge warning>
                <Text>{children.length}+</Text>
              </Badge>
            </TouchableOpacity>
          </Right>
        );
      }
    }
  }, [highlight, developerMode]);

  useEffect(() => {
    if (
      developerMode === true &&
      !openHighlightedRest &&
      !patchSectionDisabled
    ) {
      setBodyExtraContent(
        <Fragment>
          {song.patched && (
            <Text style={{ ...noteStyles, margin: 5 }}>
              {song.patchedTitle}
            </Text>
          )}
          <View style={{ flexDirection: 'row' }}>
            <Button
              style={{ margin: 5 }}
              bordered
              small
              onPress={() => changeName()}>
              <Text>{I18n.t('ui.rename')}</Text>
            </Button>
            <Button
              style={{ margin: 5 }}
              bordered
              small
              onPress={() => showEditor()}>
              <Text>{I18n.t('ui.edit')}</Text>
            </Button>
          </View>
        </Fragment>
      );
      if (song.patched) {
        setRightContent(
          <Right>
            <Icon
              name="remove-circle-outline"
              style={{
                fontSize: 32,
                color: commonTheme.brandPrimary
              }}
              onPress={confirmClearSongPatch}
            />
          </Right>
        );
      } else {
        setRightContent(
          <Right>
            <Icon
              name="link"
              style={{
                fontSize: 32,
                color: commonTheme.brandPrimary
              }}
              onPress={() =>
                navigation.navigate('SongChooseLocale', {
                  target: song,
                  targetType: 'song'
                })
              }
            />
          </Right>
        );
      }
    }
    if (developerMode === false && !patchSectionDisabled) {
      setBodyExtraContent(
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              I18n.t('ui.locale warning title'),
              I18n.t('ui.locale warning message')
            );
          }}
          style={{ flex: 1, flexDirection: 'row-reverse' }}>
          <Icon
            name="bug"
            style={{
              marginTop: 2,
              marginRight: 20,
              fontSize: 20,
              color: commonTheme.brandPrimary
            }}
          />
          <Text style={{ ...noteStyles, marginRight: 5, marginTop: 5 }}>
            {I18n.t('ui.locale warning title')}
          </Text>
        </TouchableOpacity>
      );
    }
  }, [developerMode, patchSectionDisabled, openHighlightedRest]);

  return (
    <ListItem avatar={showBadge} noIndent>
      {showBadge && <Left>{badges[song.etapa]}</Left>}
      <Body>
        <TouchableOpacity
          onPress={() => {
            if (props.onPress) {
              props.onPress(song);
            }
          }}>
          <Highlighter
            numberOfLines={1}
            style={textStyles}
            highlightStyle={{
              backgroundColor: 'yellow'
            }}
            searchWords={[highlight]}
            textToHighlight={song.titulo}
          />
          <Highlighter
            numberOfLines={1}
            style={noteStyles}
            highlightStyle={{
              backgroundColor: 'yellow'
            }}
            searchWords={[highlight]}
            textToHighlight={song.fuente}
          />
          {firstHighlighted}
          {highlightedRest}
        </TouchableOpacity>
        {bodyExtraContent}
      </Body>
      {openHighlightedRest}
      {rightContent}
      {song.error && (
        <Right>
          <Icon
            name="bug"
            style={{
              fontSize: 32,
              color: commonTheme.brandPrimary
            }}
            onPress={() => {
              Alert.alert('Error', song.error);
            }}
          />
        </Right>
      )}
    </ListItem>
  );
};

export default withNavigation(SongListItem);