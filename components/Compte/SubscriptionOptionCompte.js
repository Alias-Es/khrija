import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SubscriptionOptionCompte = ({ type, price, period, info1, info2, info3, selected, onSelect }) => {
  // Normaliser le type pour faciliter la comparaison
  const normalizedType = type.toUpperCase();

  // Définir les types d'abonnement annuel en français et en anglais
  const isAnnualSubscription = normalizedType === 'ABONNEMENT ANNUEL' || normalizedType === 'ANNUAL SUBSCRIPTION';

  return (
    <TouchableOpacity
      style={[
        styles.subscriptionBox,
        selected && styles.selectedBox,
      ]}
      onPress={onSelect}
    >
      <Text style={styles.subscriptionTitle}>{type}</Text>
      <Text style={isAnnualSubscription ? styles.subscriptionPriceAnnee : styles.subscriptionPriceMois}>
        {price} MAD
      </Text>
      <Text style={styles.subscriptionPeriod}>/ {period}</Text>
      <Text style={styles.subscriptionInfo}>{info1}</Text>
      <Text style={styles.subscriptionInfo}>{info2}</Text>
      {/* Vous pouvez ajouter info3 si nécessaire */}
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
  subscriptionExtraInfo: { /* Style ajouté */
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SubscriptionOptionCompte;
