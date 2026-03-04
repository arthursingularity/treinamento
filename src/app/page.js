'use client';

import { useState, useEffect, useMemo } from 'react';
import DataTable from '@/components/DataTable';
import ModalIncluirProduto from '@/components/ModalIncluirProduto';

/* ─── Mock data – Ordens de Serviço ─── */
const MOCK_OS = [
  { NUM: 'OS000057', FILA: '001', EQUIPAMENTO: 'ALB.014', DESCRICAO_BEM: 'ALIM. Nº30- IEMCA(TORNEARIA)', LOCALIZACAO: 'MONT GUARNICOES', TIPO_SOLIC: 'MANUTENÇÃO ELÉTRICA', MANUTENCAO: 'CORRETIVA', OBSERVACAO: '', PRIORIDADE: 'URGENTE', TECNICO: 'MARCOS FERREIRA', ABERTURA: '23/02/26, 15:32', SOLICITANTE: 'MARCELOF' },
  { NUM: 'OS000039', FILA: '002', EQUIPAMENTO: 'RET.045', DESCRICAO_BEM: 'RETIFICADOR Nº46 R.C.V 1500A', LOCALIZACAO: 'MONT FECHADURAS A', TIPO_SOLIC: 'MANUTENÇÃO ELÉTRICA', MANUTENCAO: 'CORRETIVA', OBSERVACAO: 'ENGRENAGEM PAROU', PRIORIDADE: 'ALTA', TECNICO: 'CARLOS SANTOS', ABERTURA: '09/01/26, 23:47', SOLICITANTE: 'ARTHURM' },
  { NUM: 'OS000036', FILA: '020', EQUIPAMENTO: 'RET.045', DESCRICAO_BEM: 'RETIFICADOR Nº46 R.C.V 1500A', LOCALIZACAO: 'MONT FECHADURAS A', TIPO_SOLIC: 'MANUTENÇÃO ELÉTRICA', MANUTENCAO: 'CORRETIVA', OBSERVACAO: '', PRIORIDADE: 'NORMAL', TECNICO: '', ABERTURA: '09/01/26, 15:26', SOLICITANTE: 'ARTHURM' },
  { NUM: 'OS000058', FILA: '', EQUIPAMENTO: 'ALB.010', DESCRICAO_BEM: 'ALIM. Nº33 -AKUFEED(TORNEARIA)', LOCALIZACAO: 'MONT GUARNICOES', TIPO_SOLIC: 'MANUTENÇÃO ELÉTRICA', MANUTENCAO: '', OBSERVACAO: 'TESTE DESENVOLVIMENTO', PRIORIDADE: 'BAIXA', TECNICO: 'JOÃO SILVA', ABERTURA: '27/02/26, 16:47', SOLICITANTE: 'LOGANF' },
  { NUM: 'OS000052', FILA: '001', EQUIPAMENTO: 'ALC.014', DESCRICAO_BEM: 'ALIM. ELET. SETREMA Nº14 (AGOST. Nº17)', LOCALIZACAO: 'MONT GUARNICOES', TIPO_SOLIC: 'MANUTENÇÃO ELÉTRICA', MANUTENCAO: 'PREVENTIVA', OBSERVACAO: 'FIO ARREBENTADO', PRIORIDADE: 'MUITO_BAIXA', TECNICO: 'JOÃO SILVA', ABERTURA: '13/02/26, 14:10', SOLICITANTE: 'ARTHURM' },
];

/* ─── Column definitions ─── */
const COLUMNS = [
  { key: 'STATUS', label: '', width: '20px' },
  { key: 'NUM', label: 'Nº', width: '90px' },
  { key: 'FILA', label: 'Fila', width: '45px' },
  { key: 'EQUIPAMENTO', label: 'Equipamento/Bem', width: '120px' },
  { key: 'DESCRICAO_BEM', label: 'Descrição do Bem', width: 'auto', minWidth: '220px' },
  { key: 'LOCALIZACAO', label: 'Localização', width: '160px' },
  { key: 'TIPO_SOLIC', label: 'Tipo de Solicitação', width: '160px' },
  { key: 'MANUTENCAO', label: 'Manutenção', width: '110px' },
  { key: 'OBSERVACAO', label: 'Observação', width: '200px' },
  { key: 'PRIORIDADE', label: 'Prioridade', width: '90px' },
  { key: 'TECNICO', label: 'Técnico Responsável', width: '140px' },
  { key: 'ABERTURA', label: 'Abertura', width: '120px' },
  { key: 'SOLICITANTE', label: 'Solicitante', width: '100px' },
];

/* ─── Priority color map ─── */
const PRIORIDADE_COLORS = {
  URGENTE: 'text-red-600',
  ALTA: 'text-orange-500',
};

/* ─── Status dot colors (macOS traffic lights) ─── */
const STATUS_DOT = {
  URGENTE: '#ff5f57',
  ALTA: '#febc2e',
  NORMAL: '#28c840',
  BAIXA: '#49A7F4',
  MUITO_BAIXA: '#b6b6b6ff',
};

/* ─── Manutenção badge styles ─── */
const MANUTENCAO_STYLES = {
  CORRETIVA: 'text-orange-700',
  PREVENTIVA: 'text-green-700',
};

const TABS = [
  { id: 1, label: 'Controle Geral Produção [02.9.0004]', active: true },
  { id: 2, label: 'Transferência Múltipla [02.9.0004]' },
  { id: 3, label: 'Projeto Competir [02.9.0004]' },
  { id: 4, label: 'Apontar Produção [02.9.0004]' },
];

