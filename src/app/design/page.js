"use client";
import { useState } from "react";
import { Add, TrashCan, Carbon, Play, PlayFilledAlt } from '@carbon/icons-react';

/* ═══════════════════════════════════════════
   IRON LOCK ERP — DESIGN SYSTEM TOKENS
   Brand: #FF6600 · #333333 · #FFFFFF · #DADADA
   ═══════════════════════════════════════════ */

const T = {
  colors: {
    brand: { primary: "#FF6600", primaryHover: "#E65C00", primaryActive: "#CC5200", secondary: "#333333", secondaryHover: "#444444", white: "#FFFFFF", light: "#DADADA" },
    bg: { page: "#F7F7F8", surface: "#FFFFFF", surfaceHover: "#FAFAFA", muted: "#F0F0F2", dark: "#1A1A1A", darkSurface: "#242424" },
    fg: { default: "#1A1A1A", secondary: "#555555", muted: "#888888", disabled: "#BBBBBB", inverse: "#FFFFFF", accent: "#FF6600" },
    gray: { 50: "#FAFAFA", 100: "#F5F5F5", 200: "#EAEAEC", 300: "#DADADA", 400: "#ACACAC", 500: "#888888", 600: "#666666", 700: "#444444", 800: "#333333", 900: "#1A1A1A" },
    semantic: { success: "#12A150", successBg: "#EDFCF2", warning: "#E8930C", warningBg: "#FFF8EB", error: "#E5383B", errorBg: "#FFF0F0", info: "#0070F3", infoBg: "#EBF5FF" },
    border: { default: "#E2E2E5", hover: "#CCCCCC", focus: "#FF6600", error: "#E5383B", strong: "#333333" },
  },
  font: {
    family: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    sizes: { xs: 11, sm: 12, label: 13, bodySm: 14, body: 15, subtitle: 16, titleSm: 18, title: 20, headingSm: 24, heading: 28, displaySm: 32, display: 40 },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeights: { tight: 1.15, snug: 1.25, normal: 1.5, relaxed: 1.6 },
    letterSpacing: { tight: "-0.03em", slight: "-0.015em", normal: "0", wide: "0.04em", caps: "0.08em" },
  },
  spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
  radius: { none: 0, sm: 4, base: 6, md: 8, lg: 12, xl: 16, full: 9999 },
  shadows: {
    xs: "0 1px 2px rgba(0,0,0,0.05)",
    sm: "0 2px 4px rgba(0,0,0,0.06)",
    md: "0 4px 12px rgba(0,0,0,0.08)",
    lg: "0 8px 24px rgba(0,0,0,0.1)",
    xl: "0 16px 48px rgba(0,0,0,0.12)",
    card: "0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.06)",
    focus: "0 0 0 2px #fff, 0 0 0 4px #FF6600",
  },
  transitions: { fast: "150ms ease", base: "200ms ease", slow: "300ms ease-in-out" },
};

/* ── Helpers ── */
const Swatch = ({ color, name, border }) => (
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

const Section = ({ title, children }) => (
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

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-[#E2E2E5] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),_0_6px_16px_rgba(0,0,0,0.06)] ${className}`}
  >
    {children}
  </div>
);

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
          <Add size={24} />
          <TrashCan size={32} />
          <Carbon size={20} fill="blue" />
          <Play size={20} fill="blue" />
          <PlayFilledAlt size={20} className="fill-orange-500 hover:fill-orange-600"/>
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
              {[
                {
                  label: "Primário",
                  cls: "bg-[#FF6600] text-white hover:bg-[#E65C00]",
                },
                {
                  label: "Secundário",
                  cls: "bg-[#333333] text-white hover:bg-[#444444]",
                },
                {
                  label: "Outline",
                  cls: "bg-transparent text-[#FF6600] border-[1.5px] border-[#FF6600] hover:bg-[#FF6600]/10",
                },
                {
                  label: "Ghost",
                  cls: "bg-transparent text-[#1A1A1A] border border-[#E2E2E5] hover:bg-[#F0F0F2]",
                },
                {
                  label: "Danger",
                  cls: "bg-[#E5383B] text-white hover:bg-[#E5383B]/90",
                },
                {
                  label: "Disabled",
                  cls: "bg-[#F0F0F2] text-[#BBBBBB] cursor-not-allowed",
                },
              ].map((b, i) => (
                <button
                  key={i}
                  className={`px-5 py-2.5 rounded-md text-[14px] font-semibold transition-all duration-150 tracking-[-0.015em] ${b.cls}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="h-px bg-[#E2E2E5] mb-6" />
            <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-4">
              Inputs
            </div>
            <div className="flex gap-4 flex-wrap mb-6">
              <input
                placeholder="Input padrão"
                className="px-3.5 py-2.5 rounded-md border border-[#E2E2E5] text-[14px] outline-none bg-white text-[#1A1A1A] w-[220px] transition-all duration-150"
              />
              <input
                placeholder="Com foco"
                className="px-3.5 py-2.5 rounded-md border-2 border-[#FF6600] text-[14px] outline-none bg-white text-[#1A1A1A] w-[220px] shadow-[0_0_0_3px_rgba(255,102,0,0.1)]"
              />
              <input
                placeholder="Erro"
                className="px-3.5 py-2.5 rounded-md border border-[#E5383B] text-[14px] outline-none bg-[#FFF0F0] text-[#1A1A1A] w-[220px]"
              />
            </div>
            <div className="h-px bg-[#E2E2E5] mb-6" />
            <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#888888] mb-4">
              Badges
            </div>
            <div className="flex gap-2.5 flex-wrap">
              {[
                { label: "Ativo", cls: "bg-[#EDFCF2] text-[#12A150]" },
                { label: "Pendente", cls: "bg-[#FFF8EB] text-[#E8930C]" },
                { label: "Erro", cls: "bg-[#FFF0F0] text-[#E5383B]" },
                { label: "Info", cls: "bg-[#EBF5FF] text-[#0070F3]" },
                { label: "Produção", cls: "bg-[#FF6600]/10 text-[#FF6600]" },
              ].map((b, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold ${b.cls}`}
                >
                  {b.label}
                </span>
              ))}
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
