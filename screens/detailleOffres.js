// screens/DetailleOffres.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { firebase } from '../FirebaseConfig';
import * as Haptics from 'expo-haptics';

// Importation des composants personnalisés
import InitialSubscriptionModal from '../components/InitialSubscriptionModal';
import OfferValidationModal from '../components/OfferValidationModal';
import UserCardModal from '../components/UserCardModal';
import SubscriptionButton from '../components/SubscriptionButton';
import Header from '../components/Header';
import OfferSection from '../components/OfferSection';
import OfferButton from '../components/OfferButton';

const DetailleOffres = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [offre, setOffre] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userOfferState, setUserOfferState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialModalVisible, setInitialModalVisible] = useState(false);
  const [offerDialogVisible, setOfferDialogVisible] = useState(false);
  const [userCardVisible, setUserCardVisible] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchOffre = async () => {
      try {
        const doc = await firebase
          .firestore()
          .collection('offres')
          .doc(id)
          .get();
        if (doc.exists) {
          setOffre(doc.data());
        }
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'offre:", error);
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDoc = await firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setUserData(data);
            setInitialModalVisible(!data.abonnement_actif);

            // Récupérer l'état de l'offre pour cet utilisateur
            const userOfferDoc = await firebase
              .firestore()
              .collection('users')
              .doc(user.uid)
              .collection('offres_etats')
              .doc(id)
              .get();

            if (userOfferDoc.exists) {
              setUserOfferState(userOfferDoc.data());
            } else {
              setUserOfferState({ etat: false }); // Par défaut
            }
          }
        }
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données utilisateur:',
          error
        );
      }
    };

    fetchOffre();
    fetchUserData();
  }, [id]);

  const handleSubscribe = () => {
    setInitialModalVisible(false);
    navigation.navigate('ntabonna');
  };

  const handleValidateOffer = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        await firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .collection('offres_etats')
          .doc(id)
          .update({ etat: false });

        setUserOfferState((prev) => ({ ...prev, etat: false }));
        setOfferDialogVisible(false);
        console.log(
          "L'offre a été validée et son état est maintenant false pour cet utilisateur."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état de l'offre:", error);
    }
  };

  const shakeButton = () => {
    // Déclencher le retour haptique avec expo-haptics
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Animation de secousse
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleOutsideClick = (event) => {
    shakeButton();
  };

  const animatedStyle = {
    transform: [
      {
        translateX: shakeAnimation.interpolate({
          inputRange: [-1, 1],
          outputRange: [-5, 5],
        }),
      },
    ],
  };

  const renderOfferButtonText = () => {
    if (!userData?.abonnement_actif) {
      return 'Ma3ndkch abonnement ?';
    }
    return userOfferState?.etat ? 'Montrer mon offre' : 'Offre déjà utilisée';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  if (!offre) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Erreur lors du chargement de l'offre.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onTouchStart={handleOutsideClick}>
      <InitialSubscriptionModal
        visible={initialModalVisible}
        onClose={() => setInitialModalVisible(false)}
        onSubscribe={handleSubscribe}
      />

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

      <ScrollView style={styles.scrollContainer}>
        <Header
          coverImageUri={offre.couverture}
          onBackPress={() => navigation.navigate('offres')}
        />

        <View style={styles.content}>
          <Text style={styles.categoryText}>{offre.categorie}</Text>
          <Text style={styles.title}>{offre.nom}</Text>
          <Text style={styles.description}>{offre.description}</Text>

          <OfferSection
            title="🎟️ Offre Découverte"
            offerText={offre.offreDecouverte}
            isActive={userData?.abonnement_actif}
            styleType="Ponctuelle"
          />

          <OfferButton
            onPress={() =>
              userOfferState?.etat &&
              userData?.abonnement_actif &&
              setOfferDialogVisible(true)
            }
            text={renderOfferButtonText()}
            buttonType={1}
            isDisabled={!userOfferState?.etat || !userData?.abonnement_actif}
          />

          <OfferSection
            title="♾️ Offre Permanente"
            offerText={offre.offrePermanente}
            isActive={userData?.abonnement_actif}
            styleType="Permanente"
          />

          <OfferButton
            onPress={() =>
              userData?.abonnement_actif && setUserCardVisible(true)
            }
            text="Ma Carte"
            buttonType={2}
            isDisabled={!userData?.abonnement_actif}
          />
        </View>
      </ScrollView>

      {!userData?.abonnement_actif && (
        <SubscriptionButton
          onPress={handleSubscribe}
          animatedStyle={animatedStyle}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContainer: {
    flex: 1,
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
  },
  content: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  categoryText: {
    color: '#A9A9A9',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
  },
});

export default DetailleOffres;
