import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Alert } from 'react-native';

export const sendVerificationCode = async (phoneNumber, recaptchaVerifier, navigation) => {
  if (!phoneNumber || !phoneNumber.startsWith('+')) {
    Alert.alert(
      'Erreur',
      'Veuillez entrer un numéro de téléphone valide au format international (+212...).'
    );
    return;
  }

  try {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    const verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier ? recaptchaVerifier.current : null // Vérifie si le recaptchaVerifier est défini
    );

    Alert.alert('Succès', 'Un code de vérification a été envoyé par SMS.');

    if (navigation) {
      // Naviguer seulement si le paramètre navigation est fourni
      navigation.navigate('telephone2', { verificationId, phoneNumber });
    }

    return verificationId; // Retourne l'ID de vérification pour une utilisation ultérieure
  } catch (error) {
    console.error('Erreur lors de l\'envoi du SMS :', error);
    Alert.alert('Erreur', `Problème lors de l'envoi du SMS : ${error.message}`);
    throw error; // Relance l'erreur pour une gestion personnalisée si nécessaire
  }
};
