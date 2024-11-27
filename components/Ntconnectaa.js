import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../FirebaseConfig';

export default function Ntconnecta() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Connexion Firebase
      await firebase.auth().signInWithEmailAndPassword(email, password);

      // Naviguer directement vers l'onglet "offres"
      navigation.navigate('offres');
    } catch (err) {
      Alert.alert("OUPSS", getErrorMessage(err.code, email));
    }
  };

  const handleGoogleLogin = async () => {
    Alert.alert("Google Login", "Fonctionnalité à implémenter");
  };

  const getErrorMessage = (errorCode, emailEntered) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return "E-mail GHALAT.";
      case 'auth/user-not-found':
        return "Aucun compte trouvé avec cet email.";
      case 'auth/wrong-password':
        return emailEntered ? "mot de passe GHALAT" : "Le mot de passe est incorrect.";
      case 'auth/too-many-requests':
        return "Trop de tentatives. Veuillez réessayer plus tard.";
      default:
        return "Mot de passe GHALAT.";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KHRIJA</Text>
      <Text style={styles.subtitle}>NTCONNECTA</Text>

      <Text style={styles.label}>E-mail *</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Mot de passe *</Text>
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>BSMELLAH</Text>
      </TouchableOpacity>

      <Text style={styles.ouText}>ou</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image source={require('../assets/images/google.png')} style={styles.googleIcon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('nt9eyd')}>
        <Text style={styles.registerText}>BA9E GA3MA 3NDI COMPTE</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('mdpOublier')}>
        <Text style={styles.forgotPassword}>Nssit Mot de passe dyali ?</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>L9eti chi mouchkil bch tconnecta ?</Text>
      <TouchableOpacity>
        <Text style={styles.contactText}>Twassel m3ana !</Text>
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
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FF4081',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#FF4081',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 25,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF4081',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
    width: 250,
    height: 45,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  ouText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  googleButton: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
  },
  forgotPassword: {
    color: '#000000',
    textAlign: 'center',
    marginTop: 10,
  },
  footerText: {
    textAlign: 'center',
    color: '#FF4081',
    marginTop: 30,
  },
  contactText: {
    color: '#FF4081',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
