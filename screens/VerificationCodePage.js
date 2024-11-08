import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { firebase } from '../FirebaseConfig';
import sendVerificationEmail, { generateCode } from './envoiMail'; // Import des fonctions nécessaires

const VerificationCodePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { formData, verificationCode: initialVerificationCode } = route.params;

  const [enteredCode, setEnteredCode] = useState('');
  const [verificationCode, setVerificationCode] = useState(initialVerificationCode);

  const initializeUserOffers = async (userId) => {
    try {
      const offersSnapshot = await firebase.firestore().collection('offres').get();
      const batch = firebase.firestore().batch();
      const userOffersRef = firebase.firestore().collection('users').doc(userId).collection('offres_etats');

      offersSnapshot.forEach((offerDoc) => {
        const offerId = offerDoc.id;
        batch.set(userOffersRef.doc(offerId), {
          etat: false, // Initialisation de l'état à false
        });
      });

      await batch.commit();
      console.log('États des offres initialisés pour l’utilisateur :', userId);
    } catch (error) {
      console.error('Erreur lors de l’initialisation des états des offres :', error);
    }
  };

  const verifyCodeAndSignUp = async () => {
    console.log('Code saisi :', enteredCode);
    console.log('Code attendu :', verificationCode);

    if (enteredCode === verificationCode) {
      const { email, motDePasse, prenom, nom, age } = formData;
      try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, motDePasse);
        const userId = userCredential.user.uid;

        // Ajouter les informations utilisateur dans Firestore
        await firebase.firestore().collection('users').doc(userId).set({
          prenom,
          nom,
          email,
          age,
          abonnement_actif: false,
          periode: null,
        });

        // Initialiser les états des offres pour cet utilisateur
        await initializeUserOffers(userId);

        Alert.alert('Inscription réussie', 'Votre compte a été créé avec succès.');
        navigation.navigate('offres');
      } catch (error) {
        Alert.alert("Erreur lors de l'inscription", error.message);
      }
    } else {
      Alert.alert('Erreur', 'Le code de vérification est incorrect.');
    }
  };

  const resendCode = async () => {
    try {
      const newCode = generateCode(); // Génère un nouveau code
      setVerificationCode(newCode); // Met à jour l'état local avec le nouveau code

      // Envoi l'email avec le nouveau code
      await sendVerificationEmail(formData.email, formData.prenom, newCode);
      
      Alert.alert('Code envoyé', 'Un nouveau code de vérification a été envoyé à votre email.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du code de vérification :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi du code de vérification.');
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Vérification de l'email</Text>
        <Text style={styles.instructions}>
          Un code de vérification a été envoyé à votre adresse email. Veuillez le saisir ci-dessous pour confirmer votre inscription.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Code de vérification"
          value={enteredCode}
          onChangeText={(value) => setEnteredCode(value)}
          keyboardType="number-pad"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={verifyCodeAndSignUp}>
          <Text style={styles.buttonText}>Vérifier</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton} onPress={resendCode}>
          <Text style={styles.resendButtonText}>Renvoyer le code</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#E91E63',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resendButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resendButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default VerificationCodePage;
