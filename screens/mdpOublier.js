import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSendEmail = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse e-mail.');
      return;
    }

    try {
      const response = await fetch('https://sendpasswordresetemail-zt7utylc6a-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const text = await response.text();

      if (response.ok) {
        Alert.alert('Succès', 'E-mail de réinitialisation envoyé.');
      } else {
        Alert.alert('Erreur', text);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Adresse e-mail :</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre adresse e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Envoyer" onPress={handleSendEmail} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  label: {
    marginVertical: 8,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});

export default ForgotPassword;
