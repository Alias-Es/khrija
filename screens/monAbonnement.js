import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';

const MonAbonnement = () => {
  const abonnement = {
    debut: '01/11/2024',
    type: 'Annuel',
    expiration: '01/11/2025',
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir annuler votre abonnement ?",
      [
        { text: "Non", style: "cancel" },
        { text: "Oui", onPress: () => Alert.alert("Abonnement annulé") }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mon Abonnement</Text>
      </View>

      <View style={styles.subscriptionContainer}>
        <Text style={styles.infoLabel}>Date de début :</Text>
        <Text style={styles.infoText}>{abonnement.debut}</Text>

        <Text style={styles.infoLabel}>Type d'abonnement :</Text>
        <Text style={styles.infoText}>{abonnement.type}</Text>

        <Text style={styles.infoLabel}>Date d'expiration :</Text>
        <Text style={styles.infoText}>{abonnement.expiration}</Text>
      </View>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancelSubscription}
      >
        <Text style={styles.cancelButtonText}>Annuler mon abonnement</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
  },
  header: {
    marginVertical: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  subscriptionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center', // Centre le bouton horizontalement
    width: '60%', // Réduit la largeur du bouton
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default MonAbonnement;
