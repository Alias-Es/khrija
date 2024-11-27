// FooterCompte.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SocialIconCompte from './SocialIconCompte';

const FooterCompte = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>UNE QUESTION ?</Text>
      <Text style={styles.footerText}>Retrouve-nous sur nos réseaux sociaux :</Text>
      <View style={styles.socialContainer}>
        <SocialIconCompte
          platform="INSTAGRAM"
          imageSource={require('../../assets/images/instagram.png')}
          url="https://www.instagram.com/khrijaa/"
        />
        <Text style={styles.separator}>|</Text>
        <SocialIconCompte
          platform="TIKTOK"
          imageSource={require('../../assets/images/tiktok.png')}
          url="https://www.tiktok.com/@khrijaa_"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginVertical: 5,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 29,
  },
  separator: {
    fontSize: 18,
    color: '#999',
    marginHorizontal: 5,
  },
});

export default FooterCompte;
