import React from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaView, StyleSheet } from 'react-native';

const FaqScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView source={{ uri: 'https://linktr.ee/Khrija.ma' }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FaqScreen;
