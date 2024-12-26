// components/OfferSection.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OfferSection = ({ title, offerText, isActive, styleType }) => {
  const containerStyles = [
    styles.offerContainer,
    styles[`offerContainer${styleType}`],
    isActive && styles[`offerContainerActive${styleType}`],
  ];

  const textStyles = [
    styles.offerText,
    isActive && styles[`offerTextActive${styleType}`],
  ];

  return (
    <View>
      <Text style={styles[`offerTitle${styleType}`]}>{title}</Text>
      <View style={containerStyles}>
        <Text style={textStyles}>{offerText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  offerTitlePonctuelle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF4081',
    marginTop: 10,
  },
  offerTitlePermanente: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginTop: 0,
  },
  offerContainer: {
    padding: 15,
    borderRadius: 20,
    marginVertical: 20,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    
  },
  offerContainerPonctuelle: {
    backgroundColor: '#FFFFFF',
  },
  offerContainerPermanente: {
    backgroundColor: '#F8F8F8',
  },
  offerContainerActivePonctuelle: {
    borderColor: '#FF79A7',
  },
  offerContainerActivePermanente: {
    borderColor: '#80B1EB',
  },
  offerText: {
    fontSize: 15,
    color: '#A9A9A9',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  offerTextActivePonctuelle: {
    color: '#FF79A7',
  },
  offerTextActivePermanente: {
    color: '#80B1EB',
  },
});

export default OfferSection;
