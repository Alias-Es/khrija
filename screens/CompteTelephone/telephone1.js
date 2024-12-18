import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useNavigation } from '@react-navigation/native';
import Fleche from '../../components/fleche';
import SubmitButton from '../../components/boutonSuivant'; // Import du bouton
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { sendVerificationCode } from './smsService'; // Import de la fonction externe

const PhoneNumberLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const recaptchaVerifier = useRef(null);
  const navigation = useNavigation(); // Hook pour naviguer

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

        {/* Title Section */}
        <Text style={styles.title}>On peut avoir{'\n'}ton numéro ?</Text>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
        </View>

        {/* Description */}
        <Text style={styles.description}>
          On va t'envoyer un code pour vérifier que c'est vraiment toi.{' '}
          <Text style={styles.link}>
            Que se passe-t-il si tu changes de numéro ?
          </Text>
        </Text>

        {/* Submit Button */}
        <SubmitButton
          onPress={() => sendVerificationCode(phoneNumber, recaptchaVerifier, navigation)}
          disabled={!phoneNumber}
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
    lineHeight: 40,
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    marginBottom: 29,
    width: '80%', 
    marginLeft: 30,
  },
  input: {
    flex: 10,
    fontSize: 16,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    width: '80%',
    marginLeft: 30,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default PhoneNumberLogin;
