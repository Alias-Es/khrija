import { useState, useEffect } from 'react';
import { firebase } from '../FirebaseConfig';

export const useOfferData = (id) => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const doc = await firebase.firestore().collection('offres').doc(id).get();
        if (doc.exists) {
          setOffer(doc.data());
        } else {
          console.error("Aucune offre trouvée avec cet ID :", id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'offre:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  return { offer, loading };
};
