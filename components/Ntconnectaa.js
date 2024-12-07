import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as firebase from '../FirebaseConfig'; // Importer correctement Firebase
import AppleAuthButton from './connexion/AppleAuthButton';
import GoogleAuthButton from './connexion/GoogleAuthButton';
import CustomButton from './connexion/CustomButton';

const AppleAuthScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur est enregistré
  const checkRegistrationStatus = async (uid) => {
    try {
      const userDoc = await firebase.firestore().collection('users').doc(uid).get();

      if (!userDoc.exists) {
        // Si l'utilisateur n'a pas de document Firestore, créez-en un
        await firebase.firestore().collection('users').doc(uid).set({
          isRegistered: false, // Non inscrit par défaut
        });
        return false;
      }

      const data = userDoc.data();
      return data.isRegistered || false; // Retourne le statut d'enregistrement
    } catch (error) {
      console.error('Erreur lors de la vérification de l’enregistrement :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la vérification de votre statut.');
      return false;
    }
  };

  // Gérer la redirection après vérification
  const handleNavigation = async (uid) => {
    const isRegistered = await checkRegistrationStatus(uid);

    if (isRegistered) {
      navigation.replace('Offres'); // Rediriger vers l'application si enregistré
    } else {
      navigation.replace('CreeCompteApple1', { userId: uid });
      // Rediriger vers l'inscription
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/fond-rabat.jpg')} style={styles.background} />
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.logo}>KHRIJA</Text>
          <Text style={styles.description}>
            <Text style={styles.descriptionHighlight}>Découvrez, Économisez, Profitez :</Text>
            {'\n'}Accédez à des{' '}
            <Text style={styles.descriptionEmphasis}>offres exclusives</Text> et{' '}
            <Text style={styles.descriptionEmphasis}>avantages uniques</Text>. Faites de chaque
            sortie une expérience mémorable, tout en{' '}
            <Text style={styles.descriptionEmphasis}>économisant de l'argent</Text>.
          </Text>
          <View style={styles.buttonsContainer}>
            {Platform.OS === 'ios' && (
              <AppleAuthButton
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onAuthSuccess={handleNavigation} // Passer la fonction de gestion ici
              />
            )}
            <GoogleAuthButton
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onAuthSuccess={handleNavigation} // Passer la fonction de gestion ici
            />
            <CustomButton
              color="#4A90E2"
              icon={require('../assets/images/telephone.png')}
              text="Continuer avec numéro de téléphone"
              textColor="#fff"
              accessibilityLabel="Bouton pour continuer avec un numéro de téléphone"
              onPress={() => navigation.navigate('telephone')}
            />
          </View>
          {isLoading && <Text style={styles.loadingText}>Chargement...</Text>}
          <Text style={styles.footerText}>
            En continuant, vous acceptez nos{' '}
            <Text style={styles.link}>Conditions d'utilisation</Text> et notre{' '}
            <Text style={styles.link}>Politique de confidentialité</Text>.
          </Text>
        </ScrollView>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 90,
    color: '#FF4081',
    fontWeight: 'bold',
    marginBottom: 100,
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
    marginTop: 150,
    marginBottom: 0,
  },
  loadingText: {
    marginTop: 20,
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
