// components/offres/CategoryButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CategoryButton = ({ category, isActive, onToggle }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.buttonActive]}
      onPress={() => onToggle(category)}
    >
      <Text style={[styles.text, isActive && styles.textActive]}>{category}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 5,
  },
  buttonActive: {
    backgroundColor: '#FF4081',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  textActive: {
    color: '#FFF',
  },
});

export default CategoryButton;
