import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E2E2E5] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),_0_6px_16px_rgba(0,0,0,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}
