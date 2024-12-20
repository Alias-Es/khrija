import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

const Telephone3 = ({ navigation }) => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const buttonPositionAnimated = useRef(new Animated.Value(20)).current;

  // Définir l'offset du bouton au-dessus du clavier (en pixels)
  const BUTTON_OFFSET = 20;

  useEffect(() => {
    // Définir les événements en fonction de la plateforme
    const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShowListener = Keyboard.addListener(keyboardShowEvent, (event) => {
      const keyboardHeight = event.endCoordinates ? event.endCoordinates.height : 0;
      console.log('Keyboard Height:', keyboardHeight); // Pour débogage

      // Calculer la position finale du bouton : hauteur du clavier + offset
      const toValue = keyboardHeight + BUTTON_OFFSET;

      Animated.timing(buttonPositionAnimated, {
        toValue: toValue,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    const keyboardHideListener = Keyboard.addListener(keyboardHideEvent, () => {
      Animated.timing(buttonPositionAnimated, {
        toValue: 20, // Position initiale du bouton
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [buttonPositionAnimated]);

  const handleContinue = () => {
    if (!prenom.trim() || !nom.trim()) {
      Alert.alert(
        'Erreur',
        'Veuillez entrer à la fois votre prénom et votre nom avant de continuer.'
      );
      return;
    }

    // Passe les informations nécessaires à Telephone4
    navigation.navigate('telephone4', { prenom, nom });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>Vos informations</Text>
        <Text style={styles.subtitle}>Nous aimerions en savoir plus sur vous.</Text>

        <TextInput
          style={styles.input}
          placeholder="Entrez votre prénom"
          value={prenom}
          onChangeText={setPrenom}
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={styles.input}
          placeholder="Entrez votre nom"
          value={nom}
          onChangeText={setNom}
          placeholderTextColor="#aaa"
        />

        <Animated.View
          style={[
            styles.submitButtonContainer,
            { bottom: buttonPositionAnimated },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!prenom.trim() || !nom.trim()) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!prenom.trim() || !nom.trim()}
          >
            <Text style={styles.submitButtonText}>Suivant</Text>
          </TouchableOpacity>
        </Animated.View>
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
    // Attention avec le marginTop négatif, cela peut causer des problèmes sur certains appareils
    // marginTop: -80,
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
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    // paddingLeft: 20, // Vous pouvez enlever ou ajuster si nécessaire
  },
  submitButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '90%',
    // bottom: 60, // Déjà géré par l'animation
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

export default Telephone3;
