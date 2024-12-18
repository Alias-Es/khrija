import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ searchText, setSearchText }) => {
  const [localText, setLocalText] = useState(searchText);

  useEffect(() => {
    const handler = setTimeout(() => setSearchText(localText), 300); // Délai de 300ms
    return () => clearTimeout(handler);
  }, [localText]);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#666" style={styles.icon} />
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un nom..."
        value={localText}
        onChangeText={text => setLocalText(text)}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: '90%',
    maxWidth: 400,
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
});

export default SearchBar;
