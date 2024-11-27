// LoadingAnimationCompte.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingAnimationCompte = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#E91E63" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default LoadingAnimationCompte;
