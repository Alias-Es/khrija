import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { firebase } from './FirebaseConfig';
import SplashScreen from './splashScreen';

// Importez vos écrans
import Dkhla from './screens/dkhla';
import decouvrire from './screens/decouvrire';
import ntconnecta from './screens/ntconnecta';
import nt9eyd from './screens/nt9eyd';
import Offres from './screens/offres';
import Karta from './screens/karta';
import detailleOffres from './screens/detailleOffres';
import ntabonna from './screens/ntabonna';
import monAbonnement from './screens/monAbonnement';
import Compte from './screens/compte';
import NavBar from './NavBar';
import mdpOublier from './screens/mdpOublier';
import VerificationCodePage from './screens/VerificationCodePage';

enableScreens(); // Active les optimisations de performance pour les transitions d'écran

const Stack = createStackNavigator();

function App() {
  const [activeTab, setActiveTab] = useState('offres');
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (isSplashLoading) {
    return <SplashScreen />;
  }

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal', // Permet le geste horizontal pour le retour en arrière
            animationEnabled: true, // Active l'animation de transition
          }}
        >
          <Stack.Screen name="offres" component={Offres} options={{ gestureEnabled: true }} />
          <Stack.Screen name="ntabonna" component={ntabonna} />
          <Stack.Screen name="detailleOffres" component={detailleOffres} />
          <Stack.Screen name="monAbonnement" component={monAbonnement} />
          <Stack.Screen name="mdpOublier" component={mdpOublier} />
          <Stack.Screen name="dkhla" component={Dkhla} options={{ gestureEnabled: true }} />
          <Stack.Screen name="decouvrire" component={decouvrire} />
          <Stack.Screen name="ntconnecta" component={ntconnecta} />
          <Stack.Screen name="VerificationCodePage" component={VerificationCodePage} />
          <Stack.Screen name="nt9eyd" component={nt9eyd} />
          <Stack.Screen
            name="compte"
            component={Compte}
            options={{
              gestureEnabled: true,
              cardStyleInterpolator: ({ current, layouts }) => ({
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-layouts.screen.width, 0], // De droite à gauche
                      }),
                    },
                  ],
                },
              }),
            }}
          />
          <Stack.Screen
            name="karta"
            component={Karta}
            options={{
              gestureEnabled: true,
              cardStyleInterpolator: ({ current, layouts }) => ({
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0], // De gauche à droite
                      }),
                    },
                  ],
                },
              }),
            }}
          />
        </Stack.Navigator>
        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
