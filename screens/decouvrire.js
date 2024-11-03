import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Decouvrir = () => {
  const navigation = useNavigation();

  // Données fictives pour les exemples d'offres
  const offres = [
    {
      id: 1,
      titre: 'Offre Découverte',
      description:
        'Profitez de notre offre découverte que vous pouvez utiliser une fois par établissement pour découvrir nos services.',
      image: require('../assets/images/offre_decouverte.jpg'),
    },
    {
      id: 2,
      titre: 'Offre Permanente',
      description:
        'Optez pour notre offre permanente et bénéficiez d\'un accès illimité à nos services dans tous les établissements partenaires.',
      image: require('../assets/images/offre_permanente.jpg'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>KHRIJA</Text>
        <Text style={styles.title}>Découvrez KHRIJA</Text>
        <Text style={styles.subtitle}>
          KHRIJA est une application innovante qui vous offre les meilleures opportunités pour enrichir votre expérience.
        </Text>

      

        <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
        <Text style={styles.sectionText}>
          Avec KHRIJA, vous pouvez explorer une variété d'offres adaptées à vos besoins. Chaque établissement propose une
          offre découverte et une offre permanente.
        </Text>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>Créez votre compte en quelques clics.</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>Choisissez l'offre qui vous convient.</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Profitez des avantages exclusifs de KHRIJA. L'offre découverte est utilisable une seule fois par établissement, tandis que l'offre permanente est illimitée.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Nos Offres</Text>

        {offres.map((offre) => (
          <TouchableOpacity
            key={offre.id}
            style={styles.offerCard}
            onPress={() => navigation.navigate('detailleOffres', { offreId: offre.id })}
          >
            <Image source={offre.image} style={styles.offerImage} />
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>{offre.titre}</Text>
              <Text style={styles.offerDescription}>{offre.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('ntabonna')}>
          <Text style={styles.ctaButtonText}>Rejoignez-nous dès maintenant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
  },
  content: {
    paddingTop: 50, // Ajout de padding en haut
    paddingBottom: 30,
  },
  logo: {
    fontFamily: 'ChauPhilomeneOne', // Assurez-vous que cette police est chargée dans votre projet
    fontSize: 60,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: -15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  heroImage: {
    width: width,
    height: 200,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E91E63', // Utilisation du bleu comme deuxième couleur
    marginLeft: 20,
    marginTop: 30,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    marginHorizontal: 20,
    marginTop: 10,
    lineHeight: 22,
  },
  stepsContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 5,
  },
  stepNumber: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
    flexWrap: 'wrap',
  },
  offerCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  offerImage: {
    width: '100%',
    height: 150,
  },
  offerContent: {
    padding: 15,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63', // Utilisation du bleu pour le titre des offres
    marginBottom: 5,
  },
  offerDescription: {
    fontSize: 14,
    color: '#555',
  },
  ctaButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 50,
    marginVertical: 30,
  },
  ctaButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Decouvrir;
