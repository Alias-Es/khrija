import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function NavBar({ state, navigation }) {
  const [scale] = React.useState({
    offres: new Animated.Value(1),
    compte: new Animated.Value(1),
    karta: new Animated.Value(1),
  });

  useEffect(() => {
    // Synchronise les animations selon l'onglet actif
    const currentTab = state.routeNames[state.index];
    Object.keys(scale).forEach((key) => {
      Animated.spring(scale[key], {
        toValue: key === currentTab.toLowerCase() ? 1.3 : 1, // Agrandir l'onglet actif
        friction: 3,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  const handlePress = (tab) => {
    navigation.navigate(tab); // Naviguer vers l'onglet
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('compte')}
      >
        <Animated.View style={{ transform: [{ scale: scale.compte }] }}>
          <FontAwesome5
            name="user"
            size={25.5}
            color={state.index === 0 ? '#FF4081' : '#75B3EB'}
          />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('offres')}
      >
        <Animated.View style={{ transform: [{ scale: scale.offres }] }}>
          <FontAwesome5
            name="gift"
            size={25.5}
            color={state.index === 1 ? '#FF4081' : '#75B3EB'}
          />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('karta')}
      >
        <Animated.View style={{ transform: [{ scale: scale.karta }] }}>
          <FontAwesome5
            name="credit-card"
            size={25.5}
            color={state.index === 2 ? '#FF4081' : '#75B3EB'}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingTop: 17,
    // Ombre pour la barre de navigation
    shadowColor: '#000', // Couleur de l'ombre
    shadowOffset: { width: 0, height: 5 }, // Décalage de l'ombre
    shadowOpacity: 0.7, // Opacité de l'ombre
    shadowRadius: 10, // Rayon de l'ombre (flou)
    elevation: 5, // Pour Android (équivalent)
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});