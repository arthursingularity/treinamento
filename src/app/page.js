"use client";

import { useState } from "react";
import {
  X, Wrench, Users, Check, Maximize2, Minus, Search,
  CalendarClock, Briefcase, MapPin, AlignLeft, UserPlus
} from "lucide-react";

// Dados Simulados
const tecnicos = [
  { nome: "WELLYSONL", ordens: 1, ativo: true, cargo: "MANUTENCAO ELETRICA" },
  { nome: "ARTHURM", ordens: 1, ativo: true, cargo: "MANUTENCAO ELETRICA" },
  { nome: "CRISTOPHER", ordens: 2, ativo: false, cargo: "MANUTENCAO ELETRICA" },
  { nome: "LOGANF", ordens: 4, ativo: true, cargo: "MANUTENCAO ELETRICA" },
  { nome: "MAICONL", ordens: 5, ativo: false, cargo: "MANUTENCAO ELETRICA" },
  { nome: "RENAM", ordens: 5, ativo: true, cargo: "MANUTENCAO ELETRICA" },
  { nome: "JULIOS", ordens: 3, ativo: true, cargo: "MANUTENCAO ELETRICA" },
  { nome: "FREDERICO", ordens: 0, ativo: true, cargo: "MANUTENCAO ELETRICA" },
  { nome: "ALBERTO", ordens: 2, ativo: false, cargo: "MANUTENCAO ELETRICA" },
  { nome: "GUSTAVO", ordens: 1, ativo: true, cargo: "MANUTENCAO ELETRICA" },
];

const ordemResumo = {
  numero: "OS163721",
  filial: "STAM",
  codigoBem: "MFE.003",
  localizacao: "MONT FECHADURAS C1 MANUAL",
  recursoBem: "ACS GORJE Nº 13",
  observacao: "ENGRENAGEM DA MÁQUINA PAROU DE GIRAR E APRESENTA BARULHO METÁLICO AO TENTAR LIGAR.",
  solicitante: "CESARC",
  tipoManutencao: "CORRETIVA ELÉTRICA",
  prioridade: "ALTA",
  dataAbertura: "10/03/2026 14:30"
};

