// components/OfferButton.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const OfferButton = ({ onPress, text, buttonType, isDisabled }) => {
  const buttonStyle = [
    styles.subscriptionRequirementButton,
    isDisabled ? styles.subscriptionRequirementButtonInactive : styles[`subscriptionRequirementButtonActive${buttonType}`],
  ];

  const textStyle = [
    styles.subscriptionRequirementText,
    isDisabled
      ? styles.subscriptionRequirementTextInactive
      : styles.subscriptionRequirementTextActive,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subscriptionRequirementButton: {
    paddingVertical: 0,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    width: '100%',
    height: 55,
  },
  subscriptionRequirementButtonActive1: {
    backgroundColor: '#FF4081',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },
  subscriptionRequirementButtonActive2: {
    backgroundColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  subscriptionRequirementButtonInactive: {
    backgroundColor: '#B3B3B3',
  },
  subscriptionRequirementText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscriptionRequirementTextActive: {
    color: '#FFFFFF',
  },
  subscriptionRequirementTextInactive: {
    color: '#FFFFFF',
  },
});

export default OfferButton;
