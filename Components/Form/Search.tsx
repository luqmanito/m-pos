import React, {FunctionComponent, useContext, useState, useMemo} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Input} from 'native-base';
import {debounce} from 'lodash';
import {PrimaryColorContext} from '../../Context';
import {useTranslation} from 'react-i18next';

type SearchProps = {
  placeHolder?: string;
  search: (query: string) => void;
};

const Search: FunctionComponent<SearchProps> = ({placeHolder, search}) => {
  const [searchResults, setSearchResults] = useState('');
  const primaryColor = useContext(PrimaryColorContext);
  const {t} = useTranslation();

  const performSearch = (query: string) => {
    search(query);
  };

  const debouncedSearch = useMemo(() => debounce(performSearch, 2000), []);

  const handleSearchChange = (query: string) => {
    debouncedSearch(query);
    setSearchResults(query);
  };

  return (
    <Input
      bg={'white'}
      placeholder={!placeHolder ? t('search') : placeHolder}
      placeholderTextColor={'#888888'}
      variant="filled"
      value={searchResults}
      onChangeText={text => {
        handleSearchChange(text);
      }}
      width="100%"
      borderRadius="10"
      InputLeftElement={
        <Ionicons
          style={styles.iconSearch}
          name="search"
          size={20}
          color={primaryColor?.primaryColor}
        />
      }
    />
  );
};

export default Search;

const styles = {
  iconSearch: {
    marginLeft: 5,
  },
};
