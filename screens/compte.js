import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Image, Linking } from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Compte = () => {
  const navigation = useNavigation();
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [abonnementActif, setAbonnementActif] = useState(false);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setAbonnementActif(data.abonnement_actif);
        }
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigation.replace('dkhla');
    } catch (error) {
      Alert.alert("Erreur", "La déconnexion a échoué. Veuillez réessayer.");
    }
  };

  const handleSubscriptionSelect = (subscriptionType) => {
    setSelectedSubscription(subscriptionType);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>KHRIJA</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Section Abonnement - Visible uniquement si abonnement_actif est false */}
        {!abonnementActif && (
          <>
            <View style={styles.subscriptionContainer}>
              <TouchableOpacity
                style={[
                  styles.subscriptionBox,
                  selectedSubscription === 'ANNUEL' && styles.selectedBox,
                ]}
                onPress={() => handleSubscriptionSelect('ANNUEL')}
              >
                <Text style={styles.subscriptionTitle}>ABONNEMENT ANNUEL</Text>
                <Text style={styles.subscriptionPriceAnnee}>95 MAD</Text>
                <Text style={styles.subscriptionPeriod}>/par an</Text>
                <Text style={styles.subscriptionInfo}>Valable 12 mois.</Text>
                <Text style={styles.subscriptionInfo}>Pas de renouvellement automatique à la fin de l'abonnement.</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.subscriptionBox,
                  selectedSubscription === 'MENSUEL' && styles.selectedBox,
                ]}
                onPress={() => handleSubscriptionSelect('MENSUEL')}
              >
                <Text style={styles.subscriptionTitle}>ABONNEMENT MENSUEL</Text>
                <Text style={styles.subscriptionPriceMois}>25 MAD</Text>
                <Text style={styles.subscriptionPeriod}>/par mois</Text>
                <Text style={styles.subscriptionInfo}>Sans engagement.</Text>
                <Text style={styles.subscriptionInfo}>Renouvellement automatique chaque mois.</Text>
              </TouchableOpacity>
            </View>

            {/* Bouton M'abonner */}
            <TouchableOpacity
              style={[styles.subscribeButton, !selectedSubscription && styles.disabledButton]}
              onPress={() => {
                if (selectedSubscription) {
                  Alert.alert("Confirmation", `Vous avez sélectionné l'abonnement ${selectedSubscription.toLowerCase()}.`);
                } else {
                  Alert.alert("Erreur", "Veuillez sélectionner un abonnement.");
                }
              }}
              disabled={!selectedSubscription}
            >
              <Text style={styles.subscribeButtonText}>M'abonner</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Section Profil */}
        <View style={[styles.profileContainer, abonnementActif && { marginTop: 30 }]}>
          <TouchableOpacity style={styles.profileOption}>
            <Text style={styles.profileText}>Mes offres générées</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileOption} onPress={() => navigation.navigate('monAbonnement')}>
            <Text style={styles.profileText}>Mon abonnement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileOption} onPress={() => navigation.navigate('FaqScreen')}>
  <Text style={styles.profileText}>FAQ</Text>
</TouchableOpacity>



          {/* Bouton Déconnexion */}
          <TouchableOpacity style={styles.profileOption} onPress={handleLogout}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* Footer avec le texte et les icônes */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>UNE QUESTION ?</Text>
          <Text style={styles.footerText}>Retrouve-nous sur nos réseaux sociaux :</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialIcon} onPress={() => Linking.openURL('https://www.instagram.com/khrijaa/')}>
              <Image source={require('../assets/images/instagram.png')} style={styles.iconImage} />
              <Text style={styles.iconText}>INSTAGRAM</Text>
            </TouchableOpacity>
            <Text style={styles.separator}>|</Text>
            <TouchableOpacity style={styles.socialIcon} onPress={() => Linking.openURL('https://www.tiktok.com/@khrijaa_')}>
              <Image source={require('../assets/images/tiktok.png')} style={styles.iconImage} />
              <Text style={styles.iconText}>TIKTOK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  logoText: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 35,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  subscriptionBox: {
    width: '45%',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  selectedBox: {
    backgroundColor: '#FFE6F0',
    borderColor: '#E91E63',
    borderWidth: 1,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  subscriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
    textAlign: 'center',
  },
  subscriptionPriceAnnee: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  subscriptionPriceMois: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  subscriptionPeriod: {
    fontSize: 14,
    color: '#555',
  },
  subscriptionInfo: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 5,
  },
  subscribeButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 40,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileContainer: {
    marginHorizontal: 20,
  },
  profileOption: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  profileText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginVertical: 5,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 29,
  },
  socialIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    
  },
  iconImage: {
    width: 35,
    height: 35,
    marginRight: 5,
    
  },
  iconText: {
    fontSize: 14,
    color: '#333',
  },
  separator: {
    fontSize: 18,
    color: '#999',
    marginHorizontal: 5,
  },
});

export default Compte;
