// components/InitialSubscriptionModal.js

import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const InitialSubscriptionModal = ({ visible, onClose, onSubscribe }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name="times" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Bghiti tstafd men les réductions ?</Text>
        <Text style={styles.modalMessage}>Tabonna daba u dir khrijat</Text>
        <TouchableOpacity
          style={styles.modalSubscribeButton}
          onPress={onSubscribe}
        >
          <Text style={styles.subscribeButtonText}>M'ABONNER</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4081',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubscribeButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InitialSubscriptionModal;
