import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, LogBox } from 'react-native';
import { firebase, auth } from '../FirebaseConfig'; // Assurez-vous que le chemin est correct

// Ignorer temporairement l'avertissement concernant defaultProps
LogBox.ignoreLogs([
  'FirebaseRecaptcha: Support for defaultProps will be removed from function components in a future major release.',
]);

const Telephone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [code, setCode] = useState('');

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(user => {
      if (user) {
        Alert.alert('Succès', 'Authentification réussie!');
        // Naviguez vers une autre page ou masquez les champs d'entrée ici
        // Exemple avec react-navigation :
        // navigation.navigate('Home');
      }
    });
    return subscriber; // Se désabonner lors du démontage
  }, []);

  const sendVerificationCode = async () => {
    if (!phoneNumber) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide.');
      return;
    }

    try {
      const confirmation = await auth.signInWithPhoneNumber(phoneNumber);
      setVerificationId(confirmation.verificationId);
      Alert.alert('Code envoyé', 'Un code de vérification a été envoyé sur votre téléphone.');
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue.');
      console.error(error);
    }
  };

  const confirmCode = async () => {
    if (!verificationId) {
      Alert.alert('Erreur', 'Aucun code de vérification n\'a été envoyé.');
      return;
    }

    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
      await auth.signInWithCredential(credential);
      // Authentification réussie, l'utilisateur est maintenant connecté
    } catch (error) {
      Alert.alert('Erreur', 'Code de vérification invalide.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Authentification par téléphone</Text>

      {!verificationId ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre numéro de téléphone"
            keyboardType="phone-pad"
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TouchableOpacity style={styles.button} onPress={sendVerificationCode}>
            <Text style={styles.buttonText}>Envoyer le code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Entrez le code de vérification"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text style={styles.buttonText}>Confirmer le code</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Telephone;
