import React, { useState, useEffect, useContext } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator } from 'react-native';

import NavBar from './NavBar';
import SplashScreen from './splashScreen';
import { LanguageProvider, LanguageContext } from './LanguageContext';

// Importez vos écrans
import CreeCompteApple1 from './screens/CompteApple/CreeCompteApple1';
import CreeCompteApple4 from './screens/CompteApple/CreeCompteApple4';
import Dkhla from './screens/dkhla';
import PromoScreen from './screens/PromoScreen';
import decouvrire from './screens/decouvrire';
import ntconnecta from './screens/ntconnecta';
import nt9eyd from './screens/nt9eyd';
import offres from './screens/offres';
import karta from './screens/karta';
import detailleOffres from './screens/detailleOffres';
import ntabonna from './screens/ntabonna';
import monAbonnement from './screens/monAbonnement';
import compte from './screens/compte';
import mdpOublier from './screens/mdpOublier';
import telephone1 from './screens/CompteTelephone/telephone1';
import telephone2 from './screens/CompteTelephone/telephone2';
import telephone3 from './screens/CompteTelephone/telephone3';
import telephone4 from './screens/CompteTelephone/telephone4';
import telephone5 from './screens/CompteTelephone/telephone5';
import VerificationCodePage from './screens/VerificationCodePage';

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { translations, language } = useContext(LanguageContext);

  return (
    <Tab.Navigator
      initialRouteName="offres"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <NavBar {...props} />}
    >
      <Tab.Screen name="compte" component={compte} options={{ title: translations[language].compte }} />
      <Tab.Screen name="offres" component={offres} options={{ title: translations[language].offres }} />
      <Tab.Screen name="karta" component={karta} options={{ title: translations[language].karta }} />
    </Tab.Navigator>
  );
}

function App() {
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setIsSplashLoading(false);
    }, 3000);

    return () => clearTimeout(splashTimeout);
  }, []);

  if (isSplashLoading) {
    return <SplashScreen />;
  }

  return (
    <LanguageProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              animationEnabled: true,
            }}
          >
            <Stack.Screen name="MainTabs" component={MainTabs} />

            {/* Écrans supplémentaires */}
            <Stack.Screen name="detailleOffres" component={detailleOffres} />
            <Stack.Screen name="ntabonna" component={ntabonna} />
            <Stack.Screen name="PromoScreen" component={PromoScreen} />
            <Stack.Screen name="monAbonnement" component={monAbonnement} />
            <Stack.Screen name="mdpOublier" component={mdpOublier} />
            <Stack.Screen name="dkhla" component={Dkhla} />
            <Stack.Screen name="decouvrire" component={decouvrire} />
            <Stack.Screen name="ntconnecta" component={ntconnecta} />
            <Stack.Screen name="VerificationCodePage" component={VerificationCodePage} />
            <Stack.Screen name="nt9eyd" component={nt9eyd} />
            <Stack.Screen name="CreeCompteApple1" component={CreeCompteApple1} />
             <Stack.Screen name="CreeCompteApple4" component={CreeCompteApple4} />
            <Stack.Screen name="telephone1" component={telephone1} />
            <Stack.Screen name="telephone2" component={telephone2} />
            <Stack.Screen name="telephone3" component={telephone3} />
            <Stack.Screen name="telephone4" component={telephone4} />
            <Stack.Screen name="telephone5" component={telephone5} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </LanguageProvider>
  );
}

export default App;
