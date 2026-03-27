"use client";
import React, { useState, useEffect } from "react";

export default function LoadingPage() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let timeout;
    if (stage === 0) {
      // Stage 1: 2 segundos
      timeout = setTimeout(() => setStage(1), 3000);
    } else if (stage === 1) {
      // Stage 2: 1 segundo
      timeout = setTimeout(() => setStage(2), 2000);
    } else if (stage === 2) {
      // Stage 3: 2 segundos
      timeout = setTimeout(() => setStage(3), 3000);
    }
    // Stage 4: indeterminado (sem timeout)

    return () => clearTimeout(timeout);
  }, [stage]);

  const stages = [
    { text: "Conectando ao TOTVS Protheus...", progress: 15, check: false },
    { text: "Conectado ao TOTVS Protheus", progress: 40, check: true },
    { text: "Realizando movimentação...", progress: 70, check: false },
    { text: "Finalizando...", progress: 95, check: false },
  ];

  const current = stages[stage];

  return (
    <div className="flex bg-[#1C1C1E] min-h-screen items-center justify-center p-4">
      <div 
        className="bg-white rounded-[20px] w-[320px] flex flex-col items-center justify-between pt-8 pb-7 px-6 relative"
        style={{
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)"
        }}
      >
        {/* SVG Spinner e Logo */}
        <div className="relative w-[60px] h-[60px] flex items-center justify-center mt-2">
          {/* Círculo base */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="44" stroke="#E5E5EA" strokeWidth="6" fill="none" />
          </svg>
          {/* Círculo animado */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_1s_ease-in-out_infinite]" viewBox="0 0 100 100">
             <circle 
               cx="50" cy="50" r="44" 
               stroke="#1D98CD" 
               strokeWidth="6" 
               fill="none" 
               strokeDasharray="70 206" 
               strokeLinecap="round" 
             />
          </svg>
          {/* Logo 'S' */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/imagens/Sem%20t%C3%ADtulo.png" 
            alt="Logo S" 
            className="w-[24px] object-contain opacity-75 relative" 
          />
        </div>

        {/* Texto do status */}
        <div className="text-[16px] font-medium text-[#4A4A4D] h-[20px] flex items-center justify-center gap-1.5 w-full mt-6">
          {current.check && (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          <span className="truncate tracking-tight">{current.text}</span>
        </div>

        {/* Barra de Progresso Linear */}
        <div className="w-full bg-[#E5E5EA] h-[4px] rounded-full overflow-hidden mt-5">
          <div 
            className="h-full bg-[#1D98CD] transition-all duration-1000 ease-in-out rounded-full" 
            style={{ width: `${current.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}