import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Fleche from '../../components/fleche';
import SubmitButton from '../../components/boutonSuivant';
import { resendVerificationCode } from './smsService2'; // Import du service SMS
import { OtpInput } from 'react-native-otp-entry';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebase from 'firebase/compat/app';
import { LanguageContext } from '../../LanguageContext'; // Import du contexte de langue

const VerificationCode = ({ route, navigation }) => {
  const { verificationId, phoneNumber } = route.params;
  const recaptchaVerifier = useRef(null); // Initialisation du recaptcha
  const [otpCode, setOtpCode] = useState('');
  const [resendDelay, setResendDelay] = useState(30);
  const [resendAttempts, setResendAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;

  const { translations, language } = useContext(LanguageContext); // Utilisation du contexte de langue
  const t = (key) => translations[language][key]; // Fonction de traduction

  useEffect(() => {
    if (resendDelay > 0) {
      const timer = setInterval(() => setResendDelay((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendDelay]);

  const verifyCode = async (code) => {
    if (code.length !== 6) {
      Alert.alert(t('error'), t('enterFullCode'));
      return;
    }

    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
      const userCredential = await firebase.auth().signInWithCredential(credential);
      const user = userCredential.user;

      // Vérification de la variable isRegistered
      const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();

      if (!userDoc.exists || !userDoc.data().isRegistered) {
        navigation.replace('telephone3');
      } else {
        Alert.alert(t('success'), t('loggedIn'));
        navigation.navigate('offres');
      }
    } catch (error) {
      console.error(t('verificationError'), error);
      Alert.alert(t('error'), `${t('invalidCode')} : ${error.message}`);
    }
  };

  const handleResendCode = async () => {
    if (resendAttempts >= MAX_ATTEMPTS) {
      Alert.alert(
        t('limitReached'),
        t('resendLimitExceeded')
      );
      return;
    }

    try {
      const newVerificationId = await resendVerificationCode(phoneNumber, recaptchaVerifier);

      if (newVerificationId) {
        console.log(t('newVerificationIdReceived'), newVerificationId);
        setResendAttempts((prev) => prev + 1);
        setResendDelay(30);
      }
    } catch (error) {
      console.error(t('resendError'), error);
      Alert.alert(t('error'), t('unableToResend'));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebase.app().options}
        />
        <Fleche />
        <Text style={styles.title}>{t('enterCode')}</Text>
        <Text style={styles.phoneNumber}>
          {phoneNumber}{' '}
          {resendDelay === 0 ? (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resend}>{t('resend')}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timer}>({resendDelay}s)</Text>
          )}
        </Text>
        <OtpInput
          numberOfDigits={6}
          focusColor="pink"
          onTextChange={(text) => setOtpCode(text)}
          theme={{
            containerStyle: styles.otpContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
          }}
        />
        <SubmitButton
          onPress={() => verifyCode(otpCode)}
          disabled={otpCode.length < 6}
        />
        <Text style={styles.footer}>{t('fromMessages')}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 220,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  phoneNumber: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 30,
  },
  resend: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  timer: {
    color: '#555',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  pinCodeContainer: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: 'pink',
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCodeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  focusStick: {
    height: 2,
    backgroundColor: 'black',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginTop: 30,
  },
});

export default VerificationCode;
