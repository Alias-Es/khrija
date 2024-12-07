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

const StatusPickerModal = ({
  visible,
  onClose,
  tempValue,
  onTempValueChange,
  onConfirm,
}) => {
  const statuses = [
    'Étudiant',
    'Employé',
    'En recherche d’opportunités',
  ];

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
              <Text style={styles.modalTitle}>Sélectionnez votre statut :</Text>
              <Picker
                selectedValue={tempValue}
                onValueChange={(value) => onTempValueChange(value || '')}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionnez votre statut" value="" />
                {statuses.map((status) => (
                  <Picker.Item key={status} label={status} value={status} />
                ))}
              </Picker>
              <TouchableOpacity style={styles.modalButton} onPress={onConfirm}>
                <Text style={styles.modalButtonText}>Confirmer</Text>
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: 23,
    marginBottom: 20,
    color: '#E91E63',
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    marginBottom: 20,
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StatusPickerModal;
