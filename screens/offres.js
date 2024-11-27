// ListeOffres.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import OfferCard from '../components/offres/OfferCard';
import CategoriesList from '../components/offres/CategoriesList';
import SearchBar from '../components/offres/SearchBar';

export default function ListeOffres() {
  // Charger la police
  const [fontsLoaded] = useFonts({
    'ChauPhilomeneOne': require('../assets/fonts/ChauPhilomeneOne.ttf'),
  });

  const [searchText, setSearchText] = useState('');
  const [offres, setOffres] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingOffres, setLoadingOffres] = useState(true); // Nouvel état pour le chargement des offres
  const navigation = useNavigation();

  // Nouveaux états pour les données utilisateur
  const [abonnement_actif, setAbonnementActif] = useState(true); // Par défaut true
  const [offres_etats, setOffresEtats] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false); // Indicateur de chargement des données utilisateur

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.log("Aucun utilisateur connecté.");
      setDataLoaded(true);
      setLoadingOffres(false);
      setLoadingCategories(false);
      return;
    }

    const userId = user.uid;
    const userDocRef = firebase.firestore().collection('users').doc(userId);
    const offresEtatsRef = userDocRef.collection('offres_etats');

    // Écouter les modifications du document utilisateur pour abonnement_actif
    const unsubscribeUser = userDocRef.onSnapshot(doc => {
      if (doc.exists) {
        const userData = doc.data();
        setAbonnementActif(userData.abonnement_actif);
      } else {
        console.log("Aucun utilisateur trouvé avec cet ID.");
      }
    }, error => {
      console.error("Erreur lors de l'écoute du document utilisateur:", error);
    });

    // Écouter les modifications de la sous-collection offres_etats
    const unsubscribeOffresEtats = offresEtatsRef.onSnapshot(snapshot => {
      const etats = {};
      snapshot.forEach(doc => {
        etats[doc.id] = doc.data().etat;
      });
      setOffresEtats(etats);
    }, error => {
      console.error("Erreur lors de l'écoute de la sous-collection offres_etats:", error);
    });

    // Indiquer que les données utilisateur sont chargées
    setDataLoaded(true);

    // Nettoyage des écouteurs lors du démontage du composant
    return () => {
      unsubscribeUser();
      unsubscribeOffresEtats();
    };
  }, []);

  useEffect(() => {
    const fetchOffres = async () => {
      const offresData = [];
      try {
        const snapshot = await firebase.firestore().collection('offres').get();
        snapshot.forEach(doc => {
          offresData.push({ id: doc.id, ...doc.data() });
        });

        // Trier les offres en fonction de l'abonnement et de l'état
        if (!abonnement_actif) {
          offresData.sort((a, b) => {
            const aEtat = offres_etats[a.id] || false;
            const bEtat = offres_etats[b.id] || false;

            if (aEtat && !bEtat) return -1; // a en premier
            if (bEtat && !aEtat) return 1;  // b en premier
            return 0; // égalité
          });
        }

        setOffres(offresData);
        setFilteredOffres(offresData); // Initialiser le filtrage avec les offres triées
      } catch (error) {
        console.error("Erreur lors de la récupération des offres:", error);
      } finally {
        setLoadingOffres(false); // Indiquer que les offres sont chargées
      }
    };

    const fetchCategories = async () => {
      try {
        const doc = await firebase.firestore().collection('categories').doc('Uhk2AgyOj4wX6SbaBObD').get();
        if (doc.exists) {
          const data = doc.data();
          const categoriesData = Object.entries(data)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(entry => entry[1]);
          setCategories(categoriesData);
        } else {
          console.log("Aucun document trouvé dans la collection 'categories'");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    // Appeler fetchOffres et fetchCategories seulement après avoir récupéré les données utilisateur
    if (dataLoaded) {
      fetchOffres();
      fetchCategories();
    }
  }, [abonnement_actif, offres_etats, dataLoaded]);

  useEffect(() => {
    // Filtrer les offres à chaque modification de searchText ou selectedCategories
    setFilteredOffres(
      offres.filter(offre =>
        offre.nom.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedCategories.length === 0 || selectedCategories.includes(offre.categorie))
      )
    );
  }, [searchText, offres, selectedCategories]);

  const handlePress = (id) => {
    navigation.navigate('detailleOffres', { id });
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(cat => cat !== category)
        : [...prevCategories, category]
    );
  };

  // Mettre à jour les offres lorsque abonnement_actif ou offres_etats changent
  useEffect(() => {
    const updateOffres = () => {
      let sortedOffres = [...offres];

      if (!abonnement_actif) {
        sortedOffres.sort((a, b) => {
          const aEtat = offres_etats[a.id] || false;
          const bEtat = offres_etats[b.id] || false;

          if (aEtat && !bEtat) return -1; // a en premier
          if (bEtat && !aEtat) return 1;  // b en premier
          return 0; // égalité
        });
      }

      setFilteredOffres(
        sortedOffres.filter(offre =>
          offre.nom.toLowerCase().includes(searchText.toLowerCase()) &&
          (selectedCategories.length === 0 || selectedCategories.includes(offre.categorie))
        )
      );
    };

    updateOffres();
  }, [abonnement_actif, offres_etats, offres, searchText, selectedCategories]);

  if (!fontsLoaded || !dataLoaded || loadingOffres || loadingCategories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4081" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.appTitle}>KHRIJA</Text>
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
        <CategoriesList
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          loading={loadingCategories}
        />
      </View>

      <FlatList
        data={filteredOffres}
        renderItem={({ item }) => <OfferCard offre={item} onPress={handlePress} />}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune offre trouvée.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  listHeader: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  appTitle: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FF4081',
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
