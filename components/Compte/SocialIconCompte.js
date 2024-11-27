// SocialIconCompte.js
import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, Linking } from 'react-native';

const SocialIconCompte = ({ platform, imageSource, url }) => {
  return (
    <TouchableOpacity
      style={styles.socialIcon}
      onPress={() => Linking.openURL(url)}
    >
      <Image source={imageSource} style={styles.iconImage} />
      <Text style={styles.iconText}>{platform}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconImage: {
    width: 35,
    height: 35,
    marginRight: 5,
  },
  iconText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SocialIconCompte;
