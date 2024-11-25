import { useState, useEffect } from 'react';
import { firebase } from '../FirebaseConfig';

export const useUserData = (id) => {
  const [userData, setUserData] = useState(null);
  const [userOfferState, setUserOfferState] = useState(null);
  const [initialModalVisible, setInitialModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setUserData(data);
            setInitialModalVisible(!data.abonnement_actif);

            // Récupération de l'état de l'offre
            const userOfferDoc = await firebase
              .firestore()
              .collection('users')
              .doc(user.uid)
              .collection('offres_etats')
              .doc(id)
              .get();

            setUserOfferState(userOfferDoc.exists ? userOfferDoc.data() : { etat: true });
          } else {
            console.error("Données utilisateur introuvables.");
          }
        } else {
          console.error("Aucun utilisateur connecté.");
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    fetchUserData();
  }, [id]);

  return {
    userData,
    userOfferState,
    initialModalVisible,
    setInitialModalVisible,
    setUserOfferState,
  };
};
