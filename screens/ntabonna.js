import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { firebase } from '../FirebaseConfig';

const Ntabonna = ({ navigation }) => {
  const [prices, setPrices] = useState({ annuel: null, mensuel: null });
  const [selectedPlan, setSelectedPlan] = useState(null); // État pour suivre le plan sélectionné

  useEffect(() => {
    const fetchAbonnementPrices = async () => {
      try {
        const abonnementDoc = await firebase.firestore().collection('abonnement').doc('prix').get();
        if (abonnementDoc.exists) {
          setPrices({
            annuel: abonnementDoc.data().annuel,
            mensuel: abonnementDoc.data().mensuel,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des prix d'abonnement:", error);
      }
    };

    fetchAbonnementPrices();
  }, []);

  const handleSubscribe = () => {
    // Redirige vers un lien spécifique en fonction du plan sélectionné
    if (selectedPlan === 'annuel') {
      Linking.openURL('https://example.com/abonnement-annuel');
    } else if (selectedPlan === 'mensuel') {
      Linking.openURL('https://example.com/abonnement-mensuel');
    } else {
      alert("Veuillez sélectionner un plan d'abonnement.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>KHRIJA</Text>
      <Text style={styles.subtitle}>WELLY MEMBRE KHRIJA</Text>
      
      {/* Carte Abonnement Annuel */}
      <TouchableOpacity
        style={[styles.card, selectedPlan === 'annuel' && styles.selectedCard]}
        onPress={() => setSelectedPlan('annuel')}
      >
        <Text style={styles.cardTitle}>ABONNEMENT ANNUEL</Text>
        <Text style={styles.priceText}>{prices.annuel ? `${prices.annuel} MAD` : '...'} </Text>
        <Text style={styles.priceFrequency}>/par an</Text>
        <Text style={styles.cardDetails}>Valable 12 mois.</Text>
        <Text style={styles.cardDetails}>Pas de renouvellement automatique à la fin de l'abonnement.</Text>
      </TouchableOpacity>

      {/* Carte Abonnement Mensuel */}
      <TouchableOpacity
        style={[styles.card, selectedPlan === 'mensuel' && styles.selectedCard]}
        onPress={() => setSelectedPlan('mensuel')}
      >
        <Text style={styles.cardTitle}>ABONNEMENT MENSUEL</Text>
        <Text style={[styles.priceText, { color: '#4A90E2' }]}>{prices.mensuel ? `${prices.mensuel} MAD` : '...'} </Text>
        <Text style={styles.priceFrequency}>/par mois</Text>
        <Text style={styles.cardDetails}>Sans engagement.</Text>
        <Text style={styles.cardDetails}>Renouvellement automatique chaque mois.</Text>
      </TouchableOpacity>

      {/* Bouton M'abonner */}
      <TouchableOpacity
        style={[
          styles.subscribeButton,
          selectedPlan ? styles.subscribeButtonActive : styles.subscribeButtonInactive
        ]}
        onPress={handleSubscribe}
        disabled={!selectedPlan} // Désactive le bouton si aucun plan n'est sélectionné
      >
        <Text style={styles.subscribeButtonText}>M'ABONNER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  logo: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FF4081',
    marginTop: 59,
  },
  subtitle: {
    fontSize: 18,
    color: '#4A90E2',
    marginBottom: 50,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  selectedCard: {
    borderColor: '#FF4081',
    borderWidth: 2,
    backgroundColor: '#FFE6EB',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF4081',
  },
  priceFrequency: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  cardDetails: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  subscribeButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  subscribeButtonInactive: {
    backgroundColor: '#D3D3D3', // Couleur grise quand inactif
  },
  subscribeButtonActive: {
    backgroundColor: '#FF4081', // Couleur rose quand actif
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Ntabonna;
