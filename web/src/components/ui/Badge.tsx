import React, { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'contributor' | 'popular';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = "relative inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[12px] font-semibold bg-base-700 border border-white/10";
  
  const variantStyles = {
    default: '',
    contributor: '',
    popular: ''
  };
  
  return (
    <span className={`${baseClasses} ${className}`} {...props}>
      <span 
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: variant === 'contributor' 
            ? 'linear-gradient(90deg,#5AC8FA55,#5AC8FA55)' 
            : variant === 'popular'
            ? 'linear-gradient(90deg,#FF8AB355,#FF8AB355)'
            : 'linear-gradient(90deg,#5AC8FA55,#FF8AB355)',
          mask: 'linear-gradient(#fff,#fff) content-box, linear-gradient(#fff,#fff)',
          WebkitMaskComposite: 'xor',
          padding: '1px'
        }} 
      />
      <span className="text-trans-white/90">
        {children}
      </span>
    </span>
  );
};

export default Badge;