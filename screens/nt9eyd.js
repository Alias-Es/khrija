import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import { Picker } from '@react-native-picker/picker';

const Nt9eyd = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    age: '',
    motDePasse: '',
  });
  const [isAgePickerVisible, setIsAgePickerVisible] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'VOTRE_EXPO_CLIENT_ID',
    iosClientId: 'VOTRE_IOS_CLIENT_ID',
    androidClientId: 'VOTRE_ANDROID_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);

      firebase
        .auth()
        .signInWithCredential(credential)
        .then((userCredential) => {
          const userId = userCredential.user.uid;
          firebase
            .firestore()
            .collection('users')
            .doc(userId)
            .set(
              {
                prenom: userCredential.user.displayName.split(' ')[0],
                nom: userCredential.user.displayName.split(' ')[1] || '',
                email: userCredential.user.email,
                age: '',
                abonnement_actif: false,
                periode: null,
              },
              { merge: true }
            );
          Alert.alert('Connexion réussie', 'Vous êtes connecté avec Google !');
          navigation.navigate('offres');
        })
        .catch((error) => {
          Alert.alert('Erreur lors de la connexion', error.message);
        });
    }
  }, [response]);

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSignUpWithEmail = async () => {
    const { email, motDePasse, prenom, nom, age } = form;

    if (!prenom || !nom || !email || !motDePasse || !age) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, motDePasse);
      const userId = userCredential.user.uid;

      await firebase.firestore().collection('users').doc(userId).set({
        prenom,
        nom,
        email,
        age,
        abonnement_actif: false,
        periode: null,
      });

      Alert.alert('Inscription réussie', 'Votre compte a été créé avec succès.');
      navigation.navigate('offres');
    } catch (error) {
      Alert.alert("Erreur lors de l'inscription", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <Text style={styles.logo}>KHRIJA</Text>
          <View style={styles.spacer} />
        </View>
        <Text style={styles.subTitle}>NT9EYD</Text>

        <View style={styles.form}>
          {[
            { name: 'prenom', label: 'Prénom', type: 'text' },
            { name: 'nom', label: 'Nom', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'age', label: 'Âge', type: 'picker' },
            { name: 'motDePasse', label: 'Mot de passe', type: 'password' },
          ].map((field, index) => (
            <View style={styles.inputContainer} key={index}>
              <Text style={styles.label}>{field.label} *</Text>
              {field.type !== 'picker' ? (
                <TextInput
                  style={styles.input}
                  placeholder={field.label}
                  value={form[field.name]}
                  onChangeText={(value) => handleInputChange(field.name, value)}
                  secureTextEntry={field.type === 'password'}
                  keyboardType={field.type === 'email' ? 'email-address' : 'default'}
                  autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => setIsAgePickerVisible(true)}
                  style={styles.input}
                >
                  <Text
                    style={{
                      color: form[field.name] ? '#000' : '#888',
                      fontSize: 16,
                    }}
                  >
                    {form[field.name] ? form[field.name] : 'Sélectionnez votre âge'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleSignUpWithEmail}>
            <Text style={styles.buttonText}>M'abonner</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>ou</Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Image source={require('../assets/images/google.png')} style={styles.googleIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal pour le Picker de l'âge */}
      <Modal
        transparent={true}
        visible={isAgePickerVisible}
        animationType="slide"
        onRequestClose={() => setIsAgePickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsAgePickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sélectionnez votre âge</Text>
                <Picker
                  selectedValue={form['age']}
                  onValueChange={(value) => handleInputChange('age', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Sélectionnez votre âge" value="" />
                  {[...Array(9)].map((_, i) => (
                    <Picker.Item key={i} label={`${18 + i}`} value={`${18 + i}`} />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setIsAgePickerVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Valider</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#E91E63',
  },
  logo: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 60,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginLeft: -30,
    marginBottom: -15,
  },
  spacer: {
    flex: 1,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 50,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#FF4081',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
    fontSize: 16,
    color: '#333',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    width: 250,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginVertical: 15,
    fontWeight: 'bold',
  },
  googleButton: {
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  googleIcon: {
    width: 250,
    height: 50,
  },
  // Styles pour le Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#E91E63',
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Nt9eyd;
