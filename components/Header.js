// components/Header.js

import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Header = ({ coverImageUri, onBackPress }) => (
  <View style={styles.header}>
    <Image source={{ uri: coverImageUri }} style={styles.coverImage} />
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBackPress}
    >
      <FontAwesome name="arrow-left" size={24} color="#FFF" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    height: 200,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
});

export default Header;
