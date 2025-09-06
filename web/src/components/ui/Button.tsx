import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'default' | 'compact';
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  iconLeft,
  iconRight,
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;
  
  // Base classes for all buttons
  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold
    border
    rounded-2xl
    transition-all duration-150
    focus:outline-none
    focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-900
    disabled:opacity-50 disabled:cursor-not-allowed
    motion-safe:transition-transform
  `;
  
  // Size classes
  const sizeClasses = size === 'compact' 
    ? 'text-sm px-3 py-2 h-8' 
    : 'text-base px-4 py-2.5 h-10';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Variant classes
  const variantClasses = {
    primary: `
      text-[#051018]
      border-transparent
      bg-gradient-to-r from-[#5AC8FA] to-[#FF8AB3]
      hover:from-[#4ab9eb] hover:to-[#ff7aa6]
      focus:ring-[#5AC8FA]
      active:translate-y-px
      shadow-sm
      hover:shadow-md
    `,
    secondary: `
      text-[#1a0a11]
      border-[#FF8AB3]/30
      bg-gradient-to-r from-[#1c232e] to-[#1c232e]
      hover:from-[#FF8AB3]/10 hover:to-[#FF8AB3]/10
      focus:ring-[#FF8AB3]
      active:translate-y-px
    `,
    ghost: `
      text-[#E7EEF6]
      border-[#E7EEF6]/15
      bg-transparent
      hover:bg-[#1c232e]
      focus:ring-[#5AC8FA]
      active:translate-y-px
    `,
    danger: `
      text-[#1f0b0f]
      border-transparent
      bg-gradient-to-r from-[#FF5C70] to-[#FF8AB3]
      hover:from-[#ff4c62] hover:to-[#ff7aa6]
      focus:ring-[#FF5C70]
      active:translate-y-px
      shadow-sm
      hover:shadow-md
    `
  };
  
  // Disabled state classes
  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // Combine all classes
  const classes = `
    ${baseClasses}
    ${sizeClasses}
    ${widthClasses}
    ${variantClasses[variant]}
    ${disabledClasses}
    ${className}
  `.trim();
  
  return (
    <button
      className={classes}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

export default Button;