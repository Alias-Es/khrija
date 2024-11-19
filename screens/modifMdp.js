import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ModifMdp = ({ route, navigation }) => {
  const { email } = route.params; // Récupère l'email passé via le lien
  const [newPassword, setNewPassword] = React.useState('');

  const handlePasswordChange = () => {
    console.log(`Changer le mot de passe pour : ${email}`);
    // Ajouter la logique pour enregistrer le nouveau mot de passe
    alert(`Mot de passe mis à jour pour : ${email}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Réinitialiser le mot de passe pour :</Text>
      <Text style={styles.email}>{email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre nouveau mot de passe"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Button title="Mettre à jour" onPress={handlePasswordChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default ModifMdp;
