// SubscribeButtonCompte.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SubscribeButtonCompte = ({ disabled, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.subscribeButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.subscribeButtonText}>M'abonner</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subscribeButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 40,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubscribeButtonCompte;
