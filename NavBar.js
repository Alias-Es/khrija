import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NavBar({ activeTab, setActiveTab }) {
  const navigation = useNavigation();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          setActiveTab('compte');
          navigation.navigate('compte');
        }}
      >
        <FontAwesome5 name="user" size={24} color={activeTab === 'compte' ? '#FF4081' : '#75B3EB'} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          setActiveTab('offres');
          navigation.navigate('offres');
        }}
      >
        <FontAwesome5 name="gift" size={24} color={activeTab === 'offres' ? '#FF4081' : '#75B3EB'} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          setActiveTab('karta');
          navigation.navigate('karta');
        }}
      >
        <FontAwesome5 name="credit-card" size={24} color={activeTab === 'karta' ? '#FF4081' : '#75B3EB'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingTop: 10,
    paddingVertical: 40,
  },
  navItem: {
    flex: 1, // Chaque bouton occupe un espace égal dans la barre
    alignItems: 'center', // Centre le contenu horizontalement
    justifyContent: 'center', // Centre le contenu verticalement
    paddingVertical: 10, // Limite la taille cliquable
  
  },
});
