import React, { useEffect, useRef } from 'react';
import { Modal, View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { LanguageContext } from '../LanguageContext';

const OfferUsedAnimationModal = ({ visible, onClose, offerName, establishmentName }) => {
  const { language, translations } = React.useContext(LanguageContext);
  const t = (key) => translations[language][key];
  
  // Référence à l'animation pour pouvoir la contrôler
  const animationRef = useRef(null);

  // Gérer la visibilité et la réinitialisation
  useEffect(() => {
    if (visible && animationRef.current) {
      // Reset et play à chaque fois que visible devient true
      animationRef.current.reset();
      // Petit délai pour s'assurer que le reset est complet
      setTimeout(() => {
        if (animationRef.current) {
          animationRef.current.play();
        }
      }, 100);
    }
  }, [visible]);

  const handleAnimationFinish = () => {
    // S'assurer que onClose n'est appelé que si la modal est encore visible
    if (visible) {
      setTimeout(() => {
        if (visible) { // Vérification supplémentaire pour éviter des appels inattendus
          onClose();
        }
      }, 1500); // Délai de 2 secondes avant de fermer
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      hardwareAccelerated={true} // Améliore les performances sur Android
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LottieView
            ref={animationRef}
            source={require('../assets/animations/success.json')}
            autoPlay={false} // Désactivé car on contrôle manuellement
            loop={false}
            onAnimationFinish={handleAnimationFinish}
            style={styles.animation}
            speed={1}
            renderMode={'SOFTWARE'}
            key={visible ? 'visible' : 'hidden'}
          />
          <Text style={styles.successText}>{t('offerUsedSuccessfully')}</Text>
          <Text style={styles.establishmentText}>{`${establishmentName}`}</Text>
          <Text style={styles.offerText}>{`${offerName}`}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '70%',  // Augmenté pour accommoder une plus grande animation
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  animation: {
    width: 200,  // Augmenté de 150 à 250
    height: 200, // Augmenté de 150 à 250
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4BB543',
    marginTop: 10,
    textAlign: 'center',
  },
  offerText: {
    fontSize: 17,
    color: '#FF4081',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  establishmentText: {
    fontSize: 21,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default OfferUsedAnimationModal;
