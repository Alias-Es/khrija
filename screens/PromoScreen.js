import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const PromoCodeScreen = () => {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handlePromoCode = async () => {
    console.log('Code promo soumis :', promoCode);
    setLoading(true);

    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        Alert.alert('Erreur', 'Vous devez être connecté pour utiliser un code promo.');
        setLoading(false);
        return;
      }

      const offresSnapshot = await firebase.firestore().collection('offres').get();
      let codeFound = false;
      let foundOfferId = null;
      let promoDocId = null;

      for (const offreDoc of offresSnapshot.docs) {
        const codePromoCollection = await firebase
          .firestore()
          .collection(`offres/${offreDoc.id}/codePromo`)
          .get();

        for (const promoDoc of codePromoCollection.docs) {
          const promoData = promoDoc.data();
          if (Object.values(promoData).includes(promoCode)) {
            codeFound = true;
            foundOfferId = offreDoc.id;
            promoDocId = promoDoc.id;
            break;
          }
        }

        if (codeFound) break;
      }

      if (!codeFound) {
        Alert.alert('Erreur', 'Code promo invalide ou expiré.');
        setLoading(false);
        return;
      }

      const userOfferStateRef = firebase.firestore().doc(`users/${user.uid}/offres_etats/${foundOfferId}`);
      await userOfferStateRef.set({ etat: true }, { merge: true });

      const promoCodeRef = firebase.firestore().doc(`offres/${foundOfferId}/codePromo/${promoDocId}`);
      await promoCodeRef.delete();

      navigation.navigate('detailleOffres', { id: foundOfferId });
    } catch (error) {
      console.error('Erreur :', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>Entrez votre code promo</Text>
        <Text style={styles.subtitle}>
          Utilisez un code promo pour débloquer une offre spéciale.
        </Text>
        <TextInput
          style={styles.input}
          value={promoCode}
          onChangeText={setPromoCode}
          placeholder="Code promo"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
        />
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, !promoCode.trim() && styles.disabledButton]}
            onPress={handlePromoCode}
            disabled={!promoCode.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Valider le code</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  submitButtonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingLeft: 20,
  },
  submitButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PromoCodeScreen;
