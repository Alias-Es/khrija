import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const CreeCompteApple2 = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Récupérer uniquement l'userId transmis depuis CreeCompteApple1
  const userId = route.params?.userId;
  const [nom, setNom] = useState('');

  const handleNext = () => {
    // Navigation vers CreeCompteApple3 avec userId et nom uniquement
    navigation.navigate('CreeCompteApple3', {
      userId,
      nom,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer votre compte</Text>
      <Text style={styles.info}>
        Bienvenue, veuillez entrer votre nom pour continuer.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre nom"
        value={nom}
        onChangeText={(text) => setNom(text)}
      />
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: nom ? '#007AFF' : '#aaa' }]}
        onPress={handleNext}
        disabled={!nom}
      >
        <Text style={styles.nextButtonText}>Suivant</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  nextButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreeCompteApple2;
