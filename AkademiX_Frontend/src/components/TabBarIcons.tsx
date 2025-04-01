import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from '../themes/colors';

interface TabBarIconProps {
  name: string;
  focused: boolean;
  size?: number;
  color?: string;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ 
  name, 
  focused, 
  size = 24,
  color
}) => {
  const iconColor = color || (focused ? colors.primary : colors.textOnSecondary);
  const iconSize = size;

  return (
    <Ionicons
      name={name as any}
      size={iconSize}
      color={iconColor}
      style={{
        marginBottom: -3,
        shadowColor: focused ? colors.primary : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: focused ? 0.5 : 0,
        shadowRadius: focused ? 5 : 0,
      }}
    />
  );
};

export default TabBarIcon; 