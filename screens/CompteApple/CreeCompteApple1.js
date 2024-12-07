import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreeCompteApple1 = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { userId, fullName } = route.params;

  const handleContinue = () => {
    navigation.navigate('CreeCompteApple2', { userId, fullName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={styles.subtitle}>
        Nous avons détecté votre identifiant Apple. Poursuivez pour compléter votre inscription.
      </Text>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreeCompteApple1;
