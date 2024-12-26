import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQ() {
  const [expanded, setExpanded] = useState(null);
  const navigation = useNavigation();

  // Charger la police
  const [fontsLoaded] = useFonts({
    'ChauPhilomeneOne': require('../assets/fonts/ChauPhilomeneOne.ttf'),
  });

  // Masquer le splash screen quand les polices sont chargées
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === index ? null : index);
  };

  const questions = [
    {
      question: "Comment avoir accès à Khrija ?",
      answer: "Téléchargez l'application Khrija et connectez-vous avec votre compte Gmail ou votre numéro de téléphone. Facile, rapide, et sécurisé !",
    },
    {
      question: "Comment profiter des offres ?",
      answer: "C'est simple :\n\n- Une offre ponctuelle (en rose) : Cliquez sur \"Utiliser l'offre\" à côté d'un membre du staff. Attention, cette offre n'est valable qu'une fois !\n\n- Une offre permanente (en bleu) : Cliquez sur \"Montrer ma carte\" à côté d'un membre du staff. C'est tout !",
    },
    {
      question: "Quels sont les prix des abonnements ?",
      answer: "L'abonnement mensuel coûte 25 DH, et l'abonnement annuel est proposé à un tarif réduit. Consultez l'application pour plus de détails !",
    },
    {
      question: "Dans quelles villes Khrija est-elle disponible ?",
      answer: "Actuellement, Khrija est disponible dans Rabat. Mais restez à l'écoute, nous nous étendons rapidement !",
    },
    {
      question: "Puis-je rejoindre l'équipe Khrija ?",
      answer: "Bien sûr ! Si vous êtes motivé(e) et souhaitez contribuer à notre projet, envoyez-nous votre CV à ali-essaadaoui@khrija.ma. Nous serons ravis de vous accueillir !",
    },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {/* Flèche retour */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FF4081" />
      </TouchableOpacity>

      <Text style={styles.header}>Foire Aux Questions (FAQ)</Text>
      <ScrollView>
        {questions.map((item, index) => (
          <View key={index} style={styles.item}>
            <TouchableOpacity
              style={styles.questionContainer}
              onPress={() => toggleExpand(index)}
            >
              <Text style={styles.question}>{item.question}</Text>
              <Ionicons
                name={expanded === index ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#FF4081"
              />
            </TouchableOpacity>
            {expanded === index && <Text style={styles.answer}>{item.answer}</Text>}
            <View style={styles.separator} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 8,
    elevation: 3, // Effet d'ombre sur Android
    shadowColor: '#000', // Effet d'ombre sur iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF4081',
    marginTop: 60,
    marginBottom: 50,
  },
  item: {
    marginBottom: 10,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  answer: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: '#FF4081',
    marginTop: 10,
  },
});
