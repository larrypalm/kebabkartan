import React from 'react';
import {
  Home,
  Info,
  Mail,
  List,
  Search,
  MapPin,
  Pizza,
  Star,
  X,
  Menu
} from 'lucide-react';

// Export existing Lucide icons for backwards compatibility
export {
  Home,
  Info,
  Mail,
  List,
  Search,
  MapPin,
  Pizza,
  Star,
  X,
  Menu
};

// Material Symbols Icon Component
interface MaterialIconProps {
  name: string;
  className?: string;
  fill?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Material Symbols Outlined Icon Component
 * Usage: <MaterialIcon name="restaurant" fill className="text-primary" />
 */
export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  className = '',
  fill = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: '!text-base', // 16px
    md: '!text-xl',   // 20px
    lg: '!text-2xl',  // 24px
    xl: '!text-4xl',  // 36px
  };

  return (
    <span
      className={`material-symbols-outlined ${fill ? 'fill' : ''} ${sizeClasses[size]} ${className}`}
    >
      {name}
    </span>
  );
};