import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { auth, firebase } from '../../FirebaseConfig';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();

  const checkRegistrationStatus = async (uid) => {
    try {
      const userDoc = await firebase.firestore().collection('users').doc(uid).get();

      if (!userDoc.exists) {
        await firebase.firestore().collection('users').doc(uid).set({
          isRegistered: false,
        });
        return false;
      }

      const data = userDoc.data();
      return data.isRegistered || false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l’état d’inscription :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la vérification de votre statut.');
      return false;
    }
  };

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

      console.log('UID de l’utilisateur connecté :', user.uid); // Log pour déboguer

      if (appleAuthResponse.fullName) {
        const { givenName, familyName } = appleAuthResponse.fullName;
        if (givenName || familyName) {
          await user.updateProfile({
            displayName: `${givenName || ''} ${familyName || ''}`.trim(),
          });
        }
      }

      const isRegistered = await checkRegistrationStatus(user.uid);

      if (isRegistered) {
        navigation.replace('offres');
      } else {
        navigation.replace('CreeCompteApple1', { userId: user.uid }); // Utilisation uniforme de `userId`
      }
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
        icon={require('../../assets/images/apple.png')}
        text="Se connecter avec Apple"
        textColor="#fff"
        onPress={handleAppleSignIn}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
