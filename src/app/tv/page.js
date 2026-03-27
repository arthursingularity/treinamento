"use client";

import { useState, useEffect } from "react";
import { Zap, Play, Pause, Clock, CheckCircle2, ListOrdered, Users, AlertTriangle, RefreshCw, Wifi } from "lucide-react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const TECHNICIANS = [
  { id: 1, name: "João Silva",      role: "ELÉTRICA",  initials: "J", color: "#3B82F6" },
  { id: 2, name: "Carlos Santos",   role: "MECÂNICA",  initials: "C", color: "#F59E0B" },
  { id: 3, name: "Pedro Oliveira",  role: "OFRA!",     initials: "P", color: "#F97316" },
  { id: 4, name: "Marcos Ferreira", role: "ELÉTRICA",  initials: "M", color: "#10B981" },
  { id: 5, name: "Lucas Souza",     role: "MECÂNICA",  initials: "L", color: "#8B5CF6" },
];

const ORDERS = [
  { id: "OS000057", equipId: "ALIM. N°30-IEMCA", equipDesc: "(TORNEARIA)", task: "MONT GUARNIÇÕES", type: "MANUTENÇÃO ELÉTRICA", status: "execucao", techId: 4, elapsed: "509h 57min", priority: "normal" },
  { id: "OS000060", equipId: "RETIFICADOR N°46", equipDesc: "R.C.V 1500A",  task: "MONT FECHADURAS A", type: "MANUTENÇÃO MECÂNICA", status: "execucao", techId: 5, elapsed: "348h 02min", priority: "normal" },
  { id: "OS000047", equipId: "ESTEIRA N°1",      equipDesc: "(FUNDICAO)",    task: "REVISÃO GERAL",     type: "MANUTENÇÃO ELÉTRICA", status: "fila",    techId: 3, elapsed: null,          priority: "normal" },
  { id: "OS000051", equipId: "ALIM. N°30-IEMCA", equipDesc: "(TORNEARIA)",   task: "TROCA DE SENSOR",   type: "MANUTENÇÃO ELÉTRICA", status: "fila",    techId: 3, elapsed: null,          priority: "baixa"  },
  { id: "OS000056", equipId: "AQUECIMENTO ALFATEC",equipDesc:"(REFEITÓRIO)", task: "INSP. RESISTÊNCIAS", type: "MANUTENÇÃO ELÉTRICA", status: "fila",    techId: 3, elapsed: null,          priority: "normal" },
  { id: "OS000042", equipId: "ALIM. N°33-AKUFFFD",equipDesc:"(T...",         task: "MONT GUARNIÇÕES",   type: "MANUTENÇÃO MECÂNICA", status: "pausada", techId: 3, elapsed: "74h 56min",   priority: "normal", pauseReason: "AGUARDANDO FERRAMENTA" },
];

const PRIORITY_LABEL = { normal: "NORMAL", baixa: "BAIXA", alta: "ALTA" };
const PRIORITY_STYLE = {
  normal: { bg: "#1E3A5F", text: "#60A5FA", border: "#2563EB" },
  baixa:  { bg: "#3B2A1A", text: "#FCD34D", border: "#D97706" },
  alta:   { bg: "#3B1A1A", text: "#FCA5A5", border: "#DC2626" },
};

const STATUS_CONFIG = {
  fila:     { label: "Na Fila",         color: "#3B82F6", bg: "rgba(59,130,246,0.12)",  glow: "rgba(59,130,246,0.4)"  },
  execucao: { label: "Em Execução",     color: "#10B981", bg: "rgba(16,185,129,0.12)",  glow: "rgba(16,185,129,0.4)"  },
  pausada:  { label: "Pausada",         color: "#F97316", bg: "rgba(249,115,22,0.12)",  glow: "rgba(249,115,22,0.4)"  },
  encerrada:{ label: "Encerrada",       color: "#6B7280", bg: "rgba(107,114,128,0.12)", glow: "rgba(107,114,128,0.4)" },
};

// ─── HOOK: CLOCK ─────────────────────────────────────────────────────────────

