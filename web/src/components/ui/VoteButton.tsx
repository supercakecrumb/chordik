import React, { ButtonHTMLAttributes } from 'react';

interface VoteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'up' | 'down';
  active?: boolean;
  score?: number;
  onToggle?: () => void;
  className?: string;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  direction,
  active = false,
  score,
  onToggle,
  className = '',
  ...props
}) => {
  // Base classes for all vote buttons
  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold
    border
    rounded-xl
    transition-all duration-150
    focus:outline-none
    focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-900
    disabled:opacity-50 disabled:cursor-not-allowed
    motion-safe:transition-transform
    h-8 w-8 p-0
    text-sm
  `;
  
  // Direction-specific classes
  const directionClasses = direction === 'up' 
    ? `
      ${active 
        ? 'text-[#5AC8FA] border-[#5AC8FA]/50 bg-[#5AC8FA]/15' 
        : 'text-[#5AC8FA]/70 border-[#5AC8FA]/30 bg-[#1c232e]'}
      hover:text-[#5AC8FA] hover:border-[#5AC8FA]/50 hover:bg-[#5AC8FA]/10
      focus:ring-[#5AC8FA]
    `
    : `
      ${active 
        ? 'text-[#FF8AB3] border-[#FF8AB3]/50 bg-[#FF8AB3]/15' 
        : 'text-[#FF8AB3]/70 border-[#FF8AB3]/30 bg-[#1c232e]'}
      hover:text-[#FF8AB3] hover:border-[#FF8AB3]/50 hover:bg-[#FF8AB3]/10
      focus:ring-[#FF8AB3]
    `;
  
  // Active state classes
  const activeClasses = active ? 'active:translate-y-px' : '';
  
  // Combine all classes
  const classes = `
    ${baseClasses}
    ${directionClasses}
    ${activeClasses}
    ${className}
  `.trim();
  
  // Icon based on direction
  const icon = direction === 'up' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
  
  return (
    <button
      className={classes}
      onClick={onToggle}
      {...props}
    >
      {icon}
      {score !== undefined && (
        <span className="ml-1 text-xs">{score}</span>
      )}
    </button>
  );
};

export default VoteButton;