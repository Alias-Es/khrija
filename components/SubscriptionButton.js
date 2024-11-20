// components/SubscriptionButton.js

import React from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';

const SubscriptionButton = ({ onPress, animatedStyle }) => (
  <Animated.View style={[styles.buttonContainer, animatedStyle]}>
    <TouchableOpacity style={styles.subscribeButton} onPress={onPress}>
      <Text style={styles.subscribeButtonText}>M'ABONNER</Text>
    </TouchableOpacity>
  </Animated.View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  subscribeButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubscriptionButton;
