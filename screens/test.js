import React, { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { firebase, auth } from '../FirebaseConfig'; // Importez Firebase depuis votre fichier

const GoogleAuthScreen = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '1002817459666-ak9s56f712jraeg59n73g5ha46c45hil.apps.googleusercontent.com',
    iosClientId: '1002817459666-f9onlksrjb55b7ega12ftrtjh3ngbjoq.apps.googleusercontent.com',
    
    
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);

      auth.signInWithCredential(credential)
        .then(() => {
          Alert.alert("Connexion réussie", "Vous êtes connecté avec Google !");
        })
        .catch((error) => {
          Alert.alert("Erreur", error.message);
        });
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Se connecter avec Google"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
};

export default GoogleAuthScreen;
