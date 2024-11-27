import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

import { useFonts } from 'expo-font';


 
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
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOffres = async () => {
      const offresData = [];
      try {
        const snapshot = await firebase.firestore().collection('offres').get();
        snapshot.forEach(doc => {
          offresData.push({ id: doc.id, ...doc.data() });
        });
        setOffres(offresData);
        setFilteredOffres(offresData); // Initialiser le filtrage avec toutes les offres
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const doc = await firebase.firestore().collection('categories').doc('Uhk2AgyOj4wX6SbaBObD').get();
        if (doc.exists) {
          const data = doc.data();
          const categoriesData = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0])).map(entry => entry[1]);
          setCategories(categoriesData);
        } else {
          console.log("Aucun document trouvé dans la collection 'categories'");
        }
        setLoadingCategories(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        setLoadingCategories(false);
      }
    };

    fetchOffres();
    fetchCategories();
  }, []);

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
 
  const renderOffre = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.couverture || 'https://example.com/default-image.jpg' }} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{item.nom}</Text>
        <Text style={styles.offer} numberOfLines={1}>🎁 {item.offreDecouverte}</Text>
        <Text style={styles.permanentOffer}>♾️ {item.offrePermanente}</Text>
      </View>
    </TouchableOpacity>
  );

  const toggleCategory = (category) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(cat => cat !== category)
        : [...prevCategories, category]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.appTitle}>KHRIJA</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher un nom..."
          value={searchText}
          onChangeText={text => setSearchText(text)} // Mettre à jour searchText en temps réel
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {loadingCategories ? (
            <Text>Chargement des catégories...</Text>
          ) : (
            categories.length > 0 ? (
              categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, selectedCategories.includes(category) && styles.categoryButtonActive]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={[styles.categoryText, selectedCategories.includes(category) && styles.categoryTextActive]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>Aucune catégorie disponible</Text>
            )
          )}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredOffres}
        renderItem={renderOffre}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
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
  },
  searchBar: {
    width: '90%',
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dropdownList: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200, // Limite la hauteur de la liste déroulante
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'absolute',
    top: 110, // Positionnez-le juste sous la barre de recherche
    zIndex: 1,
    alignSelf: 'center',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 5,
  },
  categoryButtonActive: {
    backgroundColor: '#FF4081',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 30,
    width: '96%',
    alignSelf: 'center',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 50,
    paddingBottom: 12,
  },
  imageContainer: {
    width: '25%', // Réduisez la largeur de l'image
   
    height: 80,
    borderRadius: 15,
    overflow: 'hidden', // Pour que l'arrondi soit appliqué
    marginTop: -50,
    alignSelf: 'center', // Centre l'image dans le card
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  name: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  offer: {
    fontSize: 14,
    color: '#FF4081',
    marginBottom: 4,
    fontWeight: '500',
  },
  permanentOffer: {
    fontSize: 14,
    color: '#4A90E2',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 1,
    borderRadius: 45,
  },
});

