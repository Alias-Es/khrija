// HeaderCompte.js
import React from 'react';
import { View, Text, StyleSheet ,Platform} from 'react-native';


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
    paddingTop: Platform.OS === 'android' ? 40 : 0, // Ajout de padding pour Android uniquement
 
  },
  logoText: {
    fontFamily: 'ChauPhilomeneOne',
    fontSize: 45,
   
    color: '#FF4081',
  },
});

export default HeaderCompte;
