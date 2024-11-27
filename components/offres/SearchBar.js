// components/offres/SearchBar.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <TextInput
      style={styles.searchBar}
      placeholder="Rechercher un nom..."
      value={searchText}
      onChangeText={text => setSearchText(text)}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    width: '90%',
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default SearchBar;
