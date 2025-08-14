import { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import type { InputVariant } from '../../types';

interface TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
  variant?: InputVariant;
  showPasswordToggle?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  label,
  error,
  required = false,
  disabled = false,
  helperText,
  type = 'text',
  placeholder,
  value = '',
  onChange,
  onBlur,
  onFocus,
  className = '',
  variant = 'default',
  showPasswordToggle = false,
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = !!error;
  const isSuccess = variant === 'success';

  const baseClasses = `
    w-full px-4 py-3 text-sm border rounded-lg
    focus:ring-2 focus:ring-offset-0 transition-all duration-200
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${type === 'password' && showPasswordToggle ? 'pr-12' : ''}
  `;

  const variantClasses = {
    default: `
      border-gray-300 focus:border-blue-500 focus:ring-blue-500/20
      ${isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
    `,
    error: `
      border-red-500 focus:border-red-500 focus:ring-red-500/20
      ${isFocused ? 'ring-2 ring-red-500/20' : ''}
    `,
    success: `
      border-green-500 focus:border-green-500 focus:ring-green-500/20
      ${isFocused ? 'ring-2 ring-green-500/20' : ''}
    `,
  };

  const currentVariant = hasError ? 'error' : isSuccess ? 'success' : 'default';

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`${baseClasses} ${variantClasses[currentVariant]}`}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${label}-error` : helperText ? `${label}-helper` : undefined
          }
        />
        
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        
        {(hasError || isSuccess) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {hasError ? (
              <AlertCircle size={18} className="text-red-500" />
            ) : (
              <CheckCircle size={18} className="text-green-500" />
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${label}-error`} className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p id={`${label}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';