import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { auth, firebase } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../../LanguageContext'; // Import du contexte de langue

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
  const { language, translations } = useContext(LanguageContext); // Utilisation du contexte de langue
  const t = (key) => translations[language][key]; // Fonction pour récupérer les traductions

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
      console.error(t('checkStatusError'), error);
      Alert.alert(t('error'), t('checkStatusError'));
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
        throw new Error(t('noIdentityTokenError'));
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

      const isRegistered = await checkRegistrationStatus(user.uid);

      if (isRegistered) {
        navigation.navigate('offres');
      } else {
        navigation.replace('CreeCompteApple1', { userId: user.uid });
      }
    } catch (error) {
      console.error(t('appleSignInError'), error);
      Alert.alert(t('error'), error.message || t('appleSignInError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomButton
        color="#000"
        icon={require('../../assets/images/apple.png')}
        text={t('signInWithApple')}
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
    borderWidth: 1,
    borderColor: 'transparent',
    marginTop: 10,
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
