// screens/DetailleOffres.js

import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Linking,
  Image, // Import de Image pour les icônes de cadenas
} from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useOfferData } from '../hooks/useOfferData';
import { useUserData } from '../hooks/useUserData';
import InitialSubscriptionModal from '../components/InitialSubscriptionModal';
import OfferValidationModal from '../components/OfferValidationModal';
import UserCardModal from '../components/UserCardModal';
import Header from '../components/Header';
import OfferSection from '../components/OfferSection';
import OfferButton from '../components/OfferButton';
import CustomSwipeButton from '../components/CustomSwipeButton';
import SubscriptionButton from '../components/SubscriptionButton';
import OfferUsedAnimationModal from '../components/OfferUsedAnimationModal';
import { LanguageContext } from '../LanguageContext';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; // Import de MaterialIcons et FontAwesome

const DetailleOffres = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const { offer, loading: offerLoading } = useOfferData(id);
  const { language, translations } = useContext(LanguageContext);
  const t = (key) => translations[language][key];

  const user = firebase.auth().currentUser;

  // Suppression des valeurs par défaut pour détecter le chargement
  const {
    userData,
    userOfferState,
    initialModalVisible,
    setInitialModalVisible,
    setUserOfferState,
    loading: userDataLoading, // Supposons que useUserData fournit un indicateur de chargement
  } = user ? useUserData(id) : {};

  const [offerDialogVisible, setOfferDialogVisible] = useState(false);
  const [userCardVisible, setUserCardVisible] = useState(false);
  const [showSwipeButton, setShowSwipeButton] = useState(false);
  const [animationVisible, setAnimationVisible] = useState(false); // Nouvel état pour l'animation

  // Animation pour le bouton "M'abonner"
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const shakeSubscriptionButton = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubscribe = () => {
    setInitialModalVisible(false);
    navigation.navigate('ntabonna');
  };

  const handleValidateOffer = () => {
    setOfferDialogVisible(false);
    setShowSwipeButton(true);
  };

  const handleSwipeSuccess = async () => {
    try {
      if (user) {
        await firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .collection('offres_etats')
          .doc(id)
          .set({ etat: false }, { merge: true });

        setUserOfferState((prevState) => ({ ...prevState, etat: false }));
        setShowSwipeButton(false);
        
        // Assurez-vous que l'animation est d'abord fermée
        setAnimationVisible(false);
        // Petit délai avant de rouvrir
        setTimeout(() => {
          setAnimationVisible(true);
        }, 100);
      }
    } catch (error) {
      console.error(t('updateOfferError'), error);
    }
  };

  // Utilisation de useEffect pour gérer la visibilité du modal
  useEffect(() => {
    if (userOfferState?.etat === true) {
      setInitialModalVisible(false);
    }
  }, [userOfferState?.etat, setInitialModalVisible]);

  // Gestion de l'état de chargement
  if (offerLoading || (user && userDataLoading)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('loadingOfferError')}</Text>
      </View>
    );
  }

  // Vérifiez si userOfferState est disponible
  if (user && !userOfferState) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  // Variables pour les contenus conditionnels basés sur la langue
  const categoryText = language === 'en' ? offer.categorieEN : offer.categorie;
  const descriptionText = language === 'en' ? offer.descriptionEN : offer.description;
  const discoveryOfferText = language === 'en' ? offer.offresDecouverteEN : offer.offreDecouverte;
  const permanentOfferText = language === 'en' ? offer.offrePermananteEN : offer.offrePermanente;

  // Condition pour déterminer si l'offre découverte doit être affichée
  const shouldShowDiscoveryOffer = !(userData?.abonnement_actif && !userOfferState?.etat);

  // Fonction pour ouvrir les liens externes
  const openLink = async (url) => {
    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error(`Impossible d'ouvrir l'URL: ${url}`);
        // Optionnel : Afficher une alerte à l'utilisateur
        // Alert.alert('Erreur', 'Impossible d\'ouvrir le lien fourni.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Ne pas afficher InitialSubscriptionModal si etat est true */}
      {user && userOfferState?.etat === false && initialModalVisible && (
        <InitialSubscriptionModal
          visible={initialModalVisible}
          onClose={() => setInitialModalVisible(false)}
        />
      )}

      <OfferValidationModal
        visible={offerDialogVisible}
        onClose={() => setOfferDialogVisible(false)}
        onValidateOffer={handleValidateOffer}
      />

      {userData?.abonnement_actif && (
        <UserCardModal
          visible={userCardVisible}
          onClose={() => setUserCardVisible(false)}
          userData={userData}
        />
      )}

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Header
          coverImageUri={offer.couverture}
          onBackPress={() => navigation.navigate('offres')}
        />

        <View style={styles.content}>
          <Text style={styles.categoryText}>{categoryText}</Text>
          
          {/* Conteneur pour le nom et les icônes sociales */}
          <View style={styles.nameAndSocialContainer}>
            <Text style={styles.title}>{offer.nom}</Text>
            <View style={styles.socialIconsContainer}>
              {offer.facebook && (
                <TouchableOpacity
                  onPress={() => openLink(offer.facebook)}
                  style={styles.socialIconButton}
                >
                  <FontAwesome name="facebook-square" size={24} color="#E91E63" />
                </TouchableOpacity>
              )}
              {offer.instagram && (
                <TouchableOpacity
                  onPress={() => openLink(offer.instagram)}
                  style={styles.socialIconButton}
                >
                  <FontAwesome name="instagram" size={24} color="#E91E63" />
                </TouchableOpacity>
              )}
              {offer.site && (
                <TouchableOpacity
                  onPress={() => openLink(offer.site)}
                  style={styles.socialIconButton}
                >
                  <MaterialIcons name="public" size={24} color="#E91E63" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Ajout du champ adresse avec icône de localisation */}
          {offer.adresse && (
            <View style={styles.addressContainer}>
              <MaterialIcons
                name="location-on"
                size={20}
                color="#000000" // Couleur noire
                style={styles.locationIcon}
              />
              <Text style={styles.addressText}>{offer.adresse}</Text>
            </View>
          )}

          {/* Ajout des icônes Facebook, Instagram et Site Web dans une autre ligne si nécessaire */}
          {/* Vous avez demandé de les mettre à droite de la ligne du nom, donc ils sont déjà inclus ci-dessus */}

          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={3}>
              {descriptionText}
            </Text>
          </View>

          {shouldShowDiscoveryOffer && (
            <OfferSection
              title={t('discoveryOffer')}
              offerText={discoveryOfferText}
              isActive={userData?.abonnement_actif}
              styleType="Ponctuelle" // Valeur fixe
            />
          )}

          <View style={styles.buttonContainer}>
            {!userData?.isRegistered ? (
              <OfferButton
                text={
                  <View style={styles.buttonContent}>
                    <Image
                      source={require('../assets/images/cadenas.png')} // Remplacer par votre icône de cadenas
                      style={styles.icon}
                    />
                    <Text style={styles.cardText}>{t('offerForSubscribers')}</Text>
                  </View>
                }
                buttonType={1}
                isDisabled={true}
                onPress={shakeSubscriptionButton}
              />
            ) : !userData?.abonnement_actif && !userOfferState?.etat ? (
              <OfferButton
                text={
                  <View style={styles.buttonContent}>
                    <Image
                      source={require('../assets/images/cadenas.png')} // Remplacer par votre icône de cadenas
                      style={styles.icon}
                    />
                    <Text style={styles.cardText}>{t('offerForSubscribers')}</Text>
                  </View>
                }
                buttonType={1}
                isDisabled={true}
                onPress={shakeSubscriptionButton}
              />
            ) : userData?.abonnement_actif && !userOfferState?.etat ? (
              // Cas spécifique où l'abonnement est actif et l'état de l'offre est false
              // Ne rien afficher (aucun bouton)
              null
            ) : !userOfferState?.etat ? (
              <OfferButton
                text={t('offerAlreadyUsed')}
                buttonType={1}
                isDisabled
                onPress={shakeSubscriptionButton}
              />
            ) : !showSwipeButton ? (
              <OfferButton
                onPress={() => setOfferDialogVisible(true)}
                text={t('showMyOffer')}
                buttonType={1}
                isDisabled={false}
              />
            ) : (
              <CustomSwipeButton onSwipeComplete={handleSwipeSuccess} />
            )}
          </View>

          <OfferSection
            title={t('permanentOffer')}
            offerText={permanentOfferText}
            isActive={userData?.abonnement_actif}
            styleType="Permanente" // Valeur fixe
          />

          <OfferButton
            onPress={() => {
              if (userData?.abonnement_actif) {
                setUserCardVisible(true);
              } else {
                shakeSubscriptionButton();
              }
            }}
            text={
              <View style={styles.buttonContent}>
                {!userData?.abonnement_actif && (
                  <Image
                    source={require('../assets/images/cadenas.png')} // Remplacer par votre icône de cadenas
                    style={styles.icon}
                  />
                )}
                <Text style={styles.cardText}>{t('myCard')}</Text>
              </View>
            }
            buttonType={2}
            isDisabled={!userData?.abonnement_actif}
          />
        </View>
      </ScrollView>

      {/* Modal d'animation de confirmation */}
      <OfferUsedAnimationModal
        visible={animationVisible}
        onClose={() => setAnimationVisible(false)}
        offerName={offer.offreDecouverte} // Utilisez 'offreDecouverte' comme demandé
        establishmentName={offer.nom} // Assurez-vous que 'etablissement' existe dans vos données Firebase
      />

      {!userData?.abonnement_actif && (
        <Animated.View
          style={[
            styles.animatedButtonContainer,
            {
              transform: [
                {
                  translateX: shakeAnimation,
                },
              ],
            },
          ]}
        >
          <SubscriptionButton onPress={handleSubscribe} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  descriptionContainer: {
    maxHeight: 120,
    overflow: 'hidden',
    marginBottom: 20,
  },
  categoryText: {
    color: '#A9A9A9',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  // Conteneur pour le nom et les icônes sociales
  nameAndSocialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Permet au nom de prendre tout l'espace disponible à gauche
    marginRight: 10, // Espacement entre le nom et les icônes
  },
  // Styles ajoutés pour l'adresse
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationIcon: {
    marginRight: 8,
  },
  addressText: {
    fontSize: 16,
    color: '#555',
  },
  // Styles pour les icônes sociales
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  socialIconButton: {
    marginLeft: 10,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 20,
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  animatedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -75 }],
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 23, // Ajustez la taille en fonction de votre image de cadenas
    height: 23, // Ajustez la taille en fonction de votre image de cadenas
    marginRight: 9,
    marginBottom: 4,
    resizeMode: 'contain', // Assure que l'image est bien ajustée
  },
});

export default DetailleOffres;
