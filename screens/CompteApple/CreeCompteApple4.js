import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AgePickerModal from '../../components/AgePickerModal';
import SexePickerModal from '../../components/SexePickerModal';
import StatusPickerModal from '../../components/StatusPickerModal';
import { firebase } from '../../FirebaseConfig';

const CreeCompteApple4 = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Extraction des paramètres de navigation
  const { userId, nom, prenom } = route.params || {};

  // États pour les sélections et modaux
  const [age, setAge] = useState(null);
  const [tempAge, setTempAge] = useState(null);
  const [sexe, setSexe] = useState(null);
  const [tempSexe, setTempSexe] = useState(null);
  const [status, setStatus] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);

  // États des modaux
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [sexeModalVisible, setSexeModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  // État de chargement
  const [isLoading, setIsLoading] = useState(false);

  // Validation des données
  const isFormValid = age && sexe && status;

  // Validation des données utilisateur
  const validateUserData = useCallback(() => {
    const errors = [];

    if (!userId) errors.push("Identifiant utilisateur manquant");
    if (!age) errors.push("Âge non sélectionné");
    if (!sexe) errors.push("Sexe non sélectionné");
    if (!status) errors.push("Statut non sélectionné");

    return errors;
  }, [userId, age, sexe, status]);

  // Gestion de la création ou mise à jour du compte utilisateur
  const handleFinish = async () => {
    const validationErrors = validateUserData();
    if (validationErrors.length > 0) {
      Alert.alert('Formulaire incomplet', validationErrors.join('\n'));
      return;
    }

    setIsLoading(true);

    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        throw new Error('Utilisateur non authentifié');
      }

      const userRef = firebase.firestore().collection('users').doc(userId);

      const userData = {
        uid: userId,
        nom: nom || '',
        prenom: prenom || '',
        age,
        sexe,
        statut: status,
        abonnement_actif: false,
        periode: null,
        isRegistered: true,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const existingUser = await userRef.get();

      if (existingUser.exists) {
        // Mise à jour des données si le profil existe
        console.log('Mise à jour des données utilisateur existantes.');
        await userRef.update(userData);
      } else {
        // Création du profil utilisateur
        console.log('Création d’un nouveau profil utilisateur.');
        userData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await userRef.set(userData);
      }

      console.log('Données utilisateur sauvegardées avec succès.');

      // Gestion des offres
      const offresSnapshot = await firebase.firestore().collection('offres').get();
      const batch = firebase.firestore().batch();

      offresSnapshot.forEach((offreDoc) => {
        const offreEtatRef = userRef.collection('offres_etats').doc(offreDoc.id);
        batch.set(offreEtatRef, { 
          etat: false, 
          offreId: offreDoc.id 
        });
      });

      await batch.commit();
      console.log('États des offres enregistrés avec succès.');

      Alert.alert('Inscription réussie', 'Votre profil a été mis à jour avec succès.', [
        { text: 'OK', onPress: () => navigation.navigate('offres') },
      ]);
    } catch (error) {
      console.error('Erreur lors de la gestion du profil utilisateur :', error);
      Alert.alert('Erreur', `Une erreur est survenue : ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KHRIJA</Text>
      <Text style={styles.subtitle}>
        Bonjour {prenom || 'Utilisateur'}, finalisez votre profil :
      </Text>

      {/* Sélection de l'âge */}
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          setTempAge(age);
          setAgeModalVisible(true);
        }}
      >
        <Text style={styles.selectButtonText}>
          {age ? `Âge : ${age} ans` : 'Sélectionnez votre âge'}
        </Text>
      </TouchableOpacity>
      <AgePickerModal
        visible={ageModalVisible}
        onClose={() => setAgeModalVisible(false)}
        tempValue={tempAge}
        onTempValueChange={setTempAge}
        onConfirm={() => {
          setAge(tempAge);
          setAgeModalVisible(false);
        }}
      />

      {/* Sélection du sexe */}
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          setTempSexe(sexe);
          setSexeModalVisible(true);
        }}
      >
        <Text style={styles.selectButtonText}>
          {sexe ? `Sexe : ${sexe}` : 'Sélectionnez votre sexe'}
        </Text>
      </TouchableOpacity>
      <SexePickerModal
        visible={sexeModalVisible}
        onClose={() => setSexeModalVisible(false)}
        tempValue={tempSexe}
        onTempValueChange={setTempSexe}
        onConfirm={() => {
          setSexe(tempSexe);
          setSexeModalVisible(false);
        }}
      />

      {/* Sélection du statut */}
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          setTempStatus(status);
          setStatusModalVisible(true);
        }}
      >
        <Text style={styles.selectButtonText}>
          {status ? `Statut : ${status}` : 'Sélectionnez votre statut'}
        </Text>
      </TouchableOpacity>
      <StatusPickerModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        tempValue={tempStatus}
        onTempValueChange={setTempStatus}
        onConfirm={() => {
          setStatus(tempStatus);
          setStatusModalVisible(false);
        }}
      />

      {/* Bouton de finalisation */}
      <TouchableOpacity
        style={[
          styles.finishButton,
          isFormValid ? styles.activeFinishButton : null,
        ]}
        onPress={handleFinish}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.finishButtonText}>Créer mon profil</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
    paddingTop: 110,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 90,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 100,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  selectButton: {
    width: '90%',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finishButton: {
    marginTop: 100,
    width: '90%',
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#AAA',
    alignItems: 'center',
  },
  activeFinishButton: {
    backgroundColor: '#4A90E2',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreeCompteApple4;
