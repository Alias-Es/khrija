import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { firebase } from '../../FirebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import CustomButton from './CustomButton';
import { useNavigation } from '@react-navigation/native';

const GoogleAuthButton = () => {
  const navigation = useNavigation();

  // Utilisation des Client IDs pour chaque plateforme
  const clientId = Platform.select({
    ios: '1002817459666-r4l77rj0rifqsn8tqbb9ngc3u65ikp5v.apps.googleusercontent.com',
  });

  // Schéma personnalisé pour iOS
  const redirectUri = 'monprojetexpo://auth'; // Schéma personnalisé pour iOS

  // Initialisation de la demande d'authentification
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId,
    redirectUri,
  });

  const checkOrCreateUserInFirestore = async (user) => {
    console.log('Début de la vérification ou création utilisateur dans Firestore...');
    const userDocRef = firebase.firestore().collection('users').doc(user.uid);

    try {
      const doc = await userDocRef.get();
      if (!doc.exists) {
        console.log('Utilisateur inexistant, création...');
        await userDocRef.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        console.log('Nouvel utilisateur ajouté dans Firestore.');
      } else {
        console.log('Utilisateur existant trouvé dans Firestore :', doc.data());
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de Firestore :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l’enregistrement.');
    }
  };

  useEffect(() => {
    console.log('Response reçu dans useEffect :', response);

    if (response?.type === 'success') {
      const { id_token } = response.params;

      if (id_token) {
        console.log('ID Token reçu :', id_token);

        const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
        console.log('Tentative de connexion à Firebase avec les credentials...');

        firebase
          .auth()
          .signInWithCredential(credential)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log('Connexion réussie avec Firebase :', user);

            // Vérifie ou crée l'utilisateur dans Firestore
            checkOrCreateUserInFirestore(user).then(() => {
              console.log('Navigation vers "offres"...');
              navigation.navigate('offres');
            });
          })
          .catch((error) => {
            console.error('Erreur lors de la connexion Firebase :', error);
            Alert.alert('Erreur', 'Impossible de se connecter à Firebase.');
          });
      } else {
        console.error('ID Token manquant.');
        Alert.alert('Erreur', 'Impossible d’obtenir un ID Token.');
      }
    } else if (response?.type === 'error') {
      console.error('Erreur dans la réponse Google Auth :', response.error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l’authentification.');
    }
  }, [response]);

  return (
    <CustomButton
      color="#fff"
      icon={require('../../assets/images/google.png')}
      text="Continuer avec Google"
      textColor="#000"
      borderColor="#ccc"
      onPress={() => {
        console.log('Bouton "Continuer avec Google" cliqué');
        promptAsync();
      }}
    />
  );
};

export default GoogleAuthButton;
