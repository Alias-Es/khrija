import React, { createContext, useState } from 'react';

const translations = {
  fr: {
    appTitle: "KHRIJA",
    searchPlaceholder: "Rechercher...",
    noOffers: "Aucune offre trouvée.",
    appTitle: "KHRIJA",
  highlightText: "Découvrez, Économisez, Profitez :",
  descriptionStart: "Accédez à des ",
  exclusiveOffers: "offres exclusives",
  descriptionMiddle: " et ",
  uniqueAdvantages: "avantages uniques",
  descriptionEnd: ". Faites de chaque sortie une expérience mémorable, tout en ",
  savingMoney: "économisant de l'argent",
  continueWithPhone: "Continuer avec numéro de téléphone",
  phoneButtonAccessibility: "Bouton pour continuer avec un numéro de téléphone",
  loadingText: "Chargement...",
  footerStart: "En continuant, vous acceptez nos ",
  termsOfUse: "Conditions d'utilisation",
  footerMiddle: " et notre ",
  privacyPolicy: "Politique de confidentialité",
  errorTitle: "Erreur",
  errorMessage: "Une erreur est survenue lors de la vérification de votre statut.",
  //bouton apple
  signInWithApple: "Se connecter avec Apple",
  error: "Erreur",
  checkStatusError: "Une erreur est survenue lors de la vérification de votre statut.",
  appleSignInError: "Une erreur est survenue lors de la connexion avec Apple.",
  noIdentityTokenError: "Aucun token d’identité reçu d’Apple",
 //bouton google
 continueWithGoogle: "Continuer avec Google",
 googleButtonAccessibility: "Bouton pour continuer avec Google",


  },
  en: {
    
    searchPlaceholder: "Search...",
    noOffers: "No offers found.",
    appTitle: "KHRIJA",
  highlightText: "Discover, Save, Enjoy:",
  descriptionStart: "Access ",
  exclusiveOffers: "exclusive offers",
  descriptionMiddle: " and ",
  uniqueAdvantages: "unique advantages",
  descriptionEnd: ". Make every outing a memorable experience while ",
  savingMoney: "saving money",
  continueWithPhone: "Continue with phone number",
  phoneButtonAccessibility: "Button to continue with a phone number",
  loadingText: "Loading...",
  footerStart: "By continuing, you agree to our ",
  termsOfUse: "Terms of Use",
  footerMiddle: " and our ",
  privacyPolicy: "Privacy Policy",
  errorTitle: "Error",
  errorMessage: "An error occurred while verifying your status.",
  //boutton apple
  signInWithApple: "Sign in with Apple",
  error: "Error",
  checkStatusError: "An error occurred while checking your registration status.",
  appleSignInError: "An error occurred while signing in with Apple.",
  noIdentityTokenError: "No identity token received from Apple",
  //boutton google
  continueWithGoogle: "Continue with Google",
  googleButtonAccessibility: "Button to continue with Google",
 


  },
};

const defaultLanguage = "fr";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(defaultLanguage);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
