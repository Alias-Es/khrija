import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const resendVerificationCode = async (phoneNumber, recaptchaVerifier) => {
  if (!phoneNumber || !phoneNumber.startsWith('+')) {
    throw new Error('Numéro de téléphone invalide.');
  }

  try {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    const newVerificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier.current
    );
    console.log('SMS envoyé, nouvel ID :', newVerificationId);
    return newVerificationId;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du SMS :', error);
    throw error;
  }
};
