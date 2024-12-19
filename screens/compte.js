import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, SafeAreaView, Alert, Text, TouchableOpacity } from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import des icônes

import Ntconnectaa from '../components/Ntconnectaa';
import HeaderCompte from '../components/Compte/HeaderCompte';
import SubscriptionOptionCompte from '../components/Compte/SubscriptionOptionCompte';
import SubscribeButtonCompte from '../components/Compte/SubscribeButtonCompte';
import FooterCompte from '../components/Compte/FooterCompte';

const Compte = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(undefined);
  const [isRegistered, setIsRegistered] = useState(undefined);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [abonnementActif, setAbonnementActif] = useState(undefined);
  const [prices, setPrices] = useState(undefined);

  const fetchUserData = async () => {
    const currentUser = firebase.auth().currentUser;
    setUser(currentUser);

    if (currentUser) {
      const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        setAbonnementActif(data.abonnement_actif);
        setIsRegistered(data.isRegistered || false);
      } else {
        setAbonnementActif(false);
        setIsRegistered(false);
      }
    } else {
      setAbonnementActif(false);
      setIsRegistered(false);
    }

    try {
      const priceDoc = await firebase.firestore().collection('abonnement').doc('prix').get();
      if (priceDoc.exists) {
        const data = priceDoc.data();
        setPrices({ annuel: data.annuel, mensuel: data.mensuel });
      } else {
        setPrices({ annuel: 0, mensuel: 0 });
      }
    } catch (error) {
      setPrices({ annuel: 0, mensuel: 0 });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate('offres');
    } catch (error) {
      Alert.alert('Erreur', 'La déconnexion a échoué. Veuillez réessayer.');
    }
  };

  const handleSubscriptionSelect = (subscriptionType) => {
    setSelectedSubscription(subscriptionType);
  };

  if (isRegistered === false) {
    return <Ntconnectaa />;
  }

  if (user === undefined || abonnementActif === undefined || prices === undefined || isRegistered === undefined) {
    return null;
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
          <ProfileOption
            iconName="local-offer"
            text="Coupons et Offres"
            onPress={() => navigation.navigate('PromoScreen')}
          />
          <ProfileOption
            iconName="subscriptions"
            text="Mon abonnement"
            onPress={() => navigation.navigate('monAbonnement')}
          />
          <ProfileOption
            iconName="help-outline"
            text="FAQ"
            onPress={() => navigation.navigate('FaqScreen')}
          />
          <ProfileOption
            iconName="logout"
            text="Déconnexion"
            onPress={handleLogout}
            isLogout={true}
          />
        </View>
        <FooterCompte />
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileOption = ({ iconName, text, onPress, isLogout }) => (
  <TouchableOpacity
    style={[styles.option, isLogout && styles.logoutOption]}
    onPress={onPress}
  >
    <Icon name={iconName} size={24} color={isLogout ? '#FF4081' : '#4A90E2'} style={styles.icon} />
    <Text style={[styles.optionText, isLogout && { color: '#FF4081' }]}>{text}</Text>
  </TouchableOpacity>
);

const styles = {
  safeContainer: { flex: 1, backgroundColor: '#F8F8F8' },
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  subscriptionContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  profileContainer: { marginHorizontal: 20 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000', // Couleur de l'ombre
    shadowOffset: { width: 0, height: 1 }, // Décalage de l'ombre
    shadowOpacity: 0.1, // Opacité de l'ombre
    shadowRadius: 1, // Rayon de l'ombre (flou)
    elevation: 2, // Pour Android (équivalent)
  
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginVertical: 5,
    elevation: 2,
  },
  icon: { marginRight: 10 },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center', // Centrage horizontal du texte
    color: '#000',
  
  },
  logoutOption: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FF4081' },
};

export default Compte;
