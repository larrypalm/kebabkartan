'use client';

import React, { forwardRef } from 'react';
import { MaterialIcon } from '@/app/components/Icons';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: string; // Material Symbols icon name
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  icon,
  size = 'md',
  variant = 'default',
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-muted';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  const variants = {
    default: 'border-slate-200 bg-white text-text-primary focus:ring-primary focus:ring-offset-1',
    filled: 'border-transparent bg-slate-50 text-text-primary focus:ring-primary focus:bg-white',
    outlined: 'border-2 border-slate-300 bg-white text-text-primary focus:ring-primary focus:border-primary'
  };

  const errorStyles = error
    ? 'border-error focus:ring-error focus:border-error'
    : '';

  const widthClass = fullWidth ? 'w-full' : '';

  // Determine if there's a left icon (either icon prop or leftIcon prop)
  const hasLeftIcon = icon || leftIcon;

  return (
    <div className={widthClass}>
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {hasLeftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">
            {icon ? <MaterialIcon name={icon} size="sm" /> : leftIcon}
          </div>
        )}

        <input
          ref={ref}
          className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${errorStyles} ${
            hasLeftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-error font-medium">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