export default function Home() {
  const [grupo, setGrupo] = useState(["WELLYSONL", "ARTHURM", "LOGANF"]);
  const [search, setSearch] = useState("");

  const toggleGrupo = (nome) => {
    if (grupo.includes(nome)) {
      setGrupo(grupo.filter((n) => n !== nome));
    } else {
      setGrupo([...grupo, nome]);
    }
  };

  const removeGrupo = (nome) => {
    setGrupo(grupo.filter((n) => n !== nome));
  };

  const filteredTecnicos = tecnicos.filter(t => t.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-zinc-200 p-4 sm:p-8 flex items-center justify-center font-sans overflow-hidden relative">
      {/* Main Window Container */}
      <div className="w-full max-w-[1050px] h-[610px] bg-white rounded-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden relative z-10">

        {/* Window Title Bar (macOS style) */}
        <div className="h-[46px] flex justify-between items-center p-4 bg-neutral-900/90 backdrop-blur-md border-b border-zinc-200/80 z-20 shrink-0 relative">
          <span className="text-[14px] font-semibold text-white tracking-wide">
            Gerenciador de Grupos
          </span>
          <X className="w-6 h-6 text-white" />
        </div>

        {/* 3 Column Layout */}
        <div className="flex flex-1 overflow-hidden bg-white">

          {/* Left Column: Techs pool */}
          <div className="w-[280px] flex flex-col border-r border-zinc-200 bg-[#F5F5F7] shrink-0">
            <div className="p-3 py-3 border-b border-zinc-200/80 shrink-0">
              <h2 className="text-[14px] font-semibold text-[#1D1D1F] tracking-wider mb-3 px-1">Técnicos</h2>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-lg py-1.5 pl-9 pr-3 text-[12px] text-zinc-700 focus:outline-none focus:ring-[2px] focus:ring-[#007AFF]/40 focus:border-[#007AFF] placeholder:text-zinc-400 shadow-sm transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
              {filteredTecnicos.map((t) => {
                const inGroup = grupo.includes(t.nome);
                return (
                  <button
                    key={t.nome}
                    onClick={() => toggleGrupo(t.nome)}
                    className={`w-full flex items-center justify-between cursor-pointer pr-2.5 py-2.5 rounded-lg border ${inGroup
                      ? 'bg-[#007AFF] text-white border-[#007AFF] shadow-md'
                      : 'bg-transparent border-transparent hover:bg-zinc-200/80 active:bg-zinc-300/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex shrink-0 items-center justify-center pointer-events-none">
                      </div>
                      <div className="flex flex-col items-start leading-[1.4]">
                        <span className={`text-[13px] font-semibold ${inGroup ? 'text-white' : 'text-[#1D1D1F]'}`}>
                          {t.nome}
                        </span>
                        <span className={`text-[10px] ${inGroup ? 'text-blue-100' : 'text-zinc-500 font-medium'}`}>
                          {t.cargo}
                        </span>

                      </div>

                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold tracking-wide ${inGroup ? 'text-blue-200' : 'text-zinc-400'}`}>
                        {t.ordens} OS
                      </span>
                      {inGroup && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </div>
                  </button>
                )
              })}
              {filteredTecnicos.length === 0 && (
                <div className="text-center py-6 text-zinc-400 text-[12px] font-medium">Nenhum técnico encontrado.</div>
              )}
            </div>
          </div>

          {/* Middle Column: OS Resume */}
          <div className="flex flex-col flex-1 bg-white overflow-hidden relative">
            {/* Header for Middle Column */}
            <div className="h-[50px] border-b border-zinc-100 px-4 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm z-10">
              <h1 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-2.5 tracking-tight">
                {ordemResumo.numero}
              </h1>
              <span className="bg-red-100 text-[#EC6A5E] px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase">
                PRIORIDADE {ordemResumo.prioridade}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

              <div className="space-y-4">
                {/* Top Grid */}
                <div className="grid grid-cols-2 gap-5">
                  <InfoCard label="Filial:" value={ordemResumo.filial} />
                  <InfoCard label="Código do Bem:" value={ordemResumo.codigoBem} />
                </div>

                {/* Full width properties */}
                <div className="space-y-4">
                  <InfoCard label="Localização:" value={ordemResumo.localizacao}/>
                  <InfoCard label="Recurso / Bem:" value={ordemResumo.recursoBem} fullWidth />
                  <InfoCard label="Tipo de Manutenção:" value={ordemResumo.tipoManutencao} fullWidth />
                </div>

                {/* Observação - Highlighted Area */}
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    Observação solicitante:
                  </label>
                  <div className="bg-[#F9FAFB] border border-zinc-200/80 pt-2.5 px-3 h-[70px] rounded-xl text-[12px] font-semibold text-[#1D1D1F]">
                    {ordemResumo.observacao}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <InfoCard label="Solicitante:" value={ordemResumo.solicitante} />
                  <InfoCard label="Abertura:" value={ordemResumo.dataAbertura} icon={<CalendarClock className="w-3.5 h-3.5" />} />
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Group Members */}
          <div className="w-[280px] bg-[#FAFAFA] border-l border-zinc-200 flex flex-col shrink-0 z-10">
            <div className="px-4 py-4 border-b border-zinc-200 bg-white shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-[14px] font-semibold text-[#1D1D1F] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#007AFF]" />
                  Grupo
                </h2>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">
                {grupo.length} {grupo.length === 0 ? "Nenhum técnico no grupo" : "Técnicos designados para esta OS"}
              </p>
            </div>

            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-2">
              {grupo.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-70">
                  <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                    <UserPlus className="w-6 h-6 text-zinc-400" />
                  </div>
                  <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">
                    Selecione técnicos na lista ao lado para compor a equipe.
                  </p>
                </div>
              ) : (
                grupo.map((nome) => {
                  const tInfo = tecnicos.find(t => t.nome === nome) || { cargo: "Não definido" };
                  return (
                    <div key={nome} className="group flex items-center justify-between p-2.5 px-3 bg-white border border-zinc-200 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#007AFF]/30 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex flex-col truncate">
                          <span className="text-[12px] font-semibold text-[#1D1D1F] truncate">{nome}</span>
                          <span className="text-[10px] text-zinc-500 font-medium truncate">{tInfo.cargo}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeGrupo(nome)}
                        className="w-8 h-8 cursor-pointer shrink-0 flex items-center justify-center rounded-lg text-zinc-400 hover:text-[#EC6A5E] hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remover"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            <div className="p-3 bg-white border-t border-zinc-200 shrink-0">
              <button
                disabled={grupo.length === 0}
                className="w-full h-[40px] bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#005ABF] disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white rounded-lg font-medium text-[13px] tracking-wide transition-all disabled:shadow-none flex items-center justify-center gap-2"
              >
                Confirmar
              </button>
            </div>
          </div>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #D4D4D8;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #A1A1AA;
        }
      `}} />
    </div>
  );
}

function InfoCard({ label, value, icon, fullWidth }) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
        {icon && <span>{icon}</span>}
        {label}
      </label>
      <div className="bg-[#F9FAFB] border border-zinc-200/80 px-3 py-2.5 rounded-xl text-[12px] font-semibold text-neutral-800">
        {value}
      </div>
    </div>
  );
}