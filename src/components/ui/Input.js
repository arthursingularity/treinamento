import React from 'react';

export default function Input({ className = '', hasError = false, hasFocus = false, ...props }) {
  const baseClass = "px-3.5 py-2.5 rounded-md text-[14px] outline-none w-full max-w-[220px] transition-all duration-150";
  
  const defaultClass = hasFocus 
    ? "border border-[#FF6600] bg-white text-[#1A1A1A] shadow-[0_0_0_3px_rgba(255,102,0,0.1)]"
    : "border border-[#E2E2E5] bg-white text-[#1A1A1A] focus:border-[#FF6600] focus:shadow-[0_0_0_3px_rgba(255,102,0,0.1)]";
    
  const errorClass = "border border-[#E5383B] bg-[#FFF0F0] text-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(229,56,59,0.1)]";
  
  return (
    <input 
      className={`${baseClass} ${hasError ? errorClass : defaultClass} ${className}`} 
      {...props} 
    />
  );
}
