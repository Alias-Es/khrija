// ProfileOptionCompte.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ProfileOptionCompte = ({ text, onPress, isLogout }) => {
  return (
    <TouchableOpacity style={styles.profileOption} onPress={onPress}>
      <Text style={isLogout ? styles.logoutText : styles.profileText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileOption: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  profileText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default ProfileOptionCompte;
