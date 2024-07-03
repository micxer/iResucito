import type { StackScreenProps } from '@react-navigation/stack';
import { useMemo, useCallback, useState } from 'react';
import { useWindowDimensions, useColorScheme } from 'react-native';
import { Text, Center, Spinner } from '@gluestack-ui/themed';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { ModalView } from '../components';
import { ChooserParamList } from '../navigation';
import { useSettingsStore, useListsStore } from '../hooks';
import i18n from '@iresucito/translations';
import { SongList } from './SongList';
import { Song } from '@iresucito/core';
import { config } from '../config/gluestack-ui.config';

type Props = StackScreenProps<ChooserParamList, 'Dialog'>;

export const SongChooserDialog = (props: Props) => {
  const layout = useWindowDimensions();
  const { navigation, route } = props;
  const { searchItems } = useSettingsStore();
  const scheme = useColorScheme();
  const { target } = route.params;
  const { listName, listKey, listKeyIndex } = target;

  const choosers = useMemo(() => {
    if (searchItems !== undefined) {
      return searchItems.filter((x) => x.chooser !== undefined);
    }
    return [];
  }, [searchItems]);

  const [activeTab, setActiveTab] = useState(() => {
    if (listName && listKey) {
      var c = choosers.find(
        (t) =>
          t.chooser_listKey && t.chooser_listKey.includes(listKey as string)
      );
      if (c) {
        const tab = choosers.indexOf(c);
        return tab;
      }
    }
    return 0;
  });

  const songAssign = useCallback(
    (song: Song) => {
      if (listName && listKey !== undefined) {
        useListsStore
          .getState()
          .setList(listName, listKey, song.key, listKeyIndex);
        navigation.goBack();
      }
    },
    [navigation, listName, listKey, listKeyIndex]
  );

  const routes = useMemo(() => {
    return choosers.map((c, i) => {
      return {
        key: c.chooser as string,
        title: (c.chooser as string).toUpperCase(),
      };
    });
  }, [choosers]);

  const renderScene = useMemo(() => {
    var config: any = {};
    choosers.forEach((c) => {
      config[c.chooser as string] = () => (
        <SongList
          filter={c.params?.filter}
          viewButton={true}
          onPress={(song: Song) => songAssign(song)}
        />
      );
    });
    return SceneMap(config);
  }, [choosers, songAssign]);

  /* keyboardAvoidingView={false}; si es =true provoca el efecto siguiente:
     el usuario hace tap sobre el input de búsqueda
     el teclado se abre, y luego de unos pocos ms.
     el teclado se cierra automaticamente
  */

  if (routes.length == 0) {
    return null;
  }

  return (
    <ModalView
      keyboardAvoidingView={false}
      left={
        <Text
          fontWeight="bold"
          fontSize="$md"
          mt="$2"
          ml="$4"
          style={{
            alignSelf: 'flex-start',
          }}>
          {i18n.t('screen_title.find song')}
        </Text>
      }>
      <TabView
        animationEnabled={false}
        lazy
        renderLazyPlaceholder={() => {
          return (
            <Center pt="$5">
              <Spinner color="$rose500" size="large" />
              <Text>{i18n.t('ui.loading')}</Text>
            </Center>
          );
        }}
        renderTabBar={(props: any) => {
          return (
            <TabBar
              key={props.key}
              layout={props.layout}
              position={props.position}
              navigationState={props.navigationState}
              jumpTo={props.jumpTo}
              scrollEnabled
              tabStyle={{ width: 'auto' }}
              style={{
                backgroundColor:
                  scheme == 'dark'
                    ? config.tokens.colors.backgroundDark950
                    : config.tokens.colors.backgroundLight100,
              }}
              indicatorStyle={{
                backgroundColor: config.tokens.colors.rose500,
                marginHorizontal: 3,
              }}
              renderLabel={({ route: currentRoute, focused, color }) => (
                <Text
                  style={{
                    color:
                      scheme == 'dark'
                        ? focused
                          ? config.tokens.colors.rose500
                          : config.tokens.colors.textLight300
                        : focused
                        ? config.tokens.colors.rose500
                        : config.tokens.colors.textDark600,
                    margin: 3,
                  }}>
                  {currentRoute.title}
                </Text>
              )}
            />
          );
        }}
        navigationState={{ index: activeTab, routes }}
        renderScene={renderScene}
        onIndexChange={setActiveTab}
        initialLayout={{ width: layout.width }}
      />
    </ModalView>
  );
};
