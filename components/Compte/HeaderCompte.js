// HeaderCompte.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const HeaderCompte = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.logoText}>KHRIJA</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  logoText: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 35,
    fontWeight: 'bold',
    color: '#E91E63',
  },
});

export default HeaderCompte;
