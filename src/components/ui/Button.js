import React from 'react';

export default function Button({ children, variant = 'primary', className = '', disabled, ...props }) {
  const baseClass = "px-5 py-2.5 rounded-md text-[14px] font-semibold transition-all duration-150 tracking-[-0.015em] focus:outline-none focus:ring-2 focus:ring-[#FF6600]/50";
  const variants = {
    primary: "bg-[#FF6600] text-white hover:bg-[#E65C00]",
    secondary: "bg-[#333333] text-white hover:bg-[#444444]",
    outline: "bg-transparent text-[#FF6600] border-[1.5px] border-[#FF6600] hover:bg-[#FF6600]/10",
    ghost: "bg-transparent text-[#1A1A1A] border border-[#E2E2E5] hover:bg-[#F0F0F2]",
    danger: "bg-[#E5383B] text-white hover:bg-[#E5383B]/90",
    disabled: "bg-[#F0F0F2] text-[#BBBBBB] cursor-not-allowed",
  };
  
  const currentVariant = disabled ? 'disabled' : variant;

  return (
    <button 
      className={`${baseClass} ${variants[currentVariant] || variants.primary} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
