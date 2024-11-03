import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const MdpOublier = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handlePasswordReset = () => {
    // Utiliser Firebase Auth pour envoyer le mail de réinitialisation
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert("Succès", "Un e-mail de réinitialisation a été envoyé.");
        navigation.goBack(); // Retour à l'écran précédent
      })
      .catch(error => {
        Alert.alert("Erreur", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.logo}>KHRIJA</Text>
      <Text style={styles.subtitle}>MOT DE PASSE OUBLIER</Text>
      <Text style={styles.instruction}>Kteb hna e-mail dyal compte khrija dyalk </Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>VALIDER</Text>
      </TouchableOpacity>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'center',
    marginTop: -50, // Décale toute la page vers le haut
  },
  backButton: {
    position: 'absolute',
    top: 20, // Réduisez cette valeur pour remonter le bouton
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FF4081',
  },
  logo: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 90,
    fontWeight: 'bold',
    color: '#FF4081',
    textAlign: 'center',
    marginBottom: 110, // Réduisez la marge pour remonter le logo
  },
  subtitle: {
    textAlign: 'center',
    color: '#4A90E2',
    fontSize: 20,
    marginTop: -30,
    fontWeight: 'bold',
  },
  instruction: {
    textAlign: 'center',
    color: '#FF4081',
    marginTop: 20,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mention: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
    marginTop: 40,
  },
});


export default MdpOublier;
