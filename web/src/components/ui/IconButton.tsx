import React, { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'default' | 'compact';
  icon: React.ReactNode;
  'aria-label': string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  variant = 'ghost',
  size = 'default',
  icon,
  className = '',
  ...props
}) => {
  // Base classes for all icon buttons
  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold
    border
    rounded-full
    transition-all duration-150
    focus:outline-none
    focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-900
    disabled:opacity-50 disabled:cursor-not-allowed
    motion-safe:transition-transform
  `;
  
  // Size classes
  const sizeClasses = size === 'compact' 
    ? 'p-1.5 h-8 w-8 text-sm' 
    : 'p-2 h-10 w-10 text-base';
  
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
  
  // Combine all classes
  const classes = `
    ${baseClasses}
    ${sizeClasses}
    ${variantClasses[variant]}
    ${className}
  `.trim();
  
  return (
    <button
      className={classes}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;