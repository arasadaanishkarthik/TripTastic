// src/components/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-heading font-medium transition-colors duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-xl';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-primary/35',
    gradient:
      'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-accent/35',
    secondary:
      'bg-surface/80 hover:bg-surface text-text-main backdrop-blur-md border border-border hover:border-text-secondary/30 shadow-sm',
    outline:
      'bg-transparent border border-border hover:border-primary text-text-main hover:text-primary',
    ghost:
      'bg-transparent text-text-secondary hover:text-text-main hover:bg-surface/50',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 gap-2.5',
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.96, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {Icon && (
        <motion.span
          className="inline-flex"
          initial={{ x: 0 }}
          whileHover={disabled ? {} : { x: 3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Icon className="w-4 h-4" />
        </motion.span>
      )}
    </motion.button>
  );
};