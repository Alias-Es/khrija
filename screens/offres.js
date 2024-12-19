import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import OfferCard from '../components/offres/OfferCard';
import CategoriesList from '../components/offres/CategoriesList';
import SearchBar from '../components/offres/SearchBar';
import LanguagePickerModal from '../components/LanguagePickerModal';
import { LanguageContext } from '../LanguageContext';

export default function ListeOffres() {
  const [fontsLoaded] = useFonts({
    'ChauPhilomeneOne': require('../assets/fonts/ChauPhilomeneOne.ttf'),
  });

  const [searchText, setSearchText] = useState('');
  const [offres, setOffres] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingOffres, setLoadingOffres] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const { language, setLanguage, translations } = useContext(LanguageContext);

  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const t = (key) => translations[language][key];

  const fetchOffres = async () => {
    const offresData = [];
    try {
      const snapshot = await firebase.firestore().collection('offres').get();
      snapshot.forEach((doc) => {
        offresData.push({ id: doc.id, ...doc.data() });
      });
      setOffres(offresData);
      setFilteredOffres(offresData);
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
    } finally {
      setLoadingOffres(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const doc = await firebase
        .firestore()
        .collection('categories')
        .doc('Uhk2AgyOj4wX6SbaBObD')
        .get();
      if (doc.exists) {
        const data = doc.data();
        const categoriesData = Object.entries(data)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map((entry) => entry[1]);
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchOffres();
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredOffres(
      offres.filter(
        (offre) =>
          offre.nom.toLowerCase().includes(searchText.toLowerCase()) &&
          (selectedCategories.length === 0 || selectedCategories.includes(offre.categorie))
      )
    );
  }, [searchText, offres, selectedCategories]);

  const handlePress = (id) => {
    navigation.navigate('detailleOffres', { id });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOffres();
    await fetchCategories();
    setRefreshing(false);
  };

  if (!fontsLoaded || loadingOffres || loadingCategories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4081" />
      </View>
    );
  }

  const logoOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const searchBarScale = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const searchBarTranslateX = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const renderLogoHeader = () => (
    <View style={styles.logoHeaderWrapper}>
      <Animated.Text style={[styles.appTitle, { opacity: logoOpacity }]}>
        {t('appTitle')}
      </Animated.Text>
    </View>
  );

  const renderStickyHeader = () => (
    <View style={styles.stickyHeader}>
      <View style={styles.topRowContainer}>
        <Animated.View
          style={[
            styles.searchBarContainer,
            {
              transform: [
                { scaleX: searchBarScale },
                { translateX: searchBarTranslateX },
              ],
            },
          ]}
        >
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={t('searchPlaceholder')}
          />
        </Animated.View>
      </View>
      <View style={styles.categoriesContainer}>
        <CategoriesList
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={(category) =>
            setSelectedCategories((prev) =>
              prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
            )
          }
          loading={loadingCategories}
        />
      </View>
    </View>
  );

  const dataWithHeader = [{ type: 'stickyHeader' }, ...filteredOffres];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowLanguageModal(true)}
        style={styles.languageIconContainerFixed}
      >
        <Ionicons name="globe-outline" size={26} color="#000" />
        <Text style={styles.languageInitials}>{language.toUpperCase()}</Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={dataWithHeader}
        keyExtractor={(item, index) => item.id || `header-${index}`}
        ListHeaderComponent={renderLogoHeader}
        renderItem={({ item }) => {
          if (item.type === 'stickyHeader') return renderStickyHeader();
          return <OfferCard offre={item} onPress={handlePress} />;
        }}
        stickyHeaderIndices={[1]}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('noOffers')}</Text>}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <LanguagePickerModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        selectedLanguage={language}
        onLanguageChange={setLanguage}
        onConfirm={() => setShowLanguageModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  logoHeaderWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FF4081',
    textAlign: 'center',
  },
  languageIconContainerFixed: {
    position: 'absolute',
    right: 13,
    top: 65,
    zIndex: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 2,
  },
  languageInitials: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
  stickyHeader: {
    backgroundColor: '#F8F8F8',
    paddingBottom: 5,
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  searchBarContainer: {
    alignSelf: 'center',
    height: 60,
    width: '110%',
    overflow: 'hidden',
  },
  categoriesContainer: {
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#F8F8F8',
    paddingBottom: 5,
  },
  listContent: {
    paddingBottom: 5,
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
