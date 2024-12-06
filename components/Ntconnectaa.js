import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet ,Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../FirebaseConfig';
import AppleAuthButton from './connexion/AppleAuthButton';
import GoogleAuthButton from './connexion/GoogleAuthButton';
import CustomButton from './connexion/CustomButton';

firebase.auth().settings.appVerificationDisabledForTesting = true;

const AppleAuthScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        navigation.navigate('offres');
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, [navigation]);

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
              <AppleAuthButton isLoading={isLoading} setIsLoading={setIsLoading} />
            )}
            <GoogleAuthButton />
            <CustomButton
              color="#4A90E2"
              icon={require('../assets/images/telephone.png')}
              text="Continuer avec numéro de téléphone"
              textColor="#fff"
              accessibilityLabel="Bouton pour continuer avec un numéro de téléphone"
              onPress={() => navigation.navigate('telephone')}
            />
          </View>
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
  // Styles restent dans ce fichier
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 55,
    borderRadius: 27,
    marginBottom: 15,
    borderWidth: 1,
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
