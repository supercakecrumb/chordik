import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'voteUp' | 'voteDown' | 'gradient';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    voteUp: 'btn-vote',
    voteDown: 'btn-vote',
    gradient: 'btn-gradient',
  };
  
  // Add data-state for vote buttons
  const additionalProps = variant === 'voteUp' || variant === 'voteDown' 
    ? { ...props, 'data-state': variant === 'voteUp' ? 'up' : 'down' }
    : props;
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...additionalProps}
    >
      {children}
    </button>
  );
};

export default Button;