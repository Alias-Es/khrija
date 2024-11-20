import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { firebase } from '../FirebaseConfig';

// Importation des composants personnalisés
import InitialSubscriptionModal from '../components/InitialSubscriptionModal';
import OfferValidationModal from '../components/OfferValidationModal';
import UserCardModal from '../components/UserCardModal';
import SubscriptionButton from '../components/SubscriptionButton';
import Header from '../components/Header';
import OfferSection from '../components/OfferSection';
import OfferButton from '../components/OfferButton';
import CustomSwipeButton from '../components/CustomSwipeButton'; // Import du bouton swipe

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
  const [showSwipeButton, setShowSwipeButton] = useState(false); // Affiche le swipe après validation

  useEffect(() => {
    const fetchOffre = async () => {
      try {
        console.log("Fetching offer data for ID:", id);
        const doc = await firebase
          .firestore()
          .collection('offres')
          .doc(id)
          .get();
        if (doc.exists) {
          console.log("Offer data retrieved:", doc.data());
          setOffre(doc.data());
        } else {
          console.log("No offer found for ID:", id);
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
          console.log("Fetching user data for user ID:", user.uid);
          const userDoc = await firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            const data = userDoc.data();
            console.log("User data retrieved:", data);
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
              console.log("User offer state retrieved:", userOfferDoc.data());
              setUserOfferState(userOfferDoc.data());
              setShowSwipeButton(false);
            } else {
              console.log("No user offer state found, setting default.");
              setUserOfferState({ etat: true });
            }
          } else {
            console.log("No user data found for user ID:", user.uid);
          }
        } else {
          console.log("No user authenticated.");
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
    console.log("Handling subscription navigation.");
    setInitialModalVisible(false);
    navigation.navigate('ntabonna');
  };

  const handleValidateOffer = () => {
    console.log("Offer validated.");
    setOfferDialogVisible(false);
    setShowSwipeButton(true);
  };

  const handleSwipeSuccess = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        console.log("User swiped successfully, updating state.");
        await firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .collection('offres_etats')
          .doc(id)
          .update({ etat: false });

        setUserOfferState((prev) => ({ ...prev, etat: false }));
        setShowSwipeButton(false);
        console.log("L'offre a été validée avec succès.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état de l'offre:", error);
    }
  };

  if (loading) {
    console.log("Loading screen displayed.");
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  if (!offre) {
    console.log("No offer available, displaying error screen.");
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Erreur lors du chargement de l'offre.
        </Text>
      </View>
    );
  }

  console.log("Rendering offer details:", offre);

  return (
    <View style={styles.container}>
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

          {/* Gestion améliorée de la description */}
          <View style={styles.descriptionContainer}>
            <Text
              style={styles.description}
              numberOfLines={3} // Tronque au bout de 3 lignes
              ellipsizeMode="tail"
            >
              {offre.description}
            </Text>
          </View>

          <OfferSection
            title="🎟️ Offre Découverte"
            offerText={offre.offreDecouverte}
            isActive={userData?.abonnement_actif}
            styleType="Ponctuelle"
          />

          <View style={styles.buttonContainer}>
            {!userOfferState?.etat ? (
              <OfferButton
                text="Offre déjà utilisée"
                buttonType={1}
                isDisabled={true}
              />
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
        <SubscriptionButton onPress={handleSubscribe} />
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
  descriptionContainer: {
    maxHeight: 120,
    overflow: 'hidden', // Empêche les débordements
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
  },
});

export default DetailleOffres;
