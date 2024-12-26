import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LanguageContext } from '../LanguageContext';

const Karta = () => {
  const [userInfo, setUserInfo] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const opacity = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();
  const { language, translations } = useContext(LanguageContext);
  const t = (key) => translations[language][key];

  const fetchUserInfo = async () => {
    setLoading(true);
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setUserInfo({
            ...data,
            nom: data[`nom${language === 'en' ? 'EN' : ''}`] || data.nom,
            prenom: data[`prenom${language === 'en' ? 'EN' : ''}`] || data.prenom,
            dateNaissance: data[`dateNaissance${language === 'en' ? 'EN' : ''}`] || data.dateNaissance,
            email: data[`email${language === 'en' ? 'EN' : ''}`] || data.email,
          });
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error(t('fetchUserError'), error);
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserInfo();
  }, [language]);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [language])
  );

  useEffect(() => {
    if (!loading) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  const hasActiveSubscription = userInfo?.abonnement_actif ?? false;
  const nom = userInfo?.nom || t('defaultLastName');
  const prenom = userInfo?.prenom || t('defaultFirstName');
  const dateNaissance = userInfo?.dateNaissance ? `${userInfo.dateNaissance} ${t('years')}` : t('unknownAge');
  const email = userInfo?.email || t('defaultEmail');

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>KHRIJA</Text>
      </View>

      {/* Ajout de la mention "Ma Carte Khrija" */}
      <Text style={styles.cardTitle}>{t('myCardTitle')}</Text>

      <Animated.View style={[styles.card, { opacity }]}>
        <Text style={styles.watermark}>KHRIJA</Text>
        <Image
          source={require('../assets/images/inconnue.png')}
          style={styles.profileImage}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{nom}</Text>
          <Text style={styles.firstName}>{prenom}</Text>
          <Text style={styles.details}>{dateNaissance}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.details}>{t('expiryDate')} 2024-10-26</Text>
        </View>

        {!hasActiveSubscription && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>
              🔒  {t('subscribePrompt')}
            </Text>
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => navigation.navigate('mdpOublier')}
            >
              <Text style={styles.subscribeButtonText}>{t('subscribeButtonText')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* Bouton pour modifier les informations, visible si un utilisateur est connecté */}
      {userInfo !== null && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditUserInfo')} // Navigue vers la page de modification
        >
          <Text style={styles.editButtonText}>{t('editInfoButtonText')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  logoContainer: {
    position: 'absolute',
    top: 65,
    alignItems: 'center',
  },
  logo: {
    fontSize: 90,
    fontFamily: 'ChauPhilomeneOne',
    color: '#FF4081',
  },
  cardTitle: {
    fontSize: 27,
    color: '#4A90E2',
    marginBottom: 25,
    textAlign: 'center',
    fontFamily: 'ChauPhilomeneOne',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A2D2FF',
    borderRadius: 15,
    padding: 30,
    width: '90%',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    fontSize: 90,
    color: 'rgba(233, 30, 99, 0.1)',
    fontFamily: 'ChauPhilomeneOne',
    textAlign: 'center',
    top: '50%',
    left: '55%',
    transform: [{ translateX: -50 }, { translateY: -40 }],
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    marginRight: 15,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  firstName: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  details: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
  email: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 24,
    fontFamily: 'ChauPhilomeneOne',
  },
  subscribeButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    paddingHorizontal: 90,
    borderRadius: 25,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Karta;