export default function Home() {
  const [ordens, setOrdens] = useState(MOCK_OS);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModalIncluir, setShowModalIncluir] = useState(false);

  useEffect(() => {
    async function buscarOS() {
      try {
        setIsLoading(true);
        const resposta = await fetch('/api/produtos');
        const dados = await resposta.json();
        if (Array.isArray(dados) && dados.length > 0) {
          // Keep API integration ready
        }
      } catch {
        // keep mock data on error
      } finally {
        setIsLoading(false);
      }
    }
    buscarOS();
  }, []);

  /* ── Filtering (search) ── */
  const filteredOrdens = useMemo(() => {
    if (!searchText.trim()) return ordens;
    const term = searchText.toLowerCase();
    return ordens.filter(
      (os) =>
        os.NUM?.toLowerCase().includes(term) ||
        os.DESCRICAO_BEM?.toLowerCase().includes(term) ||
        os.EQUIPAMENTO?.toLowerCase().includes(term) ||
        os.TECNICO?.toLowerCase().includes(term) ||
        os.OBSERVACAO?.toLowerCase().includes(term)
    );
  }, [ordens, searchText]);

  /* ── Custom cell rendering for colored badges ── */
  const renderCell = (row, col, value) => {
    if (col.key === 'STATUS') {
      const color = STATUS_DOT[row.PRIORIDADE] || '#28c840';
      return (
        <div className="flex items-center justify-center">
          <span
            className="inline-block w-[14px] h-[14px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: color }}
          />
        </div>
      );
    }
    if (col.key === 'PRIORIDADE' && value) {
      const colorClass = PRIORIDADE_COLORS[value] || 'text-black';
      return <span className={colorClass}>{value}</span>;
    }
    return null;
  };

  return (
    <div className="animate-fade-in h-dvh flex flex-col">

      {/* ── Window Shell ── */}
      <div className="flex-1 flex flex-col bg-white border border-[var(--border)] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]">

        {/* ── Title Bar ── */}
        <div className="flex items-center px-[2px] py-[2px] bg-[#0079B8] border-b border-black/10 select-none">
          <div className="flex gap-[2px] flex-1 overflow-x-auto">
            {TABS.map((tab) => (
              <div key={tab.id} className={`tab-item ${tab.active ? 'active' : ''}`}>
                {tab.label}
                <span className="text-sm leading-none text-gray-400 cursor-pointer ml-1 rounded-sm w-4 h-4 flex items-center justify-center transition-all hover:bg-black/10 hover:text-gray-700">×</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Header Info ── */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--sidebar-bg)] border-b border-[var(--separator)] text-xs">
          <div className="flex items-center gap-2">
            <img src='/imagens/logo.svg' className='w-[55px]' />
            <span className="text-sm font-medium text-[var(--foreground)]">| Manutenção</span>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-[var(--text-secondary)]">
            <span className="font-semibold">ARTHURM</span>
            <button className="toolbar-btn danger" id="btn-sair">Sair</button>
          </div>
        </div>

        {/* ── Subtitle Bar ── */}
        <div className="px-4 py-2 bg-neutral-700 border-b border-black/8 text-xs font-medium text-white">
          <strong>Gerenciamento OS</strong> &nbsp;–&nbsp; Setor: <strong className="ml-1">MONT FECHADURAS C</strong> &nbsp;–&nbsp; C.Custo: <strong className="ml-1">317111</strong>
        </div>

        {/* ── Toolbar ── */}
        <div className="animate-slide-down flex items-center gap-[1px] px-[1px] py-[2px] bg-gradient-to-b from-[#fafafa] to-[#f0f0f2] border-b border-[var(--toolbar-border)] overflow-x-auto flex-wrap">
          <button className="toolbar-btn secondary" id="btn-incluir" onClick={() => setShowModalIncluir(true)}>Incluir Produto</button>
          <button className="toolbar-btn secondary" id="btn-alterar">Alterar OS</button>
          <button className="toolbar-btn secondary" id="btn-situacao">Atribuir</button>
          <button className="toolbar-btn secondary" id="btn-inventario">Filtro <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width={15} height={15}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></button>
          <button className="toolbar-btn secondary" id="btn-apontamento">Legenda <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width={15} height={15}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></button>
          <button className="toolbar-btn secondary" id="btn-necessidades">Atualizar</button>
        </div>

        {/* ── Data Table ── */}
        <DataTable
          columns={COLUMNS}
          data={filteredOrdens}
          isLoading={isLoading}
          selectedId={selectedId}
          onSelect={setSelectedId}
          idKey="NUM"
          renderCell={renderCell}
        />

        {/* ── Status Bar ── */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-[var(--status-bar-bg)] border-t border-black/8 text-[11px] text-[var(--text-secondary)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <kbd className="status-kbd">F4</kbd>
              <span>Saldo nos Almoxarifados</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="status-kbd">F6</kbd>
              <span>Estrutura</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="status-kbd">F8</kbd>
              <span>Histórico</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="status-kbd">F12</kbd>
              <span>Imprimir</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>{filteredOrdens.length} ordens</span>
            {selectedId && (
              <span className="font-medium text-[var(--accent)]">
                Selecionado: {selectedId}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal: Incluir Produto ── */}
      <ModalIncluirProduto
        isOpen={showModalIncluir}
        onClose={() => setShowModalIncluir(false)}
      />
    </div>
  );
}