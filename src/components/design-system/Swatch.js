import React from 'react';

export default function Swatch({ color, name, border }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-10 h-10 rounded-md shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${border ? "border border-[#E2E2E5]" : ""
          }`}
        style={{ backgroundColor: color }}
      />
      <div>
        <div className="text-[14px] font-medium text-[#1A1A1A]">{name}</div>
        <div className="text-[12px] font-mono text-[#888888]">{color}</div>
      </div>
    </div>
  );
}
