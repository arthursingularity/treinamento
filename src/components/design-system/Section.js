import React from 'react';

export default function Section({ title, children }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-[24px] font-bold text-[#1A1A1A] tracking-[-0.03em] m-0">
          {title}
        </h2>
        <div className="flex-1 h-px bg-[#E2E2E5]" />
      </div>
      {children}
    </section>
  );
}
