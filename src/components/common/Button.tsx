/**
 * Button Component
 * 
 * A reusable button component with multiple variants, sizes, and states.
 * Supports loading states, icons, and full accessibility features.
 */
import React from 'react';

/**
 * Button Props Interface
 * 
 * Extends standard HTML button attributes with custom styling options.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether button should take full width of container */
  fullWidth?: boolean;
  /** Loading state - disables button and shows spinner */
  isLoading?: boolean;
  /** Icon to display on the left side of text */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side of text */
  rightIcon?: React.ReactNode;
}

/**
 * Button Component Implementation
 * 
 * Renders a styled button with configurable appearance and behavior.
 * Handles loading states, icons, and accessibility automatically.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes applied to all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant-specific styling classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    outline: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };
  
  // Size-specific classes for padding and text size
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  // Conditional classes based on props
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${disabledClass}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading spinner - only shown when isLoading is true */}
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {/* Left icon - only shown when not loading and leftIcon is provided */}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {/* Button text content */}
      {children}
      {/* Right icon - only shown when not loading and rightIcon is provided */}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;