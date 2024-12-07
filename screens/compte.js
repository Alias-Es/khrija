import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import Ntconnectaa from '../components/Ntconnectaa';

import HeaderCompte from '../components/Compte/HeaderCompte';
import SubscriptionOptionCompte from '../components/Compte/SubscriptionOptionCompte';
import SubscribeButtonCompte from '../components/Compte/SubscribeButtonCompte';
import ProfileOptionCompte from '../components/Compte/ProfileOptionCompte';
import FooterCompte from '../components/Compte/FooterCompte';

const Compte = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(undefined); // Initialisé à undefined
  const [isRegistered, setIsRegistered] = useState(undefined); // Ajout d'une condition pour le statut d'inscription
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [abonnementActif, setAbonnementActif] = useState(undefined); // Initialisé à undefined
  const [prices, setPrices] = useState(undefined); // Initialisé à undefined

  useEffect(() => {
    const initialize = async () => {
      const currentUser = firebase.auth().currentUser;
      setUser(currentUser);

      if (currentUser) {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setAbonnementActif(data.abonnement_actif);
          setIsRegistered(data.isRegistered || false); // Ajout du champ isRegistered
        } else {
          setAbonnementActif(false);
          setIsRegistered(false); // Si le document n'existe pas
        }
      } else {
        setAbonnementActif(false); // Si pas d'utilisateur connecté
        setIsRegistered(false);
      }

      try {
        const priceDoc = await firebase.firestore().collection('abonnement').doc('prix').get();
        if (priceDoc.exists) {
          const data = priceDoc.data();
          setPrices({ annuel: data.annuel, mensuel: data.mensuel });
        } else {
          console.error('Document prix non trouvé');
          setPrices({ annuel: 0, mensuel: 0 });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des prix :', error);
        setPrices({ annuel: 0, mensuel: 0 });
      }
    };

    initialize();
  }, []);

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigation.replace('offres');
    } catch (error) {
      Alert.alert('Erreur', 'La déconnexion a échoué. Veuillez réessayer.');
    }
  };

  const handleSubscriptionSelect = (subscriptionType) => {
    setSelectedSubscription(subscriptionType);
  };
 // Afficher Ntconnectaa si l'utilisateur n'est pas inscrit (première vérification)
  if (isRegistered === false) {
    return <Ntconnectaa />;
  }
  // Si les données ne sont pas chargées, afficher un écran de chargement minimal
  if (user === undefined || abonnementActif === undefined || prices === undefined || isRegistered === undefined) {
    return null; // Ne rien rendre
  }

 

  // Afficher Ntconnectaa si l'utilisateur n'est pas authentifié
  if (!user) {
    return <Ntconnectaa />;
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <HeaderCompte />
      <ScrollView style={styles.container}>
        {abonnementActif === false && (
          <>
            <View style={styles.subscriptionContainer}>
              <SubscriptionOptionCompte
                type="ABONNEMENT ANNUEL"
                price={prices.annuel}
                period="an"
                info1="Valable 12 mois."
                info2="Pas de renouvellement automatique à la fin de l'abonnement."
                selected={selectedSubscription === 'ANNUEL'}
                onSelect={() => handleSubscriptionSelect('ANNUEL')}
              />
              <SubscriptionOptionCompte
                type="ABONNEMENT MENSUEL"
                price={prices.mensuel}
                period="mois"
                info1="Sans engagement."
                info2="Renouvellement automatique chaque mois."
                selected={selectedSubscription === 'MENSUEL'}
                onSelect={() => handleSubscriptionSelect('MENSUEL')}
              />
            </View>
            <SubscribeButtonCompte
              disabled={!selectedSubscription}
              onPress={() => {
                if (selectedSubscription) {
                  Alert.alert('Confirmation', `Vous avez sélectionné l'abonnement ${selectedSubscription.toLowerCase()}.`);
                } else {
                  Alert.alert('Erreur', 'Veuillez sélectionner un abonnement.');
                }
              }}
            />
          </>
        )}
        <View style={[styles.profileContainer, abonnementActif && { marginTop: 30 }]}>
          <ProfileOptionCompte text="Mes offres générées" onPress={() => navigation.navigate('PromoScreen')} />
          <ProfileOptionCompte text="Mon abonnement" onPress={() => navigation.navigate('monAbonnement')} />
          <ProfileOptionCompte text="FAQ" onPress={() => navigation.navigate('FaqScreen')} />
          <ProfileOptionCompte text="Déconnexion" onPress={handleLogout} isLogout={true} />
        </View>
        <FooterCompte />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  safeContainer: { flex: 1, backgroundColor: '#F8F8F8' },
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  subscriptionContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  profileContainer: { marginHorizontal: 20 },
};

export default Compte;
