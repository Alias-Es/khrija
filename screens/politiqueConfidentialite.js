import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Flèche retour */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <Text style={styles.header}>Politique de Confidentialité pour Khrija</Text>
        <Text style={styles.lastUpdated}>Dernière mise à jour : 25 décembre 2024</Text>

        <Text style={styles.sectionHeader}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Chez Khrija, nous accordons une grande importance à la protection de vos données personnelles. Cette Politique de Confidentialité explique comment nous collectons, utilisons, et protégeons vos informations lorsque vous utilisez notre application.
        </Text>

        <Text style={styles.sectionHeader}>2. Données Collectées</Text>
        <Text style={styles.subHeader}>2.1 Données Personnelles</Text>
        <Text style={styles.paragraph}>
          - Adresse e-mail, nom, prénom, numéro de téléphone (lors de la création de votre compte).
          - Données nécessaires pour valider les abonnements (certificat de scolarité pour les étudiants si applicable).
        </Text>
        <Text style={styles.subHeader}>2.2 Données d'Utilisation</Text>
        <Text style={styles.paragraph}>
          - Informations techniques comme l'adresse IP, le type de navigateur, la version de l'application, et les interactions avec l'application.
        </Text>

        <Text style={styles.sectionHeader}>3. Utilisation des Données</Text>
        <Text style={styles.paragraph}>
          - Fournir et maintenir les services Khrija.
          - Gérer votre compte utilisateur et vos abonnements.
          - Envoyer des notifications concernant les mises à jour ou des offres spéciales.
          - Analyser et améliorer les fonctionnalités de l'application.
        </Text>

        <Text style={styles.sectionHeader}>4. Partage des Données</Text>
        <Text style={styles.paragraph}>
          Vos données personnelles peuvent être partagées avec :
          - Des prestataires de services pour gérer les paiements (par exemple, le Centre Monétique Interbancaire).
          - Des partenaires pour des offres promotionnelles, uniquement avec votre consentement.
          - Les autorités, si requis par la loi.
        </Text>

        <Text style={styles.sectionHeader}>5. Conservation des Données</Text>
        <Text style={styles.paragraph}>
          Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services, répondre à nos obligations légales, résoudre des litiges, et appliquer nos politiques.
        </Text>

        <Text style={styles.sectionHeader}>6. Sécurité</Text>
        <Text style={styles.paragraph}>
          Nous utilisons des mesures techniques et organisationnelles appropriées pour protéger vos données contre les accès non autorisés, les pertes ou les altérations.
        </Text>

        <Text style={styles.sectionHeader}>7. Vos Droits</Text>
        <Text style={styles.paragraph}>
          Conformément à la loi, vous disposez de droits concernant vos données personnelles :
          - Accéder à vos données.
          - Les corriger ou les mettre à jour.
          - Demander leur suppression.
          Pour exercer ces droits, contactez-nous à l'adresse ci-dessous.
        </Text>

        <Text style={styles.sectionHeader}>8. Modifications</Text>
        <Text style={styles.paragraph}>
          Nous pouvons mettre à jour cette Politique de Confidentialité. Toute modification sera publiée sur cette page avec une date de mise à jour.
        </Text>

        <Text style={styles.sectionHeader}>9. Contact</Text>
        <Text style={styles.paragraph}>
          Pour toute question ou demande concernant cette Politique de Confidentialité, veuillez nous contacter :
          - E-mail : ali-essaadaoui@khrija.ma
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    padding: 20,
    paddingTop: 120,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default PrivacyPolicy;
