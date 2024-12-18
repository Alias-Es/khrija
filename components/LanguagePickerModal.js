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

const LanguagePickerModal = ({
  visible,
  onClose,
  selectedLanguage,
  onLanguageChange,
  onConfirm,
}) => {
  const languages = [
    { label: '🇫🇷 Français', value: 'fr' },
    { label: '🇬🇧 English', value: 'en' },
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
              <Text style={styles.modalTitle}>Choisissez votre langue :</Text>
              <Picker
                selectedValue={selectedLanguage}
                onValueChange={(value) => onLanguageChange(value)}
                style={styles.picker}
              >
                {languages.map((lang) => (
                  <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
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
    marginBottom: 1,
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

export default LanguagePickerModal;
