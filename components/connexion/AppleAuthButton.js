import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { auth, firebase } from '../../FirebaseConfig';
import { TouchableOpacity, Image } from 'react-native';

// Composant bouton personnalisé
const CustomButton = ({ color, icon, text, textColor, onPress, isLoading }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator color={textColor} />
    ) : (
      <>
        {icon && <Image source={icon} style={styles.buttonIcon} />}
        <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
      </>
    )}
  </TouchableOpacity>
);

const AuthenticationScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);

      const appleAuthResponse = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!appleAuthResponse.identityToken) {
        throw new Error('Aucun token d’identité reçu d’Apple');
      }

      const provider = new firebase.auth.OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: appleAuthResponse.identityToken,
        rawNonce: appleAuthResponse.authorizationCode,
      });

      const userCredential = await auth.signInWithCredential(credential);
      const user = userCredential.user;

      if (appleAuthResponse.fullName) {
        const { givenName, familyName } = appleAuthResponse.fullName;
        if (givenName || familyName) {
          await user.updateProfile({
            displayName: `${givenName || ''} ${familyName || ''}`.trim(),
          });
        }
      }

      Alert.alert('Connexion réussie', `Bienvenue, ${user.displayName || 'Utilisateur'} !`);
    } catch (error) {
      console.error('Erreur lors de la connexion avec Apple :', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
     
      <CustomButton
        color="#000"
        icon={require('../../assets/images/apple.png')} // Remplacez par le chemin de l'icône Apple
        text="Se connecter avec Apple"
        textColor="#fff"
        onPress={handleAppleSignIn}
        isLoading={isLoading}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 55,
    borderRadius: 27,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthenticationScreen;
