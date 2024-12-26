import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native';
import SubmitButton from '../../components/boutonSuivant'; // Bouton réutilisable
import Fleche from '../../components/fleche'; // Composant Fleche
import { LanguageContext } from '../../LanguageContext'; // Contexte de langue

const Telephone3 = ({ navigation }) => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const buttonPositionAnimated = useRef(new Animated.Value(0)).current;
  const { translations, language } = useContext(LanguageContext);
  const t = (key) => translations[language][key];

  const handleContinue = () => {
    if (!prenom.trim() || !nom.trim()) {
      alert(t('error') + ': ' + t('enterFirstNameAndLastName'));
      return;
    }
    navigation.navigate('telephone4', { prenom, nom });
  };

  // Animation liée au clavier
  React.useEffect(() => {
    const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(keyboardShowEvent, (event) => {
      const keyboardHeight = event.endCoordinates?.height || 0;
      Animated.timing(buttonPositionAnimated, {
        toValue: -keyboardHeight + 40,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    const hideListener = Keyboard.addListener(keyboardHideEvent, () => {
      Animated.timing(buttonPositionAnimated, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [buttonPositionAnimated]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Composant Fleche */}
        <Fleche onPress={() => navigation.goBack()} />
        
        {/* Titre principal */}
        <Text style={styles.title}>{t('yourInformation')}</Text>

        {/* Sous-titre ajouté */}
        <Text style={styles.subtitle}>{t('enterYourInfo')}</Text>

        {/* Champs de texte */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('enterFirstName')}
            placeholderTextColor="#aaa"
            value={prenom}
            onChangeText={setPrenom}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('enterLastName')}
            placeholderTextColor="#aaa"
            value={nom}
            onChangeText={setNom}
          />
        </View>


        {/* Bouton soumettre */}
        <SubmitButton
          onPress={handleContinue}
          disabled={!prenom.trim() || !nom.trim()}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    height: 50,
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Telephone3;
