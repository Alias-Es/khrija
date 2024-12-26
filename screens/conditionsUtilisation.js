import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const TermsOfUse = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      {/* Flèche de retour */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Contenu */}
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Conditions d'Utilisation pour Khrija</Text>
        <Text style={styles.lastUpdated}>Dernière mise à jour : 25 décembre 2024</Text>

        <Text style={styles.sectionHeader}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Bienvenue sur Khrija. En utilisant notre application, vous acceptez de respecter ces Conditions d’Utilisation. Si vous n’êtes pas d’accord avec ces termes, veuillez ne pas utiliser notre service.
          Khrija est une application qui propose à ses utilisateurs des abonnements donnant accès à des offres avantageuses dans les domaines de la restauration, du sport, de la culture, du bien-être et du shopping.
        </Text>

        <Text style={styles.sectionHeader}>2. Utilisation de l'Application</Text>
        <Text style={styles.subHeader}>2.1 Inscription et Éligibilité</Text>
        <Text style={styles.paragraph}>
          - L’utilisation de Khrija nécessite la création d’un compte utilisateur.
          - Pour créer un compte, les utilisateurs doivent fournir une adresse e-mail valide, un mot de passe, un nom, et un prénom.
          - Les utilisateurs doivent avoir au moins 18 ans pour s’inscrire. Toutefois, des étudiants mineurs peuvent s'inscrire avec une vérification de certificat de scolarité.
        </Text>
        <Text style={styles.subHeader}>2.2 Restrictions d'Utilisation</Text>
        <Text style={styles.paragraph}>
          - Les utilisateurs ne doivent pas utiliser l’application à des fins illégales ou non autorisées.
          - Il est interdit de partager ou d’utiliser des comptes multiples sans autorisation.
          - Les utilisateurs ne peuvent pas tenter d'accéder à des parties de l’application pour lesquelles ils ne disposent pas d’autorisations.
        </Text>

        <Text style={styles.sectionHeader}>3. Offres et Abonnements</Text>
        <Text style={styles.subHeader}>3.1 Types d’Offres</Text>
        <Text style={styles.paragraph}>
          - Offres découverte : utilisables une seule fois. Ces offres peuvent inclure des codes promotionnels spécifiques fournis par l'application ou ses partenaires pour accéder à des réductions ou avantages exclusifs.
          - Offres permanentes : accessibles en continu tant que l’abonnement est actif.
        </Text>
        <Text style={styles.subHeader}>3.2 Codes Promotionnels</Text>
        <Text style={styles.paragraph}>
          - Les codes promotionnels pour les offres découverte sont soumis à des conditions spécifiques, telles que des dates d’expiration, des limites d’utilisation, ou des restrictions géographiques.
          - Un code promotionnel ne peut être utilisé qu’une seule fois par utilisateur, sauf indication contraire.
          - Khrija se réserve le droit de désactiver tout code promotionnel en cas d’utilisation abusive ou de fraude.
        </Text>
        <Text style={styles.subHeader}>3.3 Paiements</Text>
        <Text style={styles.paragraph}>
          - Les abonnements sont payants. Les prix sont indiqués en dirhams marocains (MAD).
          - Les paiements sont gérés via le Centre Monétique Interbancaire (CMI).
          - Les abonnements sont mensuels ou annuels, et les montants exacts sont affichés dans l’application.
          - L'abonnement mensuel est renouvelé automatiquement à chaque échéance. Il incombe à l'utilisateur de résilier son abonnement s'il ne souhaite plus bénéficier du service.
        </Text>
        <Text style={styles.subHeader}>3.4 Remboursements</Text>
        <Text style={styles.paragraph}>
          - Aucun remboursement n’est offert pour les abonnements, sauf en cas de problème technique avéré et non résolu par notre équipe.
        </Text>

        <Text style={styles.sectionHeader}>4. Propriété Intellectuelle</Text>
        <Text style={styles.paragraph}>
          - Tous les contenus, logos, designs et logiciels de Khrija sont la propriété exclusive de la Société.
          - Toute reproduction, distribution ou modification non autorisée est strictement interdite.
        </Text>

        <Text style={styles.sectionHeader}>5. Contenu des Utilisateurs</Text>
        <Text style={styles.paragraph}>
          - Les utilisateurs ne peuvent pas publier ou partager des contenus illicites, offensants, ou qui violent les droits d’autrui.
          - Khrija se réserve le droit de supprimer tout contenu ne respectant pas ces termes.
        </Text>

        <Text style={styles.sectionHeader}>6. Responsabilité et Garanties</Text>
        <Text style={styles.subHeader}>6.1 Limitation de Responsabilité</Text>
        <Text style={styles.paragraph}>
          - Khrija ne garantit pas l’exactitude ou la disponibilité continue des services.
          - La Société ne peut être tenue responsable de dommages directs ou indirects causés par l’utilisation ou l’incapacité d’utiliser le service.
        </Text>
        <Text style={styles.subHeader}>6.2 Garanties</Text>
        <Text style={styles.paragraph}>
          - Les utilisateurs s’engagent à utiliser l’application de manière conforme aux lois applicables.
        </Text>

        <Text style={styles.sectionHeader}>7. Suspension et Résiliation</Text>
        <Text style={styles.paragraph}>
          - Khrija peut suspendre ou résilier un compte utilisateur en cas de violation des présentes conditions ou de comportement abusif.
          - Les utilisateurs peuvent supprimer leur compte à tout moment en contactant notre support.
        </Text>

        <Text style={styles.sectionHeader}>8. Modifications des Conditions</Text>
        <Text style={styles.paragraph}>
          - Khrija se réserve le droit de modifier ces Conditions d’Utilisation à tout moment. Les modifications seront publiées sur l’application et notifiées aux utilisateurs.
        </Text>

        <Text style={styles.sectionHeader}>9. Droit Applicable et Juridiction</Text>
        <Text style={styles.paragraph}>
          - Ces Conditions d’Utilisation sont régies par les lois marocaines.
          - En cas de litige, seuls les tribunaux de Rabat sont compétents.
        </Text>

        <Text style={styles.sectionHeader}>10. Contact</Text>
        <Text style={styles.paragraph}>
          Pour toute question ou assistance concernant ces Conditions d’Utilisation, veuillez nous contacter à :
          - E-mail : ali-essaadaoui@khrija.ma
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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

export default TermsOfUse;
