import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
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

const DetailleOffres = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const { offer, loading } = useOfferData(id);

  const user = firebase.auth().currentUser;

  const {
    userData = { abonnement_actif: false },
    userOfferState = { etat: false },
    initialModalVisible = false,
    setInitialModalVisible = () => {},
    setUserOfferState = () => {},
  } = user ? useUserData(id) : {};

  const [offerDialogVisible, setOfferDialogVisible] = useState(false);
  const [userCardVisible, setUserCardVisible] = useState(false);
  const [showSwipeButton, setShowSwipeButton] = useState(false);

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
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état de l'offre:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur lors du chargement de l'offre.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InitialSubscriptionModal
        visible={initialModalVisible}
        onClose={() => setInitialModalVisible(false)}
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
          <Text style={styles.categoryText}>{offer.categorie}</Text>
          <Text style={styles.title}>{offer.nom}</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={3}>
              {offer.description}
            </Text>
          </View>

          <OfferSection
            title="🎟️ Offre Découverte"
            offerText={offer.offreDecouverte}
            isActive={userData?.abonnement_actif}
            styleType="Ponctuelle"
          />

          <View style={styles.buttonContainer}>
            {!userData?.abonnement_actif ? (
              <OfferButton
                text="Ma3ndekch abonnement"
                buttonType={1}
                isDisabled={true}
              />
            ) : !userOfferState?.etat ? (
              <OfferButton text="Offre déjà utilisée" buttonType={1} isDisabled />
            ) : !showSwipeButton ? (
              <OfferButton
                onPress={() => setOfferDialogVisible(true)}
                text="Afficher mon offre"
                buttonType={1}
                isDisabled={!userOfferState?.etat || !userData?.abonnement_actif}
              />
            ) : (
              <CustomSwipeButton onSwipeComplete={handleSwipeSuccess} />
            )}
          </View>

          <OfferSection
            title="♾️ Offre Permanente"
            offerText={offer.offrePermanente}
            isActive={userData?.abonnement_actif}
            styleType="Permanente"
          />

          <OfferButton
            onPress={() => userData?.abonnement_actif && setUserCardVisible(true)}
            text="Ma Carte"
            buttonType={2}
            isDisabled={!userData?.abonnement_actif}
          />
        </View>
      </ScrollView>

      {!userData?.abonnement_actif && (
        <View style={styles.animatedButtonContainer}>
          <SubscriptionButton onPress={handleSubscribe} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
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
  title: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
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
});

export default DetailleOffres;