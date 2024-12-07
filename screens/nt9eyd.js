import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AgePickerModal from '../components/AgePickerModal';
import SexePickerModal from '../components/SexePickerModal';
import StatusPickerModal from '../components/StatusPickerModal';

const CreeCompteApple4 = () => {
  const [age, setAge] = useState(null);
  const [tempAge, setTempAge] = useState(null);
  const [sexe, setSexe] = useState(null);
  const [tempSexe, setTempSexe] = useState(null);
  const [status, setStatus] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [sexeModalVisible, setSexeModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const handleFinish = () => {
    if (!age || !sexe || !status) {
      Alert.alert('Erreur', 'Veuillez sélectionner un âge, un sexe et un statut.');
      return;
    }
    Alert.alert('Succès', `Âge : ${age} ans, Sexe : ${sexe}, Statut : ${status}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KHRIJA</Text>
      <Text style={styles.subtitle}>Créez votre profil pour commencer :</Text>

      {/* Bouton pour sélectionner l'âge */}
      <TouchableOpacity
        style={[styles.selectButton, age && styles.selectedButton]}
        onPress={() => {
          setTempAge(age);
          setAgeModalVisible(true);
        }}
      >
        <Text style={[styles.selectButtonText, age && styles.selectedButtonText]}>
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

      {/* Bouton pour sélectionner le sexe */}
      <TouchableOpacity
        style={[styles.selectButton, sexe && styles.selectedButton]}
        onPress={() => {
          setTempSexe(sexe);
          setSexeModalVisible(true);
        }}
      >
        <Text style={[styles.selectButtonText, sexe && styles.selectedButtonText]}>
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

      {/* Bouton pour sélectionner le statut */}
      <TouchableOpacity
        style={[styles.selectButton, status && styles.selectedButton]}
        onPress={() => {
          setTempStatus(status);
          setStatusModalVisible(true);
        }}
      >
        <Text style={[styles.selectButtonText, status && styles.selectedButtonText]}>
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

      {/* Bouton pour finaliser */}
      <TouchableOpacity
        style={[
          styles.finishButton,
          age && sexe && status ? styles.activeFinishButton : null,
        ]}
        onPress={handleFinish}
        disabled={!age || !sexe || !status}
      >
        <Text style={styles.finishButtonText}>Créer mon profil</Text>
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
    transition: 'all 0.3s',
  },
  selectedButton: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  selectButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#FFF',
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
