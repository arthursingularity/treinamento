"use client";
import { useState, useMemo } from "react";

/* ═══════════════════════════════════════════
   IRON LOCK ERP — TOKENS
   ═══════════════════════════════════════════ */
const T = {
  brand: { primary: "#FF6600", primaryHover: "#E65C00", secondary: "#333333", white: "#FFFFFF", light: "#DADADA" },
  bg: { page: "#F7F7F8", surface: "#FFFFFF", muted: "#F0F0F2", selected: "#FFF4EB" },
  fg: { default: "#1A1A1A", secondary: "#555555", muted: "#888888", disabled: "#BBBBBB", inverse: "#FFFFFF", accent: "#FF6600" },
  border: { default: "#E2E2E5", hover: "#CCCCCC", focus: "#FF6600" },
  semantic: { success: "#12A150", successBg: "#EDFCF2", warning: "#E8930C", warningBg: "#FFF8EB", error: "#E5383B", errorBg: "#FFF0F0", info: "#0070F3", infoBg: "#EBF5FF" },
  font: { family: "var(--font-geist-sans), -apple-system, sans-serif", mono: "var(--font-geist-mono), monospace" },
  radius: { sm: 4, base: 6, md: 8, lg: 12, full: 9999 },
  shadow: { card: "0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.06)", sm: "0 2px 4px rgba(0,0,0,0.06)", lg: "0 8px 24px rgba(0,0,0,0.1)" },
};

/* ═══ FAKE DATA ═══ */
const ORDERS = [
  { id: "OP-20260401", product: "Cadeado CR-40 Inox", client: "Leroy Merlin BR", qty: 12000, unit: "un", status: "Em Produção", progress: 67, delivery: "15/04/2026", line: "L-01", priority: "Alta" },
  { id: "OP-20260402", product: "Fechadura MT-500 Digital", client: "Home Depot US", qty: 8500, unit: "un", status: "Aguardando Material", progress: 12, delivery: "22/04/2026", line: "L-03", priority: "Crítica" },
  { id: "OP-20260403", product: "Cadeado SM-25 Latão", client: "Sodimac CL", qty: 25000, unit: "un", status: "Concluído", progress: 100, delivery: "08/04/2026", line: "L-02", priority: "Normal" },
  { id: "OP-20260404", product: "Fechadura EL-700 Slim", client: "Castorama FR", qty: 6000, unit: "un", status: "Em Produção", progress: 45, delivery: "18/04/2026", line: "L-01", priority: "Alta" },
  { id: "OP-20260405", product: "Dobradiça HD-90 Reforçada", client: "Obi DE", qty: 40000, unit: "un", status: "QA / Inspeção", progress: 88, delivery: "10/04/2026", line: "L-04", priority: "Normal" },
  { id: "OP-20260406", product: "Cilindro 7P Euro Profile", client: "Brico Dépôt ES", qty: 15000, unit: "un", status: "Em Produção", progress: 34, delivery: "25/04/2026", line: "L-02", priority: "Normal" },
  { id: "OP-20260407", product: "Cadeado HA-60 Anti-Corte", client: "Bunnings AU", qty: 9200, unit: "un", status: "Aguardando Material", progress: 0, delivery: "30/04/2026", line: "L-05", priority: "Alta" },
  { id: "OP-20260408", product: "Fechadura BM-300 Biométrica", client: "Amazon US", qty: 3000, unit: "un", status: "Em Produção", progress: 78, delivery: "12/04/2026", line: "L-03", priority: "Crítica" },
  { id: "OP-20260409", product: "Kit Fechadura Residence R1", client: "Telhanorte BR", qty: 5000, unit: "un", status: "Concluído", progress: 100, delivery: "05/04/2026", line: "L-01", priority: "Normal" },
  { id: "OP-20260410", product: "Trinco Rolete TR-20", client: "Wickes UK", qty: 30000, unit: "un", status: "Em Produção", progress: 56, delivery: "20/04/2026", line: "L-04", priority: "Normal" },
  { id: "OP-20260411", product: "Espelho 501 Cromado", client: "Lowe's US", qty: 18000, unit: "un", status: "QA / Inspeção", progress: 92, delivery: "09/04/2026", line: "L-02", priority: "Alta" },
  { id: "OP-20260412", product: "Cadeado TT-50 Travel Lock", client: "Decathlon FR", qty: 22000, unit: "un", status: "Aguardando Material", progress: 5, delivery: "02/05/2026", line: "L-05", priority: "Normal" },
];

const ALERTS = [
  { id: 1, type: "error", msg: "Linha L-03: Parada não programada — motor principal", time: "14 min atrás" },
  { id: 2, type: "warning", msg: "Estoque de latão abaixo do mínimo (320 kg restantes)", time: "47 min atrás" },
  { id: 3, type: "info", msg: "Manutenção preventiva L-04 agendada para 10/04", time: "2h atrás" },
  { id: 4, type: "success", msg: "OP-20260403 concluída com 0 defeitos — QA aprovado", time: "3h atrás" },
  { id: 5, type: "warning", msg: "Lead time do fornecedor Zinco+ aumentou para 12 dias", time: "5h atrás" },
];

