import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { firebase } from '../FirebaseConfig';

const VerificationCodePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { formData } = route.params; // Données envoyées depuis la page précédente
  const [enteredCode, setEnteredCode] = useState(''); // Code entré par l'utilisateur

  useEffect(() => {
    const initializeVerification = async () => {
      try {
        // Remplacez par l'URL de votre fonction déployée
        const response = await fetch('https://sendverificationemail-zt7utylc6a-uc.a.run.app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            prenom: formData.prenom,
          }),
        });

        if (response.ok) {
          // Nous n'avons plus besoin de récupérer le code de vérification
          Alert.alert('Code envoyé', 'Un code de vérification a été envoyé à votre adresse email.');
        } else {
          const errorText = await response.text();
          console.error("Erreur lors de l'appel de la fonction cloud:", errorText);
          Alert.alert('Erreur', "Une erreur est survenue lors de l'envoi du code de vérification.");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du code de vérification :", error);
        Alert.alert('Erreur', "Une erreur est survenue lors de l'envoi du code de vérification.");
      }
    };

    initializeVerification();
  }, [formData.email, formData.prenom]);

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
      console.error("Erreur lors de l’initialisation des états des offres :", error);
    }
  };

  const verifyCodeAndSignUp = async () => {
    console.log('Code saisi :', enteredCode);

    try {
      // Envoyer le code saisi au serveur pour vérification
      const response = await fetch('https://verifyemailcode-zt7utylc6a-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: enteredCode,
        }),
      });

      if (response.ok) {
        // Le code est vérifié, procéder à l'inscription
        const { email, motDePasse, prenom, nom, age } = formData;
        try {
          // Création de l'utilisateur dans Firebase Authentication
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
          navigation.navigate('offres'); // Naviguer vers la page des offres
        } catch (error) {
          console.error("Erreur lors de l'inscription :", error);
          Alert.alert("Erreur lors de l'inscription", error.message);
        }
      } else {
        const errorText = await response.text();
        Alert.alert('Erreur', errorText);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code :', error);
      Alert.alert('Erreur', "Une erreur est survenue lors de la vérification du code.");
    }
  };

  const resendCode = async () => {
    try {
      // Appel de la fonction cloud pour renvoyer le code
      const response = await fetch('https://sendverificationemail-zt7utylc6a-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          prenom: formData.prenom,
        }),
      });

      if (response.ok) {
        // Nous n'avons plus besoin de récupérer le code de vérification
        Alert.alert('Code envoyé', 'Un nouveau code de vérification a été envoyé à votre adresse email.');
      } else {
        const errorText = await response.text();
        console.error("Erreur lors de l'appel de la fonction cloud:", errorText);
        Alert.alert('Erreur', "Une erreur est survenue lors de l'envoi du code de vérification.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du code de vérification :", error);
      Alert.alert('Erreur', "Une erreur est survenue lors de l'envoi du code de vérification.");
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