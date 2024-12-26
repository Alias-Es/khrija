import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Ntconnectaa from '../components/Ntconnectaa';
import HeaderCompte from '../components/Compte/HeaderCompte';
import SubscriptionOptionCompte from '../components/Compte/SubscriptionOptionCompte';
import SubscribeButtonCompte from '../components/Compte/SubscribeButtonCompte';
import FooterCompte from '../components/Compte/FooterCompte';
import LogoutConfirmationModal from '../components/Compte/LogoutConfirmationModal'; // Import du modal
import { LanguageContext } from '../LanguageContext';

const Compte = () => {
  const navigation = useNavigation();
  const { language, translations } = useContext(LanguageContext);
  const t = (key) => translations[language][key];

  const [user, setUser] = useState(undefined);
  const [isRegistered, setIsRegistered] = useState(undefined);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [abonnementActif, setAbonnementActif] = useState(undefined);
  const [prices, setPrices] = useState(undefined);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

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
      setLogoutModalVisible(false); // Assure que le modal disparaît
      navigation.navigate('offres'); // Redirige après la déconnexion
    } catch (error) {
      setLogoutModalVisible(false); // Assure que le modal disparaît même en cas d'erreur
      alert(t('error') + ': ' + t('logoutError'));
    }
  };

  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const hideLogoutModal = () => {
    setLogoutModalVisible(false);
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
                type={t('annualSubscription')}
                price={prices.annuel}
                period={t('perYear')}
                info1={t('valid12Months')}
                info2={t('noAutoRenewal')}
                selected={selectedSubscription === 'ANNUEL'}
                onSelect={() => setSelectedSubscription('ANNUEL')}
              />
              <SubscriptionOptionCompte
                type={t('monthlySubscription')}
                price={prices.mensuel}
                period={t('perMonth')}
                info1={t('noCommitment')}
                info2={t('autoRenewal')}
                selected={selectedSubscription === 'MENSUEL'}
                onSelect={() => setSelectedSubscription('MENSUEL')}
              />
            </View>
            <SubscribeButtonCompte
              disabled={!selectedSubscription}
              onPress={() => {
                if (selectedSubscription) {
                  alert(t('confirmation') + ': ' + t('selectedSubscription', { subscription: selectedSubscription }));
                } else {
                  alert(t('error') + ': ' + t('selectSubscriptionError'));
                }
              }}
            />
          </>
        )}
        <View style={[styles.profileContainer, abonnementActif && { marginTop: 30 }]}>
          <ProfileOption
            iconName="local-offer"
            text={t('couponsAndOffers')}
            onPress={() => navigation.navigate('PromoScreen')}
          />
          <ProfileOption
            iconName="subscriptions"
            text={t('mySubscription')}
            onPress={() => navigation.navigate('monAbonnement')}
          />
          <ProfileOption
            iconName="help-outline"
            text={t('faq')}
            onPress={() => navigation.navigate('FaqScreen')}
          />
          <ProfileOption
            iconName="logout"
            text={t('logout')}
            onPress={showLogoutModal}
            isLogout={true}
          />
        </View>
        <FooterCompte />
      </ScrollView>

      {/* Modal de confirmation de déconnexion */}
      <LogoutConfirmationModal
        visible={logoutModalVisible}
        onClose={hideLogoutModal}
        onConfirm={handleLogout}
        t={t}
      />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginVertical: 5,
  },
  icon: { marginRight: 10 },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  logoutOption: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FF4081' },
};

export default Compte;
