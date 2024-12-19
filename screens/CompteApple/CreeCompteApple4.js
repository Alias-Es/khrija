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
import { Ionicons } from '@expo/vector-icons'; // Importer les icônes si nécessaire
import AgePickerModal from '../../components/AgePickerModal';
import SexePickerModal from '../../components/SexePickerModal';
import StatusPickerModal from '../../components/StatusPickerModal';
import { firebase } from '../../FirebaseConfig';

const CreeCompteApple4 = () => {
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
  const [statusModalVisible, setStatusModalVisible] =useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = age && sexe && status;

  const handleFinish = async () => {
    // Validation et logique d'inscription (inchangée)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KHRIJA</Text>
      <Text style={styles.subtitle}>
        Bonjour <Text style={styles.firstName}>{prenom || 'Utilisateur'}</Text>, finalisez votre profil :
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
            {age ? `Âge : ${age} ans` : 'Sélectionnez votre âge'}
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
            {sexe ? `Sexe : ${sexe}` : 'Sélectionnez votre sexe'}
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
            {status ? `Statut : ${status}` : 'Sélectionnez votre statut'}
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
    fontSize: 19,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
   firstName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#E91E63', // Utilisation de la couleur principale de l'application
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

export default CreeCompteApple4;
