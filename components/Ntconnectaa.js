import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from '../FirebaseConfig';
import AppleAuthButton from './connexion/AppleAuthButton';
import GoogleAuthButton from './connexion/GoogleAuthButton';
import CustomButton from './connexion/CustomButton';
import { LanguageContext } from '../LanguageContext';
import * as WebBrowser from 'expo-web-browser';

// Nécessaire pour gérer les sessions OAuth
WebBrowser.maybeCompleteAuthSession();

const AppleAuthScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const { language, translations } = useContext(LanguageContext);
  const t = (key) => translations[language][key];

  const checkRegistrationStatus = async (uid) => {
    console.log('Vérification de l’enregistrement pour UID :', uid);
    try {
      const userDoc = await firebase.firestore().collection('users').doc(uid).get();

      if (!userDoc.exists) {
        console.log('Utilisateur non enregistré, création du champ...');
        await firebase.firestore().collection('users').doc(uid).set({
          isRegistered: false,
        });
        return false;
      }

      const data = userDoc.data();
      console.log('Statut d’enregistrement trouvé :', data.isRegistered);
      return data.isRegistered || false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l’enregistrement :', error);
      Alert.alert(t('errorTitle'), t('Vous avez rencontré une erreur'));
      return false;
    }
  };

  const handleNavigation = async (uid) => {
    console.log('Redirection basée sur l’état d’enregistrement...');
    const isRegistered = await checkRegistrationStatus(uid);

    if (isRegistered) {
      console.log('Utilisateur enregistré, redirection vers "offres".');
      navigation.navigate('offres');
    } else {
      console.log('Utilisateur non enregistré, redirection vers "CreeCompteApple1".');
      navigation.navigate('CreeCompteApple1', { userId: uid });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/fond-rabat.jpg')} style={styles.background} />
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.logo}>{t('appTitle')}</Text>
          <Text style={styles.description}>
            <Text style={styles.descriptionHighlight}>{t('highlightText')}</Text>
            {'\n'}
            {t('descriptionStart')}
            <Text style={styles.descriptionEmphasis}>{t('exclusiveOffers')}</Text>
            {t('descriptionMiddle')}
            <Text style={styles.descriptionEmphasis}>{t('uniqueAdvantages')}</Text>
            {t('descriptionEnd')}
            <Text style={styles.descriptionEmphasis}>{t('savingMoney')}</Text>.
          </Text>
          <View style={styles.buttonsContainer}>
            {Platform.OS === 'ios' && (
              <AppleAuthButton
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onAuthSuccess={handleNavigation}
              />
            )}
            <View style={{ marginTop: 30 }}>
              <GoogleAuthButton
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onAuthSuccess={handleNavigation}
              />
            </View>
            <CustomButton
              color="#4A90E2"
              icon={require('../assets/images/telephone.png')}
              text={t('continueWithPhone')}
              textColor="#fff"
              accessibilityLabel={t('phoneButtonAccessibility')}
              onPress={() => navigation.navigate('telephone1')}
            />
          </View>
          {isLoading && <Text style={styles.loadingText}>{t('loadingText')}</Text>}
          <Text style={styles.footerText}>
  {t('footerStart')}
  <Text
    style={styles.link}
    onPress={() => navigation.navigate('conditionsUtilisation')}
  >
    {t('termsOfUse')}
  </Text>
  {t('footerMiddle')}
  <Text
    style={styles.link}
    onPress={() => navigation.navigate('politiqueConfidentialite')}
  >
    {t('privacyPolicy')}
  </Text>
  .
</Text>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 90,
    color: '#FF4081',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 18,
    color: '#333',
    lineHeight: 25,
    marginVertical: 20,
  },
  descriptionHighlight: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF4081',
  },
  descriptionEmphasis: {
    fontWeight: '600',
    color: '#4A90E2',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 30,
    marginBottom: 0,
    gap: 15,
    marginTop: 150,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#FF4081',
    textAlign: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    marginTop: 20,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default AppleAuthScreen;
