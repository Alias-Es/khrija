import React, { useEffect, useContext } from 'react';
import { firebase } from '../../FirebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import CustomButton from './CustomButton';
import { LanguageContext } from '../../LanguageContext'; // Import du contexte de langue

const GoogleAuthButton = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '1002817459666-kco5v7gijrlbrl4bf77non8lg1crlla4.apps.googleusercontent.com',
  });

  const { translations, language } = useContext(LanguageContext); // Utilisation du contexte
  const t = (key) => translations[language][key]; // Fonction pour récupérer les traductions

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
      firebase.auth().signInWithCredential(credential).catch((error) => {
        console.error('Erreur lors de la connexion avec Google :', error);
      });
    }
  }, [response]);

  return (
    <CustomButton
      color="#fff"
      icon={require('../../assets/images/google.png')}
      text={t('continueWithGoogle')} // Texte dynamique pour "Continuer avec Google"
      textColor="#000"
      borderColor="#ccc"
      accessibilityLabel={t('googleButtonAccessibility')} // Texte d'accessibilité traduit
      onPress={() => promptAsync()}
    />
  );
};

export default GoogleAuthButton;