const KPI = [
  { label: "Ordens Ativas", value: "8", sub: "+2 esta semana", icon: "📋" },
  { label: "Produção Hoje", value: "14.280", sub: "un fabricadas", icon: "⚙️" },
  { label: "OEE Geral", value: "76,4%", sub: "↑ 2,1% vs ontem", icon: "📊" },
  { label: "Entregas Pontuais", value: "94%", sub: "último mês", icon: "🚚" },
];

/* ═══ HELPERS ═══ */
const statusStyle = (s) => {
  if (s === "Concluído") return { bg: T.semantic.successBg, color: T.semantic.success };
  if (s === "Em Produção") return { bg: T.bg.selected, color: T.brand.primary };
  if (s === "Aguardando Material") return { bg: T.semantic.warningBg, color: T.semantic.warning };
  if (s === "QA / Inspeção") return { bg: T.semantic.infoBg, color: T.semantic.info };
  return { bg: T.bg.muted, color: T.fg.muted };
};
const priorityStyle = (p) => {
  if (p === "Crítica") return { bg: T.semantic.errorBg, color: T.semantic.error };
  if (p === "Alta") return { bg: T.semantic.warningBg, color: T.semantic.warning };
  return { bg: T.bg.muted, color: T.fg.muted };
};
const alertIcon = (t) => ({ error: "🔴", warning: "🟡", info: "🔵", success: "🟢" }[t]);

