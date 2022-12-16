import * as React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, Actionsheet } from 'native-base';
import I18n from '@iresucito/translations';
import { defaultExportToPdfOptions, SongToPdf } from '@iresucito/core';
import { useData } from '../DataContext';
import { NativeParser } from '../util';
import { generateSongPDF } from '../pdf';

import type { SongsStackParamList } from '../navigation/SongsNavigator';

type PDFViewerScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'PDFViewer'
>;

const ChoosePdfTypeForExport = (props: any) => {
  const { isOpen, onClose } = props.chooser;
  const navigation = useNavigation<PDFViewerScreenNavigationProp>();
  const data = useData();
  const { songs } = data.songsMeta;
  const [, setLoading] = data.loading;

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Text bold>{I18n.t('ui.export.type')}</Text>
        <Actionsheet.Item
          onPress={() => {
            onClose();
            Alert.alert('TODO', 'TBD');
          }}>
          {I18n.t('pdf_export_options.selected songs')}
        </Actionsheet.Item>
        <Actionsheet.Item
          onPress={() => {
            onClose();
            const localeNoCountry = I18n.locale.split('-')[0];
            const songToExport = songs.filter(
              (s) =>
                s.files.hasOwnProperty(I18n.locale) ||
                s.files.hasOwnProperty(localeNoCountry)
            );
            var items: Array<SongToPdf> = songToExport.map((s) => {
              return {
                song: s,
                render: NativeParser.getForRender(s.fullText, I18n.locale),
              };
            });
            setLoading({
              isLoading: true,
              text: I18n.t('ui.export.processing songs', {
                total: songToExport.length,
              }),
            });
            generateSongPDF(
              items,
              defaultExportToPdfOptions,
              `-${I18n.locale}`
            ).then((path) => {
              navigation.navigate('PDFViewer', {
                uri: path,
                title: I18n.t('ui.export.pdf viewer title'),
              });
              setLoading({ isLoading: false, text: '' });
            });
          }}>
          {I18n.t('pdf_export_options.complete book')}
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ChoosePdfTypeForExport;
