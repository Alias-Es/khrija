import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useNavigation } from '@react-navigation/native';
import Fleche from '../../components/fleche';
import SubmitButton from '../../components/boutonSuivant'; // Import du bouton
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { sendVerificationCode } from './smsService'; // Import de la fonction externe
import { LanguageContext } from '../../LanguageContext'; // Import du contexte de langue
import PhoneInput from 'react-native-phone-number-input'; // Import de la bibliothèque

const PhoneNumberLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false); // État pour la validité
  const phoneInputRef = useRef(null);
  const recaptchaVerifier = useRef(null);
  const navigation = useNavigation(); // Hook pour naviguer
  const { translations, language } = useContext(LanguageContext); // Contexte de langue
  const t = (key) => translations[language][key]; // Fonction pour récupérer les traductions

  // Fonction pour valider et envoyer le numéro de téléphone
  const handleSendCode = () => {
    const checkValid = phoneInputRef.current?.isValidNumber(phoneNumber);
    if (checkValid) {
      const formattedNumber = phoneInputRef.current?.getNumberAfterPossiblyEliminatingZero().formattedNumber;
      sendVerificationCode(formattedNumber, recaptchaVerifier, navigation);
    } else {
      Alert.alert(t('invalidPhoneNumber')); // Utilisation d'Alert pour un meilleur UX
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Fleche />
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebase.app().options}
          attemptInvisibleVerification
          androidHardwareAccelerationDisabled
        />

        {/* Section Titre */}
        <Text style={styles.title}>{t('askForPhoneNumber')}</Text>

        {/* Section Input avec PhoneInput */}
        <View style={styles.inputContainer}>
          <PhoneInput
            ref={phoneInputRef}
            defaultValue={phoneNumber}
            defaultCode="MA" // Code par défaut
            layout="first"
            onChangeText={(text) => {
              setPhoneNumber(text);
            }}
            onChangeFormattedText={(text) => {
              setPhoneNumber(text);
              const valid = phoneInputRef.current?.isValidNumber(text);
              setIsValid(valid);
            }}
            countryPickerProps={{
              countryCodes: ['MA', 'FR'], // Limiter aux pays MA et FR
              withFilter: false,
              withFlag: true,
              withCountryNameButton: true,
              withCallingCode: true,
            }}
            withShadow
            autoFocus
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.textInput}
            textInputProps={{
              placeholderTextColor: '#999',
            }}
            flagButtonStyle={styles.flagButton}
            codeTextStyle={styles.codeText}
            textInputStyle={styles.phoneTextInput}
          />
        </View>

        {/* Description */}
        <Text style={styles.description}>
          {t('verificationCodeMessage')}{' '}
          <Text style={styles.link}>{t('phoneNumberChangeLink')}</Text>
        </Text>

        {/* Bouton Soumettre */}
        <SubmitButton
          onPress={handleSendCode}
          disabled={!isValid} // Désactivé si le numéro n'est pas valide
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 150,
    marginBottom: 40,
    lineHeight: 50, // Augmenté pour plus d'espacement
    flexWrap: 'wrap',
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 29,
  },
  phoneContainer: {
    width: '95%', // Occupant toute la largeur
    height: 60, // Hauteur augmentée
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  textInput: {
    paddingVertical: 0,
    backgroundColor: '#fff',
  },
 
  codeText: {
    fontSize: 16, // Taille de police augmentée
    fontWeight: '600',
  },
  phoneTextInput: {
    fontSize: 16, // Taille de police augmentée
    fontWeight: '600',
    color: '#000',
  },
  description: {
    fontSize: 16, // Taille de police augmentée
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    width: '90%',
    marginLeft: '5%', // Centré horizontalement
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default PhoneNumberLogin;
