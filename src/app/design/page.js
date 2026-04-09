"use client";
import { useState } from "react";
import { Add, TrashCan, Carbon, Play, PlayFilledAlt } from '@carbon/icons-react';

import { tokens as T } from "../../lib/tokens";

import Section from "../../components/design-system/Section";
import Swatch from "../../components/design-system/Swatch";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

/* ═══ PAGE ═══ */
export default function DesignSystemPage() {
  const [activeBtn, setActiveBtn] = useState("primary");

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans text-[#1A1A1A] antialiased">
      {/* ── TOPBAR ── */}
      <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-8 bg-white/80 border-b border-[#E2E2E5] backdrop-blur-[20px]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#FF6600] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <span className="text-[16px] font-semibold tracking-[-0.03em]">IRON LOCK</span>
          <span className="text-[12px] text-[#888888] font-medium ml-1">Design System</span>
        </div>
        <span className="text-[11px] font-mono text-[#888888] bg-[#F0F0F2] px-2.5 py-1 rounded-full font-medium">
          v1.0.0
        </span>
      </header>

      <main className="max-w-[1080px] mx-auto px-8 pt-10 pb-20">
        {/* ── HERO ── */}
        <div className="mb-14">
          <div className="text-[12px] font-semibold text-[#FF6600] uppercase tracking-[0.08em] mb-2">
            ERP Industrial
          </div>
          <h1 className="text-[40px] font-bold text-[#1A1A1A] tracking-[-0.03em] leading-[1.15] m-0">
            Design System
          </h1>
          <div className="flex items-center gap-2 mt-4">
            <Add size={24} />
            <TrashCan size={32} />
            <Carbon size={20} fill="blue" />
            <Play size={20} fill="blue" />
            <PlayFilledAlt size={20} className="fill-orange-500 hover:fill-orange-600"/>
          </div>
          <p className="text-[16px] text-[#555555] leading-[1.6] mt-3 max-w-[600px]">
            Tokens e componentes para o ERP da fábrica multinacional de cadeados e fechaduras. Projetado para
            transmitir autoridade, precisão e tecnologia.
          </p>
        </div>

        {/* ═══ 1. COLORS ═══ */}
        <Section title="Paleta de Cores">
          <Card>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-4">
              Marca
            </h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-7">
              {Object.entries(T.colors.brand).map(([k, v]) => (
                <Swatch key={k} name={k} color={v} border={v === "#FFFFFF" || v === "#DADADA"} />
              ))}
            </div>
            <div className="h-px bg-[#E2E2E5] mb-6" />
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-4">
              Gray Scale
            </h3>
            <div className="flex rounded-xl overflow-hidden mb-7">
              {Object.entries(T.colors.gray).map(([k, v]) => (
                <div
                  key={k}
                  className="flex-1 h-14 flex flex-col items-center justify-end pb-1.5"
                  style={{ backgroundColor: v }}
                >
                  <span
                    className={`text-[9px] font-mono font-medium ${parseInt(k) >= 500 ? "text-white" : "text-[#333333]"
                      }`}
                  >
                    {k}
                  </span>
                </div>
              ))}
            </div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-4">
              Semânticas
            </h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
              {Object.entries(T.colors.semantic).map(([k, v]) => (
                <Swatch key={k} name={k} color={v} border={v.startsWith("#F") || v.startsWith("#E")} />
              ))}
            </div>
          </Card>
        </Section>

        {/* ═══ 2. TYPOGRAPHY ═══ */}
        <Section title="Tipografia">
          <Card>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-3">
                  Font Families
                </div>
                <div className="text-[18px] font-sans font-semibold mb-1">Geist Sans</div>
                <div className="text-[14px] text-[#555555] mb-4">Interface primária — headers, body, labels</div>
                <div className="text-[18px] font-mono font-medium mb-1">Geist Mono</div>
                <div className="text-[14px] text-[#555555]">Dados numéricos, códigos, tabelas</div>
              </div>
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-3">
                  Pesos
                </div>
                {Object.entries(T.font.weights).map(([k, v]) => (
                  <div key={k} className="text-[15px] mb-1.5" style={{ fontWeight: v }}>
                    {v} — {k.charAt(0).toUpperCase() + k.slice(1)}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-px bg-[#E2E2E5] mb-6" />
            <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-4">
              Escala de Tamanhos
            </div>
            {Object.entries(T.font.sizes).map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline gap-4 pb-2 border-b border-[#F0F0F2] mb-2"
              >
                <span className="text-[11px] font-mono text-[#888888] w-20 shrink-0">{k}</span>
                <span className="text-[11px] font-mono text-[#FF6600] w-10 shrink-0">{v}px</span>
                <span
                  className="leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{
                    fontSize: v,
                    fontWeight: v >= 24 ? 700 : v >= 16 ? 600 : 400,
                  }}
                >
                  Cadeados & Fechaduras
                </span>
              </div>
            ))}
          </Card>
        </Section>

        {/* ═══ 3. SPACING ═══ */}
        <Section title="Espaçamento">
          <Card>
            <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-4">
              Escala (base 4px)
            </div>
            <div className="flex flex-col gap-1.5">
              {T.spacing
                .filter((s) => s > 0)
                .map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-[#888888] w-[50px] text-right shrink-0">
                      {s}px
                    </span>
                    <div
                      className="h-5 rounded-[3px] bg-[#FF6600]/10 border border-[#FF6600]/25"
                      style={{ width: s }}
                    />
                  </div>
                ))}
            </div>
          </Card>
        </Section>

        {/* ═══ 4. BORDERS & RADIUS ═══ */}
        <Section title="Bordas & Raios">
          <Card>
            <div className="flex gap-5 flex-wrap mb-8">
              {Object.entries(T.radius)
                .filter(([k]) => k !== "none")
                .map(([k, v]) => (
                  <div key={k} className="flex flex-col items-center gap-2">
                    <div
                      className="w-14 h-14 border-2 border-[#FF6600] bg-[#FF6600]/10"
                      style={{ borderRadius: v }}
                    />
                    <span className="text-[11px] font-mono text-[#888888]">{k}</span>
                    <span className="text-[10px] font-mono text-[#BBBBBB]">{v}px</span>
                  </div>
                ))}
            </div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-3">
              Estilos de Borda
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
              {Object.entries(T.colors.border).map(([k, v]) => (
                <div
                  key={k}
                  className="p-4 rounded-md flex flex-col items-center gap-1"
                  style={{ border: `2px solid ${v}` }}
                >
                  <span className="text-[12px] font-medium">{k}</span>
                  <span className="text-[11px] font-mono text-[#888888]">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* ═══ 5. SHADOWS ═══ */}
        <Section title="Sombras">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
            {Object.entries(T.shadows).map(([k, v]) => (
              <div
                key={k}
                className="bg-white rounded-xl p-6 flex flex-col items-center gap-2 border border-[#E2E2E5]"
                style={{ boxShadow: v }}
              >
                <span className="text-[14px] font-semibold">{k}</span>
                <span className="text-[10px] font-mono text-[#888888] text-center leading-[1.4] max-w-[160px] break-all">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ 6. COMPONENTS ═══ */}
        <Section title="Componentes">
          <Card className="mb-5">
            <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-4">
              Botões
            </div>
            <div className="flex gap-3 flex-wrap mb-6">
              <Button variant="primary">Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="disabled" disabled>Disabled</Button>
            </div>
            <div className="h-px bg-[#E2E2E5] mb-6" />
            <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-4">
              Inputs
            </div>
            <div className="flex gap-4 flex-wrap mb-6">
              <Input placeholder="Input padrão" />
              <Input placeholder="Com foco" hasFocus={true} />
              <Input placeholder="Erro" hasError={true} />
            </div>
            <div className="h-px bg-[#E2E2E5] mb-6" />
            <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-4">
              Badges
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <Badge variant="success">Ativo</Badge>
              <Badge variant="warning">Pendente</Badge>
              <Badge variant="error">Erro</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="brand">Produção</Badge>
            </div>
          </Card>
        </Section>

        {/* ═══ 7. TRANSITIONS ═══ */}
        <Section title="Transições">
          <Card>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(T.transitions).map(([k, v]) => (
                <div
                  key={k}
                  className="p-4 rounded-md border border-[#E2E2E5] text-center"
                >
                  <div className="text-[15px] font-semibold mb-1">{k}</div>
                  <div className="text-[12px] font-mono text-[#888888]">{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      </main>
    </div>
  );
}
