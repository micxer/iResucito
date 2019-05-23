// @flow
import React, { useContext, useState, useEffect } from 'react';
import { Text, Input, Item, View, Button } from 'native-base';
import { DataContext } from '../DataContext';
import ModalView from './ModalView';
import { getFriendlyTextForListType } from '../util';
import I18n from '../translations';
import commonTheme from '../native-base-theme/variables/platform';

const ListNameDialog = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const { lists, addList, renameList } = data.lists;
  const [disabledReasonText, setDisabledReasonText] = useState(null);
  const [actionEnabled, setActionEnabled] = useState(false);
  const [name, setName] = useState('');

  const list = navigation.getParam('list');
  const action = navigation.getParam('action');
  const type = navigation.getParam('type');

  const runActionOnList = () => {
    if (action === 'create') {
      addList(name, type);
      navigation.navigate('ListDetail', { list: { name } });
    } else if (action === 'rename') {
      renameList(list.name, name);
      navigation.goBack(null);
    }
  };

  useEffect(() => {
    if (name) {
      var candidateName = name.trim();
      var listNames = Object.keys(lists);
      var result = candidateName !== '' && !listNames.includes(candidateName);
      setActionEnabled(result);
    } else {
      setActionEnabled(false);
    }
  }, [name]);

  useEffect(() => {
    if (!actionEnabled) {
      var text =
        name && name.trim() !== ''
          ? I18n.t('ui.lists.already exists')
          : I18n.t('ui.lists.non-empty name');
      setDisabledReasonText(text);
    } else {
      setDisabledReasonText(null);
    }
  }, [actionEnabled, name]);

  const title =
    action == 'create'
      ? `${I18n.t('ui.lists.create')} (${getFriendlyTextForListType(type)})`
      : `${I18n.t('ui.lists.rename')} (${list.name})`;

  return (
    <ModalView
      title={title}
      right={
        <Button
          rounded
          small
          style={{
            alignSelf: 'flex-end',
            color: commonTheme.brandPrimary,
            marginRight: 10
          }}
          disabled={!actionEnabled}
          onPress={runActionOnList}>
          <Text>
            {action === 'create' ? I18n.t('ui.create') : I18n.t('ui.rename')}
          </Text>
        </Button>
      }
      left={
        <Button
          rounded
          small
          style={{
            alignSelf: 'flex-start',
            color: commonTheme.brandPrimary,
            marginLeft: 10
          }}
          onPress={() => navigation.goBack(null)}>
          <Text>{I18n.t('ui.cancel')}</Text>
        </Button>
      }>
      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Item
          style={{ marginBottom: 20 }}
          error={!actionEnabled}
          success={actionEnabled}>
          <Input
            autoFocus
            onChangeText={setName}
            value={name}
            clearButtonMode="always"
            autoCorrect={false}
          />
        </Item>
        <Text danger note>
          {disabledReasonText}
        </Text>
      </View>
    </ModalView>
  );
};

export default ListNameDialog;
