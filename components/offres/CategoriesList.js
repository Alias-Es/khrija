// components/offres/CategoriesList.js
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import CategoryButton from './CategoryButton';

const CategoriesList = ({ categories, selectedCategories, toggleCategory, loading }) => {
  if (loading) {
    return <Text style={styles.loadingText}>Chargement des catégories...</Text>;
  }

  if (categories.length === 0) {
    return <Text style={styles.loadingText}>Aucune catégorie disponible</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map(category => (
        <CategoryButton
          key={category}
          category={category}
          isActive={selectedCategories.includes(category)}
          onToggle={toggleCategory}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
  },
});

export default CategoriesList;
