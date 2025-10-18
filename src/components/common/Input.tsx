/**
 * Input Component
 * 
 * A reusable input field component with label, error handling, and icon support.
 * Provides consistent styling and accessibility features across the application.
 */
import React from 'react';

/**
 * Input Props Interface
 * 
 * Extends standard HTML input attributes with custom styling and functionality.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text to display above the input */
  label?: string;
  /** Error message to display below the input */
  error?: string;
  /** Whether input should take full width of container */
  fullWidth?: boolean;
  /** Icon to display on the left side of input */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side of input */
  rightIcon?: React.ReactNode;
}

/**
 * Input Component Implementation
 * 
 * Renders a styled input field with optional label, icons, and error states.
 * Automatically handles accessibility attributes and focus states.
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  // Generate input ID from label if not provided
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label - only rendered if provided */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      {/* Input container with icon support */}
      <div className="relative">
        {/* Left icon container */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {leftIcon}
          </div>
        )}
        
        {/* Main input element */}
        <input
          id={inputId}
          className={`
            block px-4 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${fullWidth ? 'w-full' : ''}
          `}
          {...props}
        />
        
        {/* Right icon container */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {/* Error message - only shown when error exists */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;