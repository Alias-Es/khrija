import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Icônes
import AgePickerModal from '../../components/AgePickerModal';
import SexePickerModal from '../../components/SexePickerModal';
import StatusPickerModal from '../../components/StatusPickerModal';
import { firebase } from '../../FirebaseConfig';
import { LanguageContext } from '../../LanguageContext'; // Import du contexte de langue

const Telephone5 = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { nom, prenom } = route.params || {}; // Suppression de userId des params

  const [userId, setUserId] = useState(null);
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

  const { translations, language } = useContext(LanguageContext); // Utilisation du contexte de langue
  const t = (key) => translations[language][key]; // Fonction de traduction

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    } else {
      Alert.alert(t('error'), t('notAuthenticated'));
      navigation.navigate('telephone1'); // Redirige vers une page de connexion
    }
  }, [navigation]);

  const isFormValid = age && sexe && status;

  const validateUserData = useCallback(() => {
    const errors = [];
    if (!userId) errors.push(t('missingUserId'));
    if (!age) errors.push(t('missingAge'));
    if (!sexe) errors.push(t('missingSex'));
    if (!status) errors.push(t('missingStatus'));
    return errors;
  }, [userId, age, sexe, status]);

  const handleFinish = async () => {
    const validationErrors = validateUserData();
    if (validationErrors.length > 0) {
      Alert.alert(t('incompleteForm'), validationErrors.join('\n'));
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

      Alert.alert(t('registrationSuccess'), t('profileUpdated'), [
        { text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'offres' }) },
      ]);
    } catch (error) {
      Alert.alert(t('error'), `${t('errorOccurred')}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('appName')}</Text>
      <Text style={styles.subtitle}>
        {t('hello')} <Text style={styles.firstName}>{prenom || t('user')}</Text>, {t('completeProfile')}
      </Text>

      {/* Sélection de l'âge */}
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          setTempAge(age);
          setAgeModalVisible(true);
        }}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.selectButtonText}>
            {age ? `${t('age')}: ${age} ${t('years')}` : t('selectAge')}
          </Text>
          {age && <Ionicons name="checkmark-circle" size={24} color="green" />}
        </View>
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
        <View style={styles.buttonContent}>
          <Text style={styles.selectButtonText}>
            {sexe ? `${t('sex')}: ${sexe}` : t('selectSex')}
          </Text>
          {sexe && <Ionicons name="checkmark-circle" size={24} color="green" />}
        </View>
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
        <View style={styles.buttonContent}>
          <Text style={styles.selectButtonText}>
            {status ? `${t('status')}: ${status}` : t('selectStatus')}
          </Text>
          {status && <Ionicons name="checkmark-circle" size={24} color="green" />}
        </View>
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
          <Text style={styles.finishButtonText}>{t('createProfile')}</Text>
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
    
    color: '#E91E63',
    marginBottom: 100,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  firstName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#E91E63',
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
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
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

export default Telephone5;
