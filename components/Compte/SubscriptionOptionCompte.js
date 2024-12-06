// SubscriptionOptionCompte.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SubscriptionOptionCompte = ({ type, price, period, info1, info2, selected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[
        styles.subscriptionBox,
        selected && styles.selectedBox,
      ]}
      onPress={onSelect}
    >
      <Text style={styles.subscriptionTitle}>{type}</Text>
      <Text style={type === 'ABONNEMENT ANNUEL' ? styles.subscriptionPriceAnnee : styles.subscriptionPriceMois}>
        {price} MAD
      </Text>
      <Text style={styles.subscriptionPeriod}>/par {period}</Text>
     </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subscriptionBox: {
    width: '45%',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  selectedBox: {
    backgroundColor: '#FFE6F0',
    borderColor: '#E91E63',
    borderWidth: 1,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  subscriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
    textAlign: 'center',
  },
  subscriptionPriceAnnee: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  subscriptionPriceMois: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  subscriptionPeriod: {
    fontSize: 14,
    color: '#555',
  },
  subscriptionInfo: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default SubscriptionOptionCompte;
