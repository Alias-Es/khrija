import React, { useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const CustomSwipeButton = ({ onSwipeComplete, swipeValidated }) => {
  const SWIPE_WIDTH = 320; // Largeur totale du rail
  const THUMB_SIZE = 60; // Taille du pouce
  const SWIPE_THRESHOLD = SWIPE_WIDTH - THUMB_SIZE - 20; // Seuil pour valider le swipe

  const [swiped, setSwiped] = useState(false); // État local pour gérer le swipe
  const translateX = new Animated.Value(0); // Position animée du pouce

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX > SWIPE_THRESHOLD) {
        // Valider le swipe
        Animated.timing(translateX, {
          toValue: SWIPE_WIDTH - THUMB_SIZE,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setSwiped(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Retour haptique
          onSwipeComplete(); // Informer le composant parent
        });
      } else {
        // Ramener le pouce à la position initiale si le seuil n'est pas atteint
        Animated.spring(translateX, {
          toValue: 0,
          friction: 5,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.swipeContainer, { width: SWIPE_WIDTH }]}>
        {/* Rail avec dégradé */}
        <Animated.View
          style={[
            styles.rail,
            {
              backgroundColor: translateX.interpolate({
                inputRange: [0, SWIPE_WIDTH - THUMB_SIZE],
                outputRange: ['#D3D3D3', '#4CAF50'], // Dégradé dynamique
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
        {/* Texte */}
        <Text style={styles.title}>
          {swiped || swipeValidated ? 'Offre déjà utilisée' : 'Glissez pour valider'}
        </Text>
        {/* Pouce avec gestionnaire de gestes */}
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          enabled={!swiped && !swipeValidated} // Désactiver le swipe après validation
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [
                  {
                    translateX: translateX.interpolate({
                      inputRange: [0, SWIPE_WIDTH - THUMB_SIZE],
                      outputRange: [0, SWIPE_WIDTH - THUMB_SIZE],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.thumbText}>→</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  swipeContainer: {
    height: 70,
    backgroundColor: '#E0E0E0',
    borderRadius: 35,
    overflow: 'hidden',
    justifyContent: 'center',
    position: 'relative',
  },
  rail: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 35,
    opacity: 0.8,
  },
  title: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  thumb: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 60 / 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#757575',
  },
});

export default CustomSwipeButton;
