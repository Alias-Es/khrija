import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const PromoCodeScreen = () => {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handlePromoCode = async () => {
    console.log("Code promo soumis :", promoCode);
    setLoading(true);

    try {
      // Étape 1 : Accéder à l'utilisateur actuel
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error("Aucun utilisateur connecté !");
        Alert.alert("Erreur", "Vous devez être connecté pour utiliser un code promo.");
        setLoading(false);
        return;
      }
      const userId = user.uid;
      console.log("Utilisateur connecté :", userId);

      // Étape 2 : Récupérer toutes les offres
      console.log("Recherche dans la collection 'offres'...");
      const offresSnapshot = await firebase.firestore().collection('offres').get();

      let codeFound = false;
      let foundOfferId = null;
      let foundOfferDetails = null;
      let promoDocId = null;

      // Étape 3 : Parcourir les documents `offres` et chercher le code promo
      for (const offreDoc of offresSnapshot.docs) {
        console.log("Vérification du document :", offreDoc.id);

        const codePromoCollection = await firebase
          .firestore()
          .collection(`offres/${offreDoc.id}/codePromo`)
          .get();

        for (const promoDoc of codePromoCollection.docs) {
          const promoData = promoDoc.data();

          // Vérifier si le code promo correspond à une valeur quelconque
          const promoValues = Object.values(promoData);
          if (promoValues.includes(promoCode)) {
            console.log("Code promo trouvé dans le document :", offreDoc.id);
            codeFound = true;
            foundOfferId = offreDoc.id;
            foundOfferDetails = offreDoc.data(); // Récupérer les détails de l'offre
            promoDocId = promoDoc.id; // ID du document code promo
            break;
          }
        }

        if (codeFound) break;
      }

      // Étape 4 : Si le code promo est introuvable
      if (!codeFound) {
        console.log("Code promo introuvable !");
        Alert.alert("Erreur", "Code promo invalide ou expiré.");
        setLoading(false);
        return;
      }

      // Étape 5 : Mise à jour dans `users`
      console.log("Mise à jour de 'etat' pour l'utilisateur :", userId);
      const userOfferStateRef = firebase
        .firestore()
        .doc(`users/${userId}/offres_etats/${foundOfferId}`);

      await userOfferStateRef.set({ etat: true }, { merge: true });

      console.log("Mise à jour réussie : `etat` mis à true pour l'offre :", foundOfferId);

      // Étape 6 : Suppression du code promo
      console.log("Suppression du code promo :", promoDocId);
      const promoCodeRef = firebase
        .firestore()
        .doc(`offres/${foundOfferId}/codePromo/${promoDocId}`);
      await promoCodeRef.delete();

      console.log("Code promo supprimé avec succès :", promoDocId);

      // Étape 7 : Redirection vers `DetailleOffres.js` avec l'ID de l'offre
      console.log("Navigation vers DetailleOffres avec l'ID :", foundOfferId);
      navigation.navigate('detailleOffres', { id: foundOfferId });

    } catch (error) {
      console.error("Erreur lors de la vérification ou de la mise à jour :", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors du traitement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrez votre code promo</Text>
      <TextInput
        style={styles.input}
        value={promoCode}
        onChangeText={setPromoCode}
        placeholder="Code promo"
        autoCapitalize="none"
      />
      <Button title={loading ? "Chargement..." : "Valider le code"} onPress={handlePromoCode} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#E91E63" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    width: '80%',
  },
});

export default PromoCodeScreen;
