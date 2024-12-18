import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assurez-vous que cette librairie est installée : expo install @expo/vector-icons
import { useNavigation } from '@react-navigation/native';

const BackArrow = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Ionicons name="chevron-back" size={50} color="#7D7D7D" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // Légèrement plus éloigné du haut
    left: 0, // Ajustez cette valeur pour le positionnement horizontal
  },
  button: {
    backgroundColor: 'transparent', // Fond transparent
    borderRadius: 50, // Ajout d'un arrondi si besoin
    padding: 16, // Ajoutez un peu plus d'espace autour de l'icône
  },
  icon: {
    fontWeight: '600', // Légèrement plus gras
  },
});

export default BackArrow;
