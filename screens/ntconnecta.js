import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { firebase } from '../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function Ntconnecta({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigation.replace('offres');
    } catch (err) {
      Alert.alert('Erreur', getErrorMessage(err.code, email));
    }
  };

  const handleGoogleLogin = async () => {
    // Implémentation de la connexion via Google
  };

  const getErrorMessage = (errorCode, emailEntered) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Adresse email invalide.';
      case 'auth/user-not-found':
        return "Aucun compte trouvé avec cet email.";
      case 'auth/wrong-password':
        return emailEntered ? 'Mot de passe incorrect.' : 'Le mot de passe est incorrect.';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Veuillez réessayer plus tard.';
      default:
        return 'Erreur inconnue.';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KHRIJA</Text>
      <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

      {/* Champ Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Adresse email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Champ Mot de passe */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Bouton Connexion */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      {/* Texte OU */}
      <Text style={styles.orText}>ou</Text>

      {/* Bouton Google */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image source={require('../assets/images/google.png')} style={styles.googleIcon} />
      </TouchableOpacity>

      {/* Lien inscription */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Créer un compte</Text>
      </TouchableOpacity>

      {/* Lien mot de passe oublié */}
      <TouchableOpacity onPress={() => navigation.navigate('mdpOublier')}>
        <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF4081',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FF4081',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#888',
  },
  googleButton: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  googleIcon: {
    width: 250,
    height: 45,
  },
  registerText: {
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#FF4081',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});
