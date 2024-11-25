import React, { useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CustomSwipeButton = ({ onSwipeComplete, swipeValidated }) => {
  const SWIPE_WIDTH = SCREEN_WIDTH * 0.9; // 90% de la largeur de l'écran
  const THUMB_SIZE = 100; // Taille du pouce augmentée
  const SWIPE_THRESHOLD = SWIPE_WIDTH - THUMB_SIZE - 40; // Seuil ajusté

  const [swiped, setSwiped] = useState(false);
  const translateX = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX > SWIPE_THRESHOLD) {
        Animated.timing(translateX, {
          toValue: SWIPE_WIDTH - THUMB_SIZE,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setSwiped(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onSwipeComplete();
        });
      } else {
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
                outputRange: ['#E0E0E0', '#E91E63'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
        {/* Texte */}
        <Text style={styles.title}>
          {swiped || swipeValidated ? 'Offre validée' : 'Glissez pour valider'}
        </Text>
        {/* Pouce */}
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          enabled={!swiped && !swipeValidated}
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
    height: 80, // Hauteur augmentée
    backgroundColor: '#F0F0F0',
    borderRadius: 40, // Rayon de bordure augmenté
    overflow: 'hidden',
    justifyContent: 'center',
    position: 'relative',
  },
  rail: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    opacity: 0.9,
  },
  title: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#555',
    fontSize: 20, // Police légèrement plus grande
    fontWeight: '600',
  },
  thumb: {
    width: 80, // Taille du pouce augmentée
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 40, // Rayon de bordure ajusté
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E91E63',
    borderWidth: 2,
  },
  thumbText: {
    fontSize: 24, // Texte plus grand
    fontWeight: 'bold',
    color: '#E91E63',
  },
});

export default CustomSwipeButton;