// components/offres/OfferCard.js
import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

const OfferCard = ({ offre, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(offre.id)} style={styles.card}>
      {/* Sticker Gratuit */}
      {offre.gratuit && (
        <View style={styles.sticker}>
          <Text style={styles.stickerText}>Gratuit</Text>
        </View>
      )}

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: offre.couverture || 'https://example.com/default-image.jpg' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{offre.nom}</Text>
        <Text style={styles.offer} numberOfLines={1}>🎁 {offre.offreDecouverte}</Text>
        <Text style={styles.permanentOffer}>♾️ {offre.offrePermanente}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 30,
    width: '96%',
    alignSelf: 'center',
    overflow: 'visible', // Assure que le sticker est visible même en dehors de la carte
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 50,
    paddingBottom: 12,
    position: 'relative', // Nécessaire pour le positionnement absolu du sticker
  },
  sticker: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF4081',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    zIndex: 1, // Assure que le sticker est au-dessus des autres éléments
  },
  stickerText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '25%',
    height: 80,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: -50,
    alignSelf: 'center',
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

export default OfferCard;
