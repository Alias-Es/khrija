// /components/GoogleSignInButton.js

import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const GoogleSignInButton = ({ onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.googleButton, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Image source={require('../assets/images/google.png')} style={styles.googleIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  googleIcon: {
    width: 250,
    height: 50,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default GoogleSignInButton;
