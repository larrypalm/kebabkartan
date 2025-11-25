'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  variant?: 'default' | 'bordered' | 'flat';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  onClick,
  hover = true,
  padding = 'md',
  variant = 'default'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6'
  };

  const variantClasses = {
    default: 'bg-white border border-slate-100 shadow-card',
    bordered: 'bg-white border-2 border-slate-200',
    flat: 'bg-slate-50 border border-slate-100'
  };

  const hoverClass = hover ? 'hover:shadow-card-hover transition-all duration-300' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`rounded-2xl ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
