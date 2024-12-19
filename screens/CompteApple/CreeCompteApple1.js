import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreeCompteApple = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const userId = route.params?.userId;

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const buttonPositionAnimated = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      'keyboardWillShow',
      (event) => {
        Animated.timing(buttonPositionAnimated, {
          toValue: event.endCoordinates.height - 34,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        Animated.timing(buttonPositionAnimated, {
          toValue: 20,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const handleContinue = () => {
    if (!nom.trim() || !prenom.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom et prénom pour continuer.');
      return;
    }

    navigation.navigate('CreeCompteApple4', { userId, nom, prenom });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>Créer votre compte</Text>
        <Text style={styles.subtitle}>Entrez vos informations pour continuer.</Text>

        <TextInput
          style={styles.input}
          placeholder="Entrez votre nom"
          value={nom}
          onChangeText={setNom}
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={styles.input}
          placeholder="Entrez votre prénom"
          value={prenom}
          onChangeText={setPrenom}
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
              (!nom.trim() || !prenom.trim()) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!nom.trim() || !prenom.trim()}
          >
            <Text style={styles.submitButtonText}>Continuer</Text>
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
    marginTop: -80,
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
    paddingLeft: 20,
  },
  submitButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '90%',
    bottom: 60,
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

export default CreeCompteApple;