/* ═══ PAGE ═══ */
export default function ErpExamplePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selectedRow, setSelectedRow] = useState(null);
  const [sidebarTab, setSidebarTab] = useState("alerts");

  const statuses = ["Todos", "Em Produção", "Aguardando Material", "QA / Inspeção", "Concluído"];

  const filtered = useMemo(() =>
    ORDERS.filter(o =>
      (statusFilter === "Todos" || o.status === statusFilter) &&
      (search === "" || o.product.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()) || o.client.toLowerCase().includes(search.toLowerCase()))
    ), [search, statusFilter]);

  const S = {
    page: { minHeight: "100vh", background: T.bg.page, fontFamily: T.font.family, color: T.fg.default, WebkitFontSmoothing: "antialiased", display: "flex", flexDirection: "column" },
    topbar: { height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: T.brand.secondary, color: T.brand.white, flexShrink: 0 },
    topLeft: { display: "flex", alignItems: "center", gap: 12 },
    logo: { width: 28, height: 28, borderRadius: T.radius.base, background: T.brand.primary, display: "flex", alignItems: "center", justifyContent: "center" },
    topNav: { display: "flex", gap: 4, marginLeft: 24 },
    navBtn: (active) => ({ padding: "6px 14px", borderRadius: T.radius.base, border: "none", background: active ? "rgba(255,255,255,0.12)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 150ms ease" }),
    topRight: { display: "flex", alignItems: "center", gap: 16 },
    avatar: { width: 30, height: 30, borderRadius: T.radius.full, background: T.brand.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" },
    body: { flex: 1, display: "flex", overflow: "hidden" },
    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    toolbar: { display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", background: T.bg.surface, borderBottom: `1px solid ${T.border.default}` },
    input: { padding: "8px 12px", borderRadius: T.radius.base, border: `1px solid ${T.border.default}`, fontSize: 13, fontFamily: "inherit", outline: "none", background: T.bg.surface, color: T.fg.default, width: 260, transition: "all 150ms ease" },
    filterBtn: (active) => ({ padding: "6px 14px", borderRadius: T.radius.full, border: `1px solid ${active ? T.brand.primary : T.border.default}`, background: active ? T.bg.selected : T.bg.surface, color: active ? T.brand.primary : T.fg.secondary, fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 150ms ease" }),
    tableWrap: { flex: 1, overflow: "auto", padding: "0 24px 24px" },
    table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 },
    th: { position: "sticky", top: 0, padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: T.fg.muted, background: T.bg.page, borderBottom: `2px solid ${T.border.default}`, whiteSpace: "nowrap", zIndex: 2 },
    td: (sel) => ({ padding: "12px 12px", borderBottom: `1px solid ${T.border.default}`, background: sel ? T.bg.selected : T.bg.surface, transition: "background 100ms ease", whiteSpace: "nowrap" }),
    badge: (s) => ({ display: "inline-block", padding: "3px 10px", borderRadius: T.radius.full, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }),
    progressBar: { width: 80, height: 6, borderRadius: 3, background: T.bg.muted, overflow: "hidden", flexShrink: 0 },
    progressFill: (p) => ({ height: "100%", borderRadius: 3, background: p === 100 ? T.semantic.success : T.brand.primary, width: `${p}%`, transition: "width 300ms ease" }),
    sidebar: { width: 320, borderLeft: `1px solid ${T.border.default}`, background: T.bg.surface, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" },
    sideHeader: { padding: "14px 16px", borderBottom: `1px solid ${T.border.default}`, display: "flex", gap: 4 },
    sideTab: (active) => ({ flex: 1, padding: "6px 0", borderRadius: T.radius.base, border: "none", background: active ? T.bg.selected : "transparent", color: active ? T.brand.primary : T.fg.muted, fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 150ms ease" }),
    sideBody: { flex: 1, overflow: "auto", padding: 16 },
    alertItem: { padding: "12px 14px", borderRadius: T.radius.md, border: `1px solid ${T.border.default}`, marginBottom: 8, background: T.bg.surface, transition: "all 150ms ease", cursor: "pointer" },
    kpiCard: { padding: "18px 16px", borderRadius: T.radius.lg, border: `1px solid ${T.border.default}`, background: T.bg.surface, boxShadow: T.shadow.sm },
    kpiGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  };

  const navItems = ["Dashboard", "Ordens", "Estoque", "Qualidade", "Manutenção", "Relatórios"];

  return (
    <div style={S.page}>

      {/* ── TOPBAR ── */}
      <header style={S.topbar}>
        <div style={S.topLeft}>
          <div style={S.logo}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>IRON LOCK</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginLeft: 2 }}>ERP</span>
          <nav style={S.topNav}>
            {navItems.map((n, i) => (
              <button key={n} style={S.navBtn(i === 1)}>{n}</button>
            ))}
          </nav>
        </div>
        <div style={S.topRight}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: T.font.mono }}>Planta São Paulo — Turno A</span>
          <div style={S.avatar}>AR</div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={S.body}>

        {/* ── MAIN CONTENT ── */}
        <div style={S.main}>

          {/* Toolbar */}
          <div style={S.toolbar}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.fg.muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input style={S.input} placeholder="Buscar ordem, produto ou cliente..." value={search} onChange={e => setSearch(e.target.value)} />
            <div style={{ width: 1, height: 24, background: T.border.default }} />
            {statuses.map(s => (
              <button key={s} style={S.filterBtn(statusFilter === s)} onClick={() => setStatusFilter(s)}>{s}</button>
            ))}
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: T.fg.muted }}>{filtered.length} ordem{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Table */}
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  {["Ordem", "Produto", "Cliente", "Qtd", "Status", "Progresso", "Linha", "Prioridade", "Entrega"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const sel = selectedRow === o.id;
                  const ss = statusStyle(o.status);
                  const ps = priorityStyle(o.priority);
                  return (
                    <tr key={o.id} onClick={() => setSelectedRow(sel ? null : o.id)} style={{ cursor: "pointer" }}>
                      <td style={S.td(sel)}><span style={{ fontFamily: T.font.mono, fontWeight: 600, color: T.brand.primary, fontSize: 12 }}>{o.id}</span></td>
                      <td style={S.td(sel)}><span style={{ fontWeight: 500 }}>{o.product}</span></td>
                      <td style={S.td(sel)}><span style={{ color: T.fg.secondary }}>{o.client}</span></td>
                      <td style={S.td(sel)}><span style={{ fontFamily: T.font.mono, fontSize: 12 }}>{o.qty.toLocaleString("pt-BR")}</span></td>
                      <td style={S.td(sel)}><span style={S.badge(ss)}>{o.status}</span></td>
                      <td style={S.td(sel)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={S.progressBar}><div style={S.progressFill(o.progress)} /></div>
                          <span style={{ fontSize: 11, fontFamily: T.font.mono, color: T.fg.muted, width: 30 }}>{o.progress}%</span>
                        </div>
                      </td>
                      <td style={S.td(sel)}><span style={{ fontFamily: T.font.mono, fontSize: 12 }}>{o.line}</span></td>
                      <td style={S.td(sel)}><span style={S.badge(ps)}>{o.priority}</span></td>
                      <td style={S.td(sel)}><span style={{ fontSize: 12, color: T.fg.secondary }}>{o.delivery}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <aside style={S.sidebar}>
          <div style={S.sideHeader}>
            <button style={S.sideTab(sidebarTab === "alerts")} onClick={() => setSidebarTab("alerts")}>Alertas</button>
            <button style={S.sideTab(sidebarTab === "kpi")} onClick={() => setSidebarTab("kpi")}>KPIs</button>
          </div>
          <div style={S.sideBody}>
            {sidebarTab === "alerts" ? (
              ALERTS.map(a => (
                <div key={a.id} style={S.alertItem}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontSize: 10, lineHeight: "18px" }}>{alertIcon(a.type)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: T.fg.default }}>{a.msg}</div>
                      <div style={{ fontSize: 11, color: T.fg.muted, marginTop: 4 }}>{a.time}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={S.kpiGrid}>
                {KPI.map(k => (
                  <div key={k.label} style={S.kpiCard}>
                    <div style={{ fontSize: 18, marginBottom: 6 }}>{k.icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: T.fg.default, letterSpacing: "-0.02em" }}>{k.value}</div>
                    <div style={{ fontSize: 11, color: T.fg.muted, marginTop: 2 }}>{k.label}</div>
                    <div style={{ fontSize: 11, color: T.semantic.success, marginTop: 4, fontWeight: 500 }}>{k.sub}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
