// /components/AgePickerModal.js

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AgePickerModal = ({ visible, onClose, selectedValue, onValueChange }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sélectionnez votre âge</Text>
              <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionnez votre âge" value="" />
                {[...Array(9)].map((_, i) => (
                  <Picker.Item key={i} label={`${18 + i}`} value={`${18 + i}`} />
                ))}
              </Picker>
              <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                <Text style={styles.modalButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#E91E63',
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AgePickerModal;
