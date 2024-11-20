import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const UserCardModal = ({ visible, onClose, userData }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalBackground}>
      <View style={styles.userCardContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name="times" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.userAvatar}>
          <FontAwesome name="user-circle" size={60} color="#333" />
        </View>
        <Text style={styles.userName}>{userData?.nom || "Nom de famille"}</Text>
        <Text style={styles.userInfo}>{userData?.prenom || "Prénom"}</Text>
        <Text style={styles.userInfo}>
          {userData?.age ? `${userData.age} ans` : "Âge inconnu"}
        </Text>
        <Text style={styles.userInfo}>{userData?.email || "exemple@email.com"}</Text>
        <Text style={styles.userInfo}>
          Expire le {new Date().toISOString().split('T')[0]}
        </Text>
        <TouchableOpacity style={styles.modalSubscribeButton} onPress={onClose}>
          <Text style={styles.subscribeButtonText}>Fermer</Text>
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
  userCardContainer: {
    width: '80%',
    backgroundColor: '#B3E5FC',
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
  userAvatar: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  modalSubscribeButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserCardModal;
