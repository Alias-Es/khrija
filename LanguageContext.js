import React, { createContext, useState } from 'react';

const translations = {
  fr: {
    appTitle: "KHRIJA",
    searchPlaceholder: "Rechercher...",
    noOffers: "Aucune offre trouvée.",
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
    // Bouton Apple
    signInWithApple: "Se connecter avec Apple",
    checkStatusError: "Une erreur est survenue lors de la vérification de votre statut.",
    appleSignInError: "Une erreur est survenue lors de la connexion avec Apple.",
    noIdentityTokenError: "Aucun token d’identité reçu d’Apple",
    // Bouton Google
    continueWithGoogle: "Continuer avec Google",
    googleButtonAccessibility: "Bouton pour continuer avec Google",
    // Téléphone 1
    askForPhoneNumber: "On peut avoir\nton numéro ?",
    phoneNumberPlaceholder: "Numéro de téléphone",
    verificationCodeMessage: "On va t'envoyer un code pour vérifier que c'est vraiment toi.",
    phoneNumberChangeLink: "Que se passe-t-il si tu changes de numéro ?",
    // Téléphone 2
    enterCode: "Saisissez votre code",
    resend: "Renvoyer",
    fromMessages: "Vient de Messages",
    success: "Succès",
    error: "Erreur",
    enterFullCode: "Veuillez entrer un code complet.",
    loggedIn: "Vous êtes connecté !",
    verificationError: "Erreur lors de la vérification",
    invalidCode: "Code incorrect ou expiré",
    limitReached: "Limite atteinte",
    resendLimitExceeded: "Vous avez atteint la limite de tentatives de renvoi de code.",
    resendError: "Erreur lors du renvoi du code",
    unableToResend: "Impossible de renvoyer le code. Veuillez réessayer.",
    newVerificationIdReceived: "Nouveau verificationId reçu",
    // Téléphone 3
    yourInformation: "Vos informations",
    tellUsMore: "Nous aimerions en savoir plus sur vous.",
    enterFirstName: "Entrez votre prénom",
    enterLastName: "Entrez votre nom",
    next: "Suivant",
    enterFirstNameAndLastName: "Veuillez entrer à la fois votre prénom et votre nom avant de continuer.",
    // Téléphone 4
    appName: "KHRIJA",
    hello: "Bonjour",
    completeProfile: "finalisez votre profil :",
    age: "Âge",
    years: "ans",
    sex: "Sexe",
    status: "Statut",
    selectAge: "Sélectionnez votre âge",
    selectSex: "Sélectionnez votre sexe",
    selectStatus: "Sélectionnez votre statut",
    createProfile: "Créer mon profil",
    // Authentification et Profil
    notAuthenticated: "Utilisateur non authentifié. Veuillez vous reconnecter.",
    incompleteForm: "Formulaire incomplet",
    missingUserId: "Identifiant utilisateur manquant",
    missingAge: "Âge non sélectionné",
    missingSex: "Sexe non sélectionné",
    missingStatus: "Statut non sélectionné",
    registrationSuccess: "Inscription réussie",
    profileUpdated: "Votre profil a été mis à jour.",
    errorOccurred: "Une erreur est survenue",
    user: "Utilisateur",
    // Compte Apple 1
    createYourAccount: "Créer votre compte",
    enterYourInfo: "Bienvenue, veuillez entrer vos informations pour continuer.",
    enterNameAndFirstName: "Veuillez entrer votre nom et prénom pour continuer.",
    continue: "Continuer",
    // Compte Apple 2 (Identique à la Téléphone 4, donc doublon supprimé)
    // Compte
    annualSubscription: "ABONNEMENT ANNUEL",
    perYear: "par an",
    valid12Months: "Valable 12 mois.",
    noAutoRenewal: "Pas de renouvellement automatique.",
    monthlySubscription: "ABONNEMENT MENSUEL",
    perMonth: "par mois",
    noCommitment: "Sans engagement.",
    autoRenewal: "Renouvellement automatique.",
    confirmation: "Confirmation",
    selectedSubscription: "Vous avez sélectionné l'abonnement {subscription}.",
    // Gestion des abonnements
    logoutError: "La déconnexion a échoué. Veuillez réessayer.",
    selectSubscriptionError: "Veuillez sélectionner un abonnement.",
    couponsAndOffers: "Coupons et Offres",
    mySubscription: "Mon abonnement",
    faq: "FAQ",
    logout: "Déconnexion",
    // Détails des Offres
    discoveryOffer: "🎟️ Offre Découverte",
    permanentOffer: "♾️ Offre Permanente",
    oneTime: "Ponctuelle",
    permanent: "Permanente",
    offerForSubscribers: "Offre réservée aux abonnés",
    offerAlreadyUsed: "Offre déjà utilisée",
    showMyOffer: "Afficher mon offre",
    myCard: "Ma Carte",
    updateOfferError: "Erreur lors de la mise à jour de l'offre.",
    loadingOfferError: "Erreur lors du chargement de l'offre.",
    // Karta
    defaultLastName: "Nom de famille",
    defaultFirstName: "Prénom",
    unknownAge: "Âge inconnu",
    defaultEmail: "exemple@email.com",
    fetchUserError: "Erreur lors de la récupération des informations de l'utilisateur",
    myCardTitle: "Ma Carte Khrija !!",
    expiryDate: "Expire le",
    subscribePrompt: "Envie de profiter des offres ?\nAbonne-toi dès maintenant et deviens membre KHRIJA.",
    subscribeButtonText: "M'ABONNER",
    editInfoButtonText: "Modifier mes informations",
    //modalvalidation
    
      offerValidationTitle: "Valider l'offre",
      offerValidationMessage: "Êtes-vous sûr de vouloir valider cette offre ? Cette action ne peut pas être annulée.",
      validateOfferButton: "Valider l'offre",
    //modaleDeconnexion
    logoutConfirmationTitle: "Déconnexion",
  logoutConfirmationMessage: "Êtes-vous sûr de vouloir vous déconnecter ?",
  cancel: "Annuler",
  confirm: "Confirmer",
    
  },
  en: {
    //modaleDeconnexion 
    
      logoutConfirmationTitle: "Logout",
      logoutConfirmationMessage: "Are you sure you want to log out?",
      cancel: "Cancel",
      confirm: "Confirm",
    
    
    //modalvalidation 
    
      offerValidationTitle: "Validate Offer",
      offerValidationMessage: "Are you sure you want to validate this offer? This action cannot be undone.",
      validateOfferButton: "Validate Offer",
    
    
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
    // Bouton Apple
    signInWithApple: "Sign in with Apple",
    checkStatusError: "An error occurred while checking your registration status.",
    appleSignInError: "An error occurred while signing in with Apple.",
    noIdentityTokenError: "No identity token received from Apple",
    // Bouton Google
    continueWithGoogle: "Continue with Google",
    googleButtonAccessibility: "Button to continue with Google",
    // Téléphone 1
    askForPhoneNumber: "Can we have\nyour number?",
    phoneNumberPlaceholder: "Phone number",
    verificationCodeMessage: "We’ll send you a code to verify it’s really you.",
    phoneNumberChangeLink: "What happens if you change your number?",
    // Téléphone 2
    enterCode: "Enter your code",
    resend: "Resend",
    fromMessages: "From Messages",
    success: "Success",
    enterFullCode: "Please enter a complete code.",
    loggedIn: "You are logged in!",
    verificationError: "Verification error",
    invalidCode: "Invalid or expired code",
    limitReached: "Limit reached",
    resendLimitExceeded: "You have reached the limit for resending codes.",
    resendError: "Error resending the code",
    unableToResend: "Unable to resend the code. Please try again.",
    newVerificationIdReceived: "New verificationId received",
    // Téléphone 3
    yourInformation: "Your Information",
    tellUsMore: "We would like to know more about you.",
    enterFirstName: "Enter your first name",
    enterLastName: "Enter your last name",
    next: "Next",
    enterFirstNameAndLastName: "Please enter both your first name and last name before proceeding.",
    // Téléphone 4
    appName: "KHRIJA",
    hello: "Hello",
    completeProfile: "complete your profile:",
    age: "Age",
    years: "years",
    sex: "Sex",
    status: "Status",
    selectAge: "Select your age",
    selectSex: "Select your gender",
    selectStatus: "Select your status",
    createProfile: "Create my profile",
    // Authentification et Profil
    notAuthenticated: "User not authenticated. Please log in again.",
    incompleteForm: "Incomplete form",
    missingUserId: "User ID missing",
    missingAge: "Age not selected",
    missingSex: "Gender not selected",
    missingStatus: "Status not selected",
    registrationSuccess: "Registration successful",
    profileUpdated: "Your profile has been updated.",
    errorOccurred: "An error occurred",
    user: "User",
    // Compte Apple 1
    createYourAccount: "Create Your Account",
    enterYourInfo: "Enter your information to continue.",
    enterNameAndFirstName: "Please enter your last name and first name to proceed.",
    continue: "Continue",
    // Compte Apple 2 (Identique à la Téléphone 4, donc doublon supprimé)
    // Compte
    annualSubscription: "ANNUAL SUBSCRIPTION",
    perYear: "per year",
    valid12Months: "Valid for 12 months.",
    noAutoRenewal: "No auto-renewal.",
    monthlySubscription: "MONTHLY SUBSCRIPTION",
    perMonth: "per month",
    noCommitment: "No commitment.",
    autoRenewal: "Auto-renewal.",
    confirmation: "Confirmation",
    selectedSubscription: "You have selected the {subscription} subscription.",
    // Gestion des abonnements
    logoutError: "Logout failed. Please try again.",
    selectSubscriptionError: "Please select a subscription.",
    couponsAndOffers: "Coupons and Offers",
    mySubscription: "My Subscription",
    faq: "FAQ",
    logout: "Logout",
    // Détails des Offres
    discoveryOffer: "🎟️ Discovery Offer",
    permanentOffer: "♾️ Permanent Offer",
    oneTime: "One-Time",
    permanent: "Permanent",
    offerForSubscribers: "Offer reserved for subscribers",
    offerAlreadyUsed: "Offer already used",
    showMyOffer: "Show my offer",
    myCard: "My Card",
    updateOfferError: "Error updating the offer state.",
    loadingOfferError: "Error loading the offer.",
    // Karta
    defaultLastName: "Last Name",
    defaultFirstName: "First Name",
    unknownAge: "Unknown Age",
    defaultEmail: "example@email.com",
    fetchUserError: "Error while fetching user information",
    myCardTitle: "My Khrija Card !!",
    expiryDate: "Expires on",
    subscribePrompt: "Want to enjoy offers?\nSubscribe now and become a KHRIJA member.",
    subscribeButtonText: "SUBSCRIBE",
     editInfoButtonText: "Edit My Information",
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
