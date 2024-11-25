import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

export default function Dkhla() {
  const navigation = useNavigation();

  // Charger la police
  const [fontsLoaded] = useFonts({
    'ChauPhilomeneOne': require('../assets/fonts/ChauPhilomeneOne.ttf'),
  });

  // Masquer le splash screen quand les polices sont chargées
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync(); // Masque le splash screen une fois la police chargée
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Ne rend rien tant que les polices ne sont pas chargées
  }

  return (
    <ImageBackground
      source={require('../assets/images/op.jpeg')} // Assurez-vous que le chemin de l'image est correct
      style={styles.background}
      imageStyle={styles.image}
      onLayout={onLayoutRootView}
    >
      <View style={styles.container}>
        <Text style={styles.title}>KHRIJA</Text>

        {/* Bouton Découvrir */}
        <TouchableOpacity
          style={[styles.button, styles.decouvrireButton]}
          onPress={() => navigation.navigate('decouvrire')}
        >
          <Text style={styles.buttonText}>CHNO HDCH</Text>
        </TouchableOpacity>

        {/* Bouton Ntconnecta */}
        <TouchableOpacity
          style={[styles.button, styles.ntconnectaButton]}
          onPress={() => navigation.navigate('ntconnecta')}
        >
          <Text style={styles.ntconnectaButtonText}>NTCOCNNECTA</Text>
        </TouchableOpacity>

        {/* Bouton Nt9eyd */}
        <TouchableOpacity
          style={[styles.button, styles.nt9eydButton]}
          onPress={() => navigation.navigate('nt9eyd')}
        >
          <Text style={styles.buttonText}>NT9EYD</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 248, 248, 0.7)',
  },
  title: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 90,
    color: '#FF4081',
    fontWeight: 'bold',
    marginBottom: 120,
  },
  button: {
    width: '69%',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  decouvrireButton: {
    backgroundColor: '#FF4081', // Couleur rose pour découvrir
  },
  ntconnectaButton: {
    backgroundColor: 'transparent',
    borderColor: '#FF4081',
    borderWidth: 3,
  },
  nt9eydButton: {
    backgroundColor: '#4A90E2', // Couleur bleue pour NT9EYD
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ntconnectaButtonText: {
    color: '#FF4081',
    fontSize: 16,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
  },
  image: {
    resizeMode: 'cover', // Couvre tout l'écran
  },
});
