import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Karta = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const opacity = new Animated.Value(0); // Opacité pour l'animation de fade-in
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        try {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            setUserInfo(userDoc.data());
          } else {
            console.log("Document de l'utilisateur non trouvé !");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des informations de l'utilisateur:", error);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  // Démarre l'animation de fade-in quand les données sont chargées
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

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>KHRIJA</Text>
      </View>

      <Animated.View style={[styles.card, { opacity }]}>
        <Text style={styles.watermark}>KHRIJA</Text>
        <Image
          source={require('../assets/images/inconnue.png')}
          style={styles.profileImage}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{userInfo?.nom || 'Nom de famille'}</Text>
          <Text style={styles.firstName}>{userInfo?.prenom || 'Prénom'}</Text>
          <Text style={styles.details}>
            {userInfo?.dateNaissance ? `${userInfo.dateNaissance} ans` : 'Âge inconnu'}
          </Text>
          <Text style={styles.email}>{userInfo?.email || 'exemple@email.com'}</Text>
          <Text style={styles.details}>Expire le 2024-10-26</Text>
        </View>

        {!userInfo?.abonnement_actif && (
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.subscribeButton} onPress={() => navigation.navigate('ntconnecta')}>
              <Text style={styles.subscribeButtonText}>M'ABONNER</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
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
    fontWeight: 'bold',
    color: '#E91E63',
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
    color: '#FFFFFF', // Highlight color for email
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
  subscribeButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Karta;
