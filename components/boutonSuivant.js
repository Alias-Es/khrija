import React, { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, Text, Keyboard, StyleSheet, Platform } from 'react-native';

const SubmitButton = ({ onPress, disabled }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const buttonPositionAnimated = useRef(new Animated.Value(40)).current; // Position initiale (remontée)

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardVisible(true);
        Animated.timing(buttonPositionAnimated, {
          toValue: event.endCoordinates.height - 25, // Position au-dessus du clavier
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.timing(buttonPositionAnimated, {
          toValue: 60, // Remonte légèrement le bouton lorsqu'il n'y a pas de clavier
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.submitButtonContainer,
        { bottom: buttonPositionAnimated },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.submitButton,
          disabled ? styles.disabledButton : null,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={styles.submitButtonText}>Suivant</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  submitButtonContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    left: 0,
    right: 0,
    paddingLeft : 45,
    
  },
  submitButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '90%',
    bottom: 60,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubmitButton;
