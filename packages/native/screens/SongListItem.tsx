import { StackNavigationProp } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Icon,
  Pressable,
  Checkbox,
  useMedia,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import Highlighter from '@javier.alejandro.castro/react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import { AirbnbRating } from 'react-native-ratings';
import { BadgeByStage } from '../badges';
import i18n from '@iresucito/translations';
import { Song } from '@iresucito/core';
import { ChooserParamList } from '../navigation';
import { useSettingsStore, useSongsSelection } from '../hooks';
import { config } from '../config/gluestack-ui.config';
import { BugIcon, EyeIcon } from 'lucide-react-native';

const NoLocaleWarning = () => {
  return (
    <Pressable
      onPress={() => {
        Alert.alert(
          i18n.t('ui.locale warning title'),
          i18n.t('ui.locale warning message')
        );
      }}>
      <HStack alignItems="center">
        <Icon color="$rose700" as={BugIcon} size="sm" mr="$2" />
        <Text fontSize="$sm" color="$backgroundDark500">
          {i18n.t('ui.locale warning title')}
        </Text>
      </HStack>
    </Pressable>
  );
};

type ViewSongScreenNavigationProp = StackNavigationProp<
  ChooserParamList,
  'ViewSong'
>;

export const SongListItem = (props: {
  song: Song;
  showBadge?: boolean;
  highlight: string;
  viewButton: boolean;
  onPress: any;
  setSongSetting: any;
}) => {
  const media = useMedia();
  const navigation = useNavigation<ViewSongScreenNavigationProp>();
  const { ratingsEnabled } = useSettingsStore();
  const { selection, enabled, toggle } = useSongsSelection();
  const { song, highlight, showBadge, viewButton, setSongSetting } = props;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [firstHighlighted, setFirstHighlighted] =
    useState<JSX.Element | void>();
  const [highlightedRest, setHighlightedRest] = useState<JSX.Element | void>();
  const [openHighlightedRest, setOpenHighlightedRest] =
    useState<JSX.Element | void>();

  const viewSong = () => {
    navigation.navigate('ViewSong', {
      data: {
        title: song.titulo,
        source: song.fuente,
        text: song.fullText,
        stage: song.stage,
      },
    });
  };

  useEffect(() => {
    if (
      highlight &&
      !song.error &&
      song.fullText.toLowerCase().includes(highlight.toLowerCase())
    ) {
      const lines = song.fullText.split('\n');
      const linesToHighlight = lines.filter((l) =>
        l.toLowerCase().includes(highlight.toLowerCase())
      );
      var children = linesToHighlight.map((l, i) => {
        return (
          <Highlighter
            key={i}
            autoEscape
            style={{
              fontSize: media.md ? 17 : 12,
            }}
            highlightStyle={{
              backgroundColor: 'yellow',
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
          <Pressable
            onPress={() => {
              setIsCollapsed(!isCollapsed);
            }}>
            <Badge>
              <Badge.Text size={media.md ? '2xl' : 'sm'}>
                {children.length}+
              </Badge.Text>
            </Badge>
          </Pressable>
        );
      }
    } else {
      setFirstHighlighted();
      setHighlightedRest();
      setOpenHighlightedRest();
    }
  }, [highlight, isCollapsed, song]);

  var widthPercentText = 100;
  if (showBadge) {
    widthPercentText -= 10;
  }
  if (viewButton) {
    widthPercentText -= 10;
  }
  if (openHighlightedRest) {
    widthPercentText -= 10;
  }

  const isSelected = selection.includes(song.key);

  return (
    <Pressable
      testID={`song-${song.titulo}`}
      borderBottomWidth={1}
      borderBottomColor={isSelected ? '$rose200' : '$light200'}
      backgroundColor={isSelected ? '$rose100' : undefined}
      sx={{
        '@base': {
          p: '$2',
        },
        '@md': {
          p: '$3',
        },
      }}
      onPress={() => {
        if (enabled) {
          toggle(song.key);
        } else if (props.onPress) {
          props.onPress(song);
        }
      }}>
      <HStack>
        {showBadge && (
          <Box pt="$2" w="10%">
            <BadgeByStage stage={song.stage} />
          </Box>
        )}
        <VStack space="sm" p="$2" w={`${widthPercentText}%`}>
          <VStack>
            <HStack justifyContent={'space-between'}>
              <Highlighter
                autoEscape
                numberOfLines={1}
                style={{
                  fontWeight: 'bold',
                  fontSize: media.md ? 26 : 16,
                }}
                highlightStyle={{
                  backgroundColor: 'yellow',
                }}
                searchWords={[highlight]}
                textToHighlight={song.titulo}
              />
              {enabled ? (
                <Checkbox
                  isDisabled
                  value=""
                  isChecked={isSelected}
                  aria-label="Seleccionar"
                />
              ) : null}
            </HStack>
            <Highlighter
              autoEscape
              numberOfLines={1}
              style={{
                color: config.tokens.colors.backgroundDark500,
                paddingVertical: 2,
                fontSize: media.md ? 19 : 14,
              }}
              highlightStyle={{
                backgroundColor: 'yellow',
              }}
              searchWords={[highlight]}
              textToHighlight={song.fuente || '--'}
            />
            {firstHighlighted}
            {highlightedRest}
          </VStack>
          {song.notTranslated && <NoLocaleWarning />}
          {!enabled && ratingsEnabled && (
            <AirbnbRating
              showRating={false}
              defaultRating={song.rating}
              selectedColor={config.tokens.colors.rose400}
              // @ts-ignore
              unSelectedColor={config.tokens.colors.rose100}
              ratingContainerStyle={{ paddingVertical: 5 }}
              size={25}
              onFinishRating={(position: number) =>
                setSongSetting(song.key, i18n.locale, 'rating', position)
              }
            />
          )}
        </VStack>
        {openHighlightedRest && (
          <Box pt="$2" alignItems="center" w="10%">
            {openHighlightedRest}
          </Box>
        )}
        {viewButton && (
          <Pressable pt="$2" alignItems="center" w="10%" onPress={viewSong}>
            <Icon
              as={EyeIcon}
              color="$rose500"
              size={media.md ? 'xxl' : 'xl'}
            />
          </Pressable>
        )}
        {song.error && (
          <Pressable
            onPress={() => {
              Alert.alert('Error', song.error);
            }}>
            <Icon as={BugIcon} size="xl" />
          </Pressable>
        )}
      </HStack>
    </Pressable>
  );
};
