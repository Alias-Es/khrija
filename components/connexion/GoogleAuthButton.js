import React, { useEffect } from 'react';
import { firebase } from '../../FirebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import CustomButton from './CustomButton';

const GoogleAuthButton = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '1002817459666-kco5v7gijrlbrl4bf77non8lg1crlla4.apps.googleusercontent.com',
  });

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
      text="Continuer avec Google"
      textColor="#000"
      borderColor="#ccc"
      accessibilityLabel="Bouton pour continuer avec Google"
      onPress={() => promptAsync()}
    />
  );
};

export default GoogleAuthButton;