function useClock() {
  const [now, setNow] = useState(new Date("2026-03-16T21:32:49"));
  useEffect(() => {
    const id = setInterval(() => setNow(d => new Date(d.getTime() + 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function KpiCard({ value, label, color, icon: Icon, pulse }) {
  return (
    <div className="relative flex-1 rounded-[16px] overflow-hidden flex flex-col justify-between px-7 py-5" style={{ background: `linear-gradient(135deg, ${color}30 0%, ${color}18 100%)`, border: `1.5px solid ${color}55` }}>
      {pulse && (
        <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full animate-ping" style={{ background: color, opacity: 0.7 }} />
      )}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: color + "25" }}>
          <Icon size={20} color={color} />
        </div>
        <p className="text-[15px] font-semibold text-gray-400 tracking-wide leading-tight">{label}</p>
      </div>
      <p className="text-[56px] font-extralight leading-none mt-2" style={{ color }}>{value}</p>
    </div>
  );
}

function TechCard({ tech, order }) {
  const dotColor = order
    ? order.status === "pausada" ? "#F97316" : "#10B981"
    : "#6B7280";

  return (
    <div className="rounded-[14px] px-5 py-4 flex flex-col gap-3 transition-all duration-300" style={{ background: order ? "#1A2742" : "#141B2D", border: `1.5px solid ${order ? tech.color + "55" : "#1F2D4A"}` }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0" style={{ background: tech.color + "30", color: tech.color }}>
            {tech.initials}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white leading-tight">{tech.name}</p>
            <p className="text-[11px] text-gray-400 font-medium tracking-wider">{tech.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {order && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: STATUS_CONFIG[order.status].bg, color: STATUS_CONFIG[order.status].color }}>
              {STATUS_CONFIG[order.status].label.toUpperCase()}
            </span>
          )}
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />
        </div>
      </div>

      {order ? (
        <div className="bg-[#0F1829] rounded-[10px] p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-white font-mono">{order.id}</span>
            {order.elapsed && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400"><Clock size={10} />{order.elapsed}</span>
            )}
          </div>
          <p className="text-[12px] font-medium" style={{ color: tech.color }}>{order.task}</p>
          <p className="text-[11px] text-gray-400 truncate">{order.equipId} {order.equipDesc}</p>
          {order.pauseReason && (
            <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit" style={{ background: "#F9731620", color: "#F97316", border: "1px solid #F9731640" }}>
              <AlertTriangle size={9}/> {order.pauseReason}
            </span>
          )}
        </div>
      ) : (
        <div className="bg-[#0F1829] rounded-[10px] px-3 py-2 text-[12px] text-gray-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
          Disponível
        </div>
      )}
    </div>
  );
}

function OsQueueCard({ order, tech }) {
  const p = PRIORITY_STYLE[order.priority] || PRIORITY_STYLE.normal;
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-[12px] transition-all hover:brightness-110" style={{ background: "#141B2D", border: `1.5px solid #1F2D4A` }}>
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-[5px] tracking-widest" style={{ background: p.bg, color: p.text, border: `1px solid ${p.border}` }}>
          {PRIORITY_LABEL[order.priority]}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-white font-mono">{order.id}</span>
        </div>
        <p className="text-[12px] text-gray-400 truncate">{order.equipId} {order.equipDesc}</p>
      </div>
      {tech && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: tech.color + "30", color: tech.color }}>{tech.initials}</div>
          <span className="text-[11px] text-gray-400 font-medium">{tech.name.split(" ")[0].toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

function ActiveOsCard({ order, tech }) {
  return (
    <div className="rounded-[14px] p-5 flex flex-col gap-3" style={{ background: "#0D2419", border: "1.5px solid #10B98155" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[14px] font-bold text-white font-mono">{order.id}</span>
        </div>
        <span className="flex items-center gap-1.5 text-[12px] text-gray-400"><Clock size={12} className="text-[#10B981]" />{order.elapsed}</span>
      </div>
      <div>
        <p className="text-[13px] text-[#10B981] font-semibold">{order.task}</p>
        <p className="text-[12px] text-gray-400">{order.equipId} {order.equipDesc}</p>
        <p className="text-[11px] text-gray-500 mt-1">{order.type}</p>
      </div>
      {tech && (
        <div className="flex items-center gap-2.5 bg-[#0A1F14] rounded-[8px] px-3 py-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ background: tech.color + "30", color: tech.color }}>{tech.initials}</div>
          <span className="text-[13px] font-semibold text-white">{tech.name}</span>
        </div>
      )}
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Tv() {
  const now    = useClock();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const execOrders    = ORDERS.filter(o => o.status === "execucao");
  const filaOrders    = ORDERS.filter(o => o.status === "fila");
  const pausedOrders  = ORDERS.filter(o => o.status === "pausada");
  const doneToday     = 0;

  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden select-none" style={{ background: "#0B1120", fontFamily: "'Inter', sans-serif", color: "#fff" }}>

      {/* ── TOPBAR ── */}
      <header className="h-[72px] flex items-center justify-between px-8 shrink-0" style={{ background: "#0F1829", borderBottom: "1.5px solid #1F2D4A" }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #1D4ED8)" }}>
            <Zap size={20} color="#fff" />
          </div>
          <div>
            <p className="text-[18px] font-bold text-white leading-tight">Manutenção Elétrica</p>
            <p className="text-[12px] text-gray-400 font-medium tracking-wide">PAINEL DE CONTROLE OPERACIONAL</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <Wifi size={13} className="text-[#10B981]" />
            <span className="text-[#10B981] font-medium">AO VIVO</span>
          </div>
          <div className="h-8 w-px" style={{ background: "#1F2D4A" }} />
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
            <RefreshCw size={12} className="text-gray-500" />
            <span>Atualização automática</span>
          </div>
          <div className="h-8 w-px" style={{ background: "#1F2D4A" }} />
          <div className="text-right">
            <p className="text-[24px] font-light text-white leading-none font-mono tracking-widest">{timeStr}</p>
            <p className="text-[11px] text-gray-400 capitalize mt-0.5">{dateStr}</p>
          </div>
        </div>
      </header>

      {/* ── KPIs ── */}
      <div className="flex gap-4 px-6 py-4 shrink-0">
        <KpiCard value={filaOrders.length + execOrders.length + pausedOrders.length} label="Abertas"        color="#F59E0B" icon={ListOrdered} />
        <KpiCard value={filaOrders.length}   label="Na Fila"       color="#3B82F6" icon={Clock}        pulse />
        <KpiCard value={execOrders.length}   label="Em Execução"   color="#10B981" icon={Play}         pulse />
        <KpiCard value={pausedOrders.length} label="Pausadas"      color="#F97316" icon={Pause}        />
        <KpiCard value={doneToday}           label="Encerradas Hoje" color="#6B7280" icon={CheckCircle2} />
      </div>

      {/* ── MAIN GRID ── */}
      <div className="flex-1 grid grid-cols-[1fr_1.1fr_1fr] gap-4 px-6 pb-6 min-h-0">

        {/* COL 1 — Técnicos */}
        <section className="flex flex-col gap-3 min-h-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-1 shrink-0">
            <Users size={16} color="#60A5FA" />
            <h2 className="text-[14px] font-semibold text-gray-300 uppercase tracking-widest">Status dos Técnicos</h2>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
            {TECHNICIANS.map(tech => {
              const order = ORDERS.find(o => o.techId === tech.id && (o.status === "execucao" || o.status === "pausada"));
              return <TechCard key={tech.id} tech={tech} order={order} />;
            })}
          </div>
        </section>

        {/* COL 2 — Em Execução + Pausadas */}
        <section className="flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* Em Execução */}
          <div>
            <div className="flex items-center gap-2.5 px-1 mb-3 shrink-0">
              <Play size={16} color="#10B981" />
              <h2 className="text-[14px] font-semibold text-gray-300 uppercase tracking-widest">Em Execução</h2>
              <span className="ml-auto text-[12px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#10B98120", color: "#10B981", border: "1px solid #10B98140" }}>{execOrders.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {execOrders.length === 0 && (
                <div className="rounded-[14px] px-5 py-6 text-center text-gray-500 text-[13px]" style={{ background: "#141B2D", border: "1.5px solid #1F2D4A" }}>Nenhuma OS em execução</div>
              )}
              {execOrders.map(o => {
                const tech = TECHNICIANS.find(t => t.id === o.techId);
                return <ActiveOsCard key={o.id} order={o} tech={tech} />;
              })}
            </div>
          </div>

          {/* Pausadas */}
          {pausedOrders.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2.5 px-1 mb-3">
                <Pause size={16} color="#F97316" />
                <h2 className="text-[14px] font-semibold text-gray-300 uppercase tracking-widest">Pausadas</h2>
                <span className="ml-auto text-[12px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#F9731620", color: "#F97316", border: "1px solid #F9731640" }}>{pausedOrders.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {pausedOrders.map(o => {
                  const tech = TECHNICIANS.find(t => t.id === o.techId);
                  return (
                    <div key={o.id} className="rounded-[14px] p-5 flex flex-col gap-3" style={{ background: "#1A0D06", border: "1.5px solid #F9731640" }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: "#F97316" }} />
                          <span className="text-[14px] font-bold text-white font-mono">{o.id}</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-[12px] text-gray-400"><Clock size={12} className="text-[#F97316]" />{o.elapsed}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "#F97316" }}>{o.task}</p>
                        <p className="text-[12px] text-gray-400">{o.equipId} {o.equipDesc}</p>
                      </div>
                      {o.pauseReason && (
                        <div className="flex items-center gap-2 bg-[#120A04] rounded-[8px] px-3 py-2">
                          <AlertTriangle size={13} color="#F97316" />
                          <span className="text-[12px] font-semibold text-[#F97316]">{o.pauseReason}</span>
                        </div>
                      )}
                      {tech && (
                        <div className="flex items-center gap-2 bg-[#120A04] rounded-[8px] px-3 py-1.5">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: tech.color + "30", color: tech.color }}>{tech.initials}</div>
                          <span className="text-[12px] font-medium text-gray-300">{tech.name}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* COL 3 — Fila */}
        <section className="flex flex-col gap-3 min-h-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-1 shrink-0">
            <ListOrdered size={16} color="#3B82F6" />
            <h2 className="text-[14px] font-semibold text-gray-300 uppercase tracking-widest">Fila de OS</h2>
            <span className="ml-auto text-[12px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#3B82F620", color: "#3B82F6", border: "1px solid #3B82F640" }}>{filaOrders.length}</span>
          </div>

          <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1">
            {filaOrders.length === 0 && (
              <div className="rounded-[14px] px-5 py-6 text-center text-gray-500 text-[13px]" style={{ background: "#141B2D", border: "1.5px solid #1F2D4A" }}>Fila vazia</div>
            )}
            {filaOrders.map((o, i) => {
              const tech = TECHNICIANS.find(t => t.id === o.techId);
              return (
                <div key={o.id} className="flex items-stretch gap-3">
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-1 pb-1">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ background: "#1F2D4A", color: "#3B82F6" }}>{i + 1}</div>
                    {i < filaOrders.length - 1 && <div className="flex-1 w-px" style={{ background: "#1F2D4A" }} />}
                  </div>
                  <div className="flex-1">
                    <OsQueueCard order={o} tech={tech} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary footer */}
          <div className="shrink-0 rounded-[12px] p-4 flex flex-col gap-2" style={{ background: "#141B2D", border: "1.5px solid #1F2D4A" }}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Resumo do Turno</p>
            <div className="grid grid-cols-2 gap-2 text-center">
              {[
                { label: "Total OS",   value: ORDERS.length,        color: "#60A5FA" },
                { label: "Concluídas", value: doneToday,             color: "#10B981" },
                { label: "Pendentes",  value: filaOrders.length + pausedOrders.length, color: "#F59E0B" },
                { label: "Técnicos",   value: TECHNICIANS.length,    color: "#8B5CF6" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col items-center py-2 rounded-[8px]" style={{ background: "#0F1829" }}>
                  <span className="text-[20px] font-light leading-none" style={{ color }}>{value}</span>
                  <span className="text-[10px] text-gray-500 mt-1 tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* ── FOOTER ── */}
      <footer className="h-[36px] flex items-center justify-between px-8 shrink-0" style={{ background: "#080E1A", borderTop: "1px solid #1F2D4A" }}>
        <span className="text-[11px] text-gray-600">Setor de Manutenção Elétrica · Dashboard Operacional</span>
        <span className="text-[11px] text-gray-600">Última atualização: {timeStr} · Atualização automática a cada 30s</span>
      </footer>

    </div>
  );
}