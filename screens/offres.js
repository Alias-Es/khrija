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
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { firebase } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import OfferCard from '../components/offres/OfferCard';
import CategoriesList from '../components/offres/CategoriesList';
import SearchBar from '../components/offres/SearchBar';
import LanguagePickerModal from '../components/LanguagePickerModal';
import { LanguageContext } from '../LanguageContext';

const SCROLL_RANGE = 100;

export default function ListeOffres() {
  const insets = useSafeAreaInsets();
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

  const { height, width } = Dimensions.get('window');
  const iconPosition = height * 0.02 + insets.top;
  const searchBarInitialPos = height * 0.01;

  const iosOffset = Platform.OS === 'ios' ? height * 0.05 : 0; // Ajusté pour être proportionnel
  const androidExtraDown = Platform.OS === 'android' ? height * 0.03 : 0; // Ajusté pour être proportionnel

  const distance = (searchBarInitialPos - iconPosition) + iosOffset;

  // Limites pour l'icône de langue
  const LANGUAGE_ICON_TOP = height * 0.08 + insets.top; // Ajusté pour être proportionnel
  const LANGUAGE_ICON_HEIGHT = height * 0.08; // Ajusté pour être proportionnel
  const LANGUAGE_ICON_BOTTOM = LANGUAGE_ICON_TOP + LANGUAGE_ICON_HEIGHT;

  // Limite de translation pour la barre de catégories
  const MAX_TRANSLATE_Y = -(LANGUAGE_ICON_BOTTOM - (searchBarInitialPos + height * 0.10)); // Ajusté pour être proportionnel

  // Ajustement conditionnel basé sur la hauteur de l'écran
  let adjustedTranslateY = Math.max(-(distance - androidExtraDown), MAX_TRANSLATE_Y);
  if (height < 800) { // Exemple de seuil, ajustez selon vos besoins
    adjustedTranslateY *= 0.9; // Ajustement proportionnel
  }

  const logoOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const searchBarScale = scrollY.interpolate({
    inputRange: [0, height * 0.05], // Ajusté pour être proportionnel
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const searchBarTranslateX = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [0, -width * 0.05], // Utilisation de la largeur pour translateX
    extrapolate: 'clamp',
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [0, adjustedTranslateY],
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
      {/* Conteneur pour la barre de recherche avec rétrécissement horizontal */}
      <Animated.View
        style={[
          styles.headerSearchContainer,
          {
            marginTop: searchBarInitialPos,
            transform: [
              { scaleX: searchBarScale },
              { translateX: searchBarTranslateX },
              { translateY: searchBarTranslateY },
            ],
          },
        ]}
      >
        <View style={styles.topRowContainer}>
          <View style={styles.searchBarContainer}>
            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              placeholder={t('searchPlaceholder')}
            />
          </View>
        </View>
      </Animated.View>

      {/* Conteneur pour les catégories qui suit verticalement mais sans scaleX */}
      <Animated.View
        style={[
          styles.categoriesOuterContainer,
          {
            marginTop: searchBarInitialPos,
            transform: [
              { translateY: searchBarTranslateY },
            ],
          },
        ]}
      >
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
      </Animated.View>
    </View>
  );

  const dataWithHeader = [{ type: 'stickyHeader' }, ...filteredOffres];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowLanguageModal(true)}
        style={styles.languageIconContainerFixed}
      >
        <Ionicons name="globe-outline" size={wp('6%')} color="#000" />
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
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + hp('3%')
        : hp('0.2%'),
  },
  appTitle: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: wp('15%'),
    fontWeight: 'bold',
    color: '#FF4081',
    textAlign: 'center',
  },
  languageIconContainerFixed: {
    position: 'absolute',
    right: wp('5%'),
    top: hp('8%'),
    zIndex: 10, // Assurez-vous que l'icône est au-dessus
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: wp('3%'),
    padding: 5,
  },
  languageInitials: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
  stickyHeader: {
    backgroundColor: '#F8F8F8',
  },
  headerSearchContainer: {
    backgroundColor: '#F8F8F8',
    minHeight: hp('10%'),
    marginBottom: -hp('4.5%'),
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3%'),
  },
  searchBarContainer: {
    alignSelf: 'center',
    height: hp('8%'),
    width: wp('95%'),
    overflow: 'hidden',
  },
  categoriesOuterContainer: {
    backgroundColor: '#F8F8F8',
    minHeight: hp('7%'),
  },
  categoriesContainer: {
    width: '100%',
    paddingHorizontal: wp('0.2%'),
    backgroundColor: '#F8F8F8',
    paddingBottom: hp('1%'),
  },
  listContent: {
    paddingBottom: hp('3%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: '#888',
  },
});
