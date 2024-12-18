import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';

const CustomButton = ({ color, icon, text, textColor, borderColor, accessibilityLabel, onPress }) => (
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color,
      borderColor: borderColor || 'transparent',
      borderWidth: 1,
      width: 350,
      height: 55,
      borderRadius: 27,
      
    }}
    accessibilityLabel={accessibilityLabel}
    onPress={onPress}
  >
    <Image source={icon} style={{ width: 24, height: 24, marginRight: 10 }} />
    <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>{text}</Text>
  </TouchableOpacity>
);

export default CustomButton;
