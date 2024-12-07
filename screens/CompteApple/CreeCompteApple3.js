import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const CreeCompteApple3 = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Récupérer les données utilisateur transmises depuis CreeCompteApple2
  const userId = route.params?.userId;
  const nom = route.params?.nom;

  const [prenom, setPrenom] = useState('');

  const handleNext = () => {
    // Navigation vers CreeCompteApple4 avec userId, nom et prenom
    navigation.navigate('CreeCompteApple4', {
      userId,
      nom,
      prenom,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalisez votre inscription</Text>
      <Text style={styles.info}>
        Bonjour {nom || 'Utilisateur'}, veuillez entrer votre prénom pour continuer.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre prénom"
        value={prenom}
        onChangeText={(text) => setPrenom(text)}
      />
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: prenom ? '#007AFF' : '#aaa' }]}
        onPress={handleNext}
        disabled={!prenom}
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

export default CreeCompteApple3;
