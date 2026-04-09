import React from 'react';

export default function Badge({ children, variant = 'info', className = '', ...props }) {
  const variants = {
    success: "bg-[#EDFCF2] text-[#12A150]",
    warning: "bg-[#FFF8EB] text-[#E8930C]",
    error: "bg-[#FFF0F0] text-[#E5383B]",
    info: "bg-[#EBF5FF] text-[#0070F3]",
    brand: "bg-[#FF6600]/10 text-[#FF6600]",
    active: "bg-[#EDFCF2] text-[#12A150]",
    pending: "bg-[#FFF8EB] text-[#E8930C]",
    production: "bg-[#FF6600]/10 text-[#FF6600]"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${variants[variant] || variants.info} ${className}`} {...props}>
      {children}
    </span>
  );
}
