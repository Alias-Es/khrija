import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AgePickerModal from '../../components/AgePickerModal';
import SexePickerModal from '../../components/SexePickerModal';
import StatusPickerModal from '../../components/StatusPickerModal';
import { firebase } from '../../FirebaseConfig';

const Telephone5 = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { userId, nom, prenom } = route.params || {};

  const [age, setAge] = useState(null);
  const [tempAge, setTempAge] = useState(null);
  const [sexe, setSexe] = useState(null);
  const [tempSexe, setTempSexe] = useState(null);
  const [status, setStatus] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);

  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [sexeModalVisible, setSexeModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = age && sexe && status;

  const validateUserData = useCallback(() => {
    const errors = [];
    if (!userId) errors.push('Identifiant utilisateur manquant');
    if (!age) errors.push('Âge non sélectionné');
    if (!sexe) errors.push('Sexe non sélectionné');
    if (!status) errors.push('Statut non sélectionné');
    return errors;
  }, [userId, age, sexe, status]);

  const handleFinish = async () => {
    const validationErrors = validateUserData();
    if (validationErrors.length > 0) {
      Alert.alert('Formulaire incomplet', validationErrors.join('\n'));
      return;
    }

    setIsLoading(true);

    try {
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
        await userRef.update(userData);
      } else {
        userData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await userRef.set(userData);
      }

      const offresSnapshot = await firebase.firestore().collection('offres').get();
      const batch = firebase.firestore().batch();

      offresSnapshot.forEach((offreDoc) => {
        const offreEtatRef = userRef.collection('offres_etats').doc(offreDoc.id);
        batch.set(offreEtatRef, {
          etat: false,
          offreId: offreDoc.id,
        });
      });

      await batch.commit();

      Alert.alert('Inscription réussie', 'Votre profil a été mis à jour.', [
        { text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'offres' }) },
      ]);
    } catch (error) {
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

      <TouchableOpacity
        style={[styles.selectButton, age && styles.selectedShadow]}
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

      <TouchableOpacity
        style={[styles.selectButton, sexe && styles.selectedShadow]}
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

      <TouchableOpacity
        style={[styles.selectButton, status && styles.selectedShadow]}
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 150,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF4081',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  salut: {
    fontSize: 40,
    color: '#333',
  },
  selectButton: {
    width: '100%',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  selectedShadow: {
    shadowColor: '#4A90E2',
    shadowOpacity: 0.7,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  finishButton: {
    marginTop: 40,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#AAA',
    alignItems: 'center',
  },
  activeFinishButton: {
    backgroundColor: '#FF4081',
  },
  finishButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Telephone5;
