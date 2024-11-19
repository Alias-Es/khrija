import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal , Animated} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { firebase } from '../FirebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

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
 
  const [shakeAnimation] = useState(new Animated.Value(0)); // Ligne à ajouter
  const shakeButton = () => {
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
    // Vérifier si le clic est fait en dehors des zones interactives
 
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
  
  useEffect(() => {
    const fetchOffre = async () => {
      try {
        const doc = await firebase.firestore().collection('offres').doc(id).get();
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
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setUserData(data);
            setInitialModalVisible(!data.abonnement_actif);

            // Récupérer l'état de l'offre pour cet utilisateur
            const userOfferDoc = await firebase.firestore()
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
        console.error("Erreur lors de la récupération des données utilisateur:", error);
      }
    };

    fetchOffre();
    fetchUserData();
  }, [id]);

  const handleSubscribe = () => {
    setInitialModalVisible(false);
    navigation.navigate("ntabonna");
  };

  const handleValidateOffer = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .collection('offres_etats')
          .doc(id)
          .update({ etat: false });

        setUserOfferState((prev) => ({ ...prev, etat: false }));
        setOfferDialogVisible(false);
        console.log("L'offre a été validée et son état est maintenant false pour cet utilisateur.");
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

  if (!offre) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur lors du chargement de l'offre.</Text>
      </View>
    );
  }

  const renderOfferButtonText = () => {
    if (!userData?.abonnement_actif) {
      return 'Ma3ndkch abonnement ?';
    }
    return userOfferState?.etat ? 'Montrer mon offre' : 'Offre déjà utilisée';
  };

  const offerButtonStyle = (buttonType) => {
    if (buttonType === 1) {
      if (!userData?.abonnement_actif || !userOfferState?.etat) {
        return styles.subscriptionRequirementButtonInactive;
      }
      return styles.subscriptionRequirementButtonActive1;
    } else if (buttonType === 2) {
      return !userData?.abonnement_actif
        ? styles.subscriptionRequirementButtonInactive
        : styles.subscriptionRequirementButtonActive2;
    }
  };

  return (
    <View style={styles.container} onTouchStart={handleOutsideClick}>

      {/* Modal d'abonnement */}
      <Modal
        visible={initialModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInitialModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setInitialModalVisible(false)}>
              <FontAwesome name="times" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Bghiti tstafd men les réductions ?</Text>
            <Text style={styles.modalMessage}>Tabonna daba u dir khrijat</Text>
            <TouchableOpacity
              style={styles.modalSubscribeButton}
              onPress={handleSubscribe}
            >
              <Text style={styles.subscribeButtonText}>M'ABONNER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de validation d'offre */}
      <Modal
        visible={offerDialogVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOfferDialogVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setOfferDialogVisible(false)}>
              <FontAwesome name="times" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Confirmation</Text>
            <Text style={styles.modalMessage}>Khask tvalidi l'offre 9dam un responsable f l'établissement</Text>
            <TouchableOpacity
              style={styles.modalSubscribeButton}
              onPress={handleValidateOffer}
            >
              <Text style={styles.subscribeButtonText}>Valider l'offre</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal carte utilisateur */}
      {userData?.abonnement_actif && (
        <Modal
          visible={userCardVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setUserCardVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.userCardContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setUserCardVisible(false)}>
                <FontAwesome name="times" size={24} color="#333" />
              </TouchableOpacity>
              <View style={styles.userAvatar}>
                <FontAwesome name="user-circle" size={60} color="#333" />
              </View>
              <Text style={styles.userName}>{userData?.nom || "Nom de famille"}</Text>
              <Text style={styles.userInfo}>{userData?.prenom || "Prénom"}</Text>
              <Text style={styles.userInfo}>{userData?.age ? `${userData.age} ans` : "Âge inconnu"}</Text>
              <Text style={styles.userInfo}>{userData?.email || "exemple@email.com"}</Text>
              <Text style={styles.userInfo}>Expire le {new Date().toISOString().split('T')[0]}</Text>
              <TouchableOpacity
                style={styles.modalSubscribeButton}
                onPress={() => setUserCardVisible(false)}
              >
                <Text style={styles.subscribeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Image source={{ uri: offre.couverture }} style={styles.coverImage} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('offres')}
          >
            <FontAwesome name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.categoryText}>{offre.categorie}</Text>
          <Text style={styles.title}>{offre.nom}</Text>
          <Text style={styles.description}>{offre.description}</Text>

          <Text style={styles.offerTitlePonctuelle}>🎟️ Offre Découverte</Text>
          <View
            style={[ 
              styles.offerContainerPonctuelle,
              userData?.abonnement_actif && styles.offerContainerActivePonctuelle,
            ]}
          >
            <Text
              style={[
                styles.offerText,
                userData?.abonnement_actif && styles.offerTextActivePonctuelle,
              ]}
            >
              {offre.offreDecouverte}
            </Text>
          </View>

          {/* Bouton "Montrer mon offre" */}
          <TouchableOpacity
            style={[styles.subscriptionRequirementButton, offerButtonStyle(1)]}
            onPress={() => userOfferState?.etat && userData?.abonnement_actif && setOfferDialogVisible(true)}
            disabled={!userOfferState?.etat || !userData?.abonnement_actif}
          >
            <Text style={[
              styles.subscriptionRequirementText,
              !userData?.abonnement_actif
                ? styles.subscriptionRequirementTextNoSubscription
                : userOfferState?.etat
                ? styles.subscriptionRequirementTextActive
                : styles.subscriptionRequirementTextInactive
            ]}>
              {renderOfferButtonText()}
            </Text>
          </TouchableOpacity>

          <Text style={styles.offerTitlePermanente}>♾️ Offre Permanente</Text>
          <View
            style={[
              styles.offerContainerPermanente,
              userData?.abonnement_actif && styles.offerContainerActivePermanente,
            ]}
          >
            <Text
              style={[
                styles.offerText,
                userData?.abonnement_actif && styles.offerTextActivePermanente,
              ]}
            >
              {offre.offrePermanente}
            </Text>
          </View>

          {/* Bouton "Ma Karte" */}
          <TouchableOpacity
            style={[
              styles.subscriptionRequirementButton,
              offerButtonStyle(2)
            ]}
            onPress={() => userData?.abonnement_actif && setUserCardVisible(true)}
            disabled={!userData?.abonnement_actif}
          >
            <Text style={[
              styles.subscriptionRequirementText,
              userData?.abonnement_actif ? styles.subscriptionRequirementTextActive : styles.subscriptionRequirementTextInactive
            ]}>
              Ma Carte
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {!userData?.abonnement_actif && (
  <Animated.View style={[styles.buttonContainer, animatedStyle]}>
    <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
      <Text style={styles.subscribeButtonText}>M'ABONNER</Text>
    </TouchableOpacity>
  </Animated.View>
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
  header: {
    position: 'relative',
    height: 200,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
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
  offerTitlePonctuelle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF4081',
    marginTop: 20,
  },
  offerTitlePermanente: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginTop: 50,
  },
  offerContainerPonctuelle: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
    borderColor: '#D3D3D3',
    borderWidth: 1,
  },
  offerContainerPermanente: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
    borderColor: '#D3D3D3',
    borderWidth: 1,
  },
  offerContainerActivePonctuelle: {
    borderColor: '#FF79A7',
  },
  offerContainerActivePermanente: {
    borderColor: '#80B1EB',
  },
  offerText: {
    fontSize: 15,
    color: '#A9A9A9',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  offerTextActivePonctuelle: {
    color: '#FF79A7',
  },
  offerTextActivePermanente: {
    color: '#80B1EB',
  },
  subscriptionRequirementButton: {
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
    height: 55,
  },
  subscriptionRequirementButtonActive1: {
    backgroundColor: '#FF4081',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },
  subscriptionRequirementButtonActive2: {
    backgroundColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  subscriptionRequirementButtonInactive: {
    backgroundColor: '#B3B3B3',
  },
  subscriptionRequirementButtonNoSubscription: {
    backgroundColor: '#B3B3B3',
    transform: [{ skewX: '-10deg' }],
  },
  subscriptionRequirementText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscriptionRequirementTextActive: {
    color: '#FFFFFF',
  },
  subscriptionRequirementTextInactive: {
    color: '#FFFFFF',
  },
  subscriptionRequirementTextNoSubscription: {
    color: '#FFFFFF',
  },
  subscribeButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4081',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubscribeButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  userCardContainer: {
    width: '80%',
    backgroundColor: '#B3E5FC',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  userAvatar: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});

export default DetailleOffres;
