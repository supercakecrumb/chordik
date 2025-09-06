import React, { ButtonHTMLAttributes } from 'react';

interface CompactActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'danger';
  icon: React.ReactNode;
  label: string;
  loading?: boolean;
}

const CompactActionButton: React.FC<CompactActionButtonProps> = ({
  variant,
  icon,
  label,
  loading = false,
  className = '',
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = `
    inline-flex items-center justify-center
    h-10 px-3
    rounded-2xl
    font-medium text-sm
    transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-900
    disabled:opacity-50 disabled:cursor-not-allowed
    motion-safe:transition-transform
    group
  `;
  
  // Variant classes
  const variantClasses = {
    primary: `
      bg-base-700
      border border-base-500
      text-trans-white/90
      hover:border-transparent
      hover:bg-gradient-to-r hover:from-[#5AC8FA] hover:to-[#FF8AB3]
      hover:text-white
      focus:ring-[#5AC8FA]
    `,
    secondary: `
      bg-base-700
      border border-base-500
      text-trans-white/90
      hover:border-transparent
      hover:bg-gradient-to-r hover:from-[#FF8AB3] hover:to-[#FF5C70]
      hover:text-white
      focus:ring-[#FF8AB3]
    `,
    danger: `
      bg-base-700
      border border-base-500
      text-trans-white/90
      hover:border-transparent
      hover:bg-gradient-to-r hover:from-[#FF5C70] hover:to-[#FF8AB3]
      hover:text-white
      focus:ring-[#FF5C70]
    `
  };
  
  // Loading state classes
  const loadingClasses = loading ? 'opacity-70' : '';
  
  // Combine all classes
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${loadingClasses}
    ${className}
  `.trim();
  
  return (
    <button
      className={classes}
      aria-label={label}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          <span className="block sm:hidden group-hover:hidden">{icon}</span>
          <span className="hidden sm:block">{icon}</span>
          <span className="ml-2 hidden sm:inline">{label}</span>
        </>
      )}
    </button>
  );
};

export default CompactActionButton;