import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import { Platform, StyleSheet } from 'react-native';
import { Box, Input, Icon, useTheme } from 'native-base';
import { useDebounce } from 'use-debounce';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from '@iresucito/translations';

const DebouncedInput = (props: { value: string; setValue: Function; placeholder: string }) => {
  const { value, setValue, placeholder } = props;
  const [searchTerm, setSearchTerm] = useState(value);
  const [debouncedTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    setValue(debouncedTerm);
  }, [debouncedTerm, setValue]);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  return (
    <Input
      m="1"
      size="md"
      isFullWidth
      placeholder={placeholder}
      onChangeText={setSearchTerm}
      value={searchTerm}
      returnKeyType="search"
      autoCapitalize="none"
      clearButtonMode="always"
      autoCorrect={false}
      InputLeftElement={
        <Icon as={Ionicons} size="sm" name="search" color="rose.500" ml="2" />
      }
      InputRightElement={
        Platform.OS === 'android' ? (
          <Icon
            as={Ionicons}
            size="sm"
            name="close"
            color="rose.500"
            mr="2"
            onPress={() => setSearchTerm('')}
          />
        ) : undefined
      }
    />
  );
};

const SearchBarView = (props: {
  value: string;
  setValue: Function;
  placeholder: string,
  children: any;
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  useAndroidBackHandler(() => {
    navigation.goBack();
    return true;
  });

  return (
    <>
      <DebouncedInput
        value={props.value}
        setValue={props.setValue}
        placeholder={props.placeholder} />
      <Box
        flex={1}
        borderTopWidth={StyleSheet.hairlineWidth}
        borderTopColor={colors.muted['300']}>
        {props.children}
      </Box>
    </>
  );
};

export default SearchBarView;
