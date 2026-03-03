'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function buscarProdutos() {
      const resposta = await fetch('/api/produtos');
      const dados = await resposta.json();
      if (Array.isArray(dados)) setProdutos(dados);
    }
    buscarProdutos();
  }, []);

  return (
    <div className="max-w-[960px] mx-auto px-6 py-10">

      {/* Janela estilo macOS */}
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden shadow-[0px_4px_10px_rgba(0,0,0,0.1)]">

        {/* Barra de título com botões de janela */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--sidebar-bg)] border-b border-[var(--separator)]">
          <span className="w-3 h-3 rounded-full bg-[var(--window-close)]" />
          <span className="w-3 h-3 rounded-full bg-[var(--window-minimize)]" />
          <span className="w-3 h-3 rounded-full bg-[var(--window-zoom)]" />
          <span className="flex-1 text-center text-[13px] font-semibold text-[var(--text-secondary)]">
            Produtos
          </span>
        </div>

        {/* Cabeçalho da seção */}
        <div className="px-5 pt-4 pb-2">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Lista de Produtos
          </h2>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--separator)] bg-[var(--sidebar-bg)]">
                {['Código', 'Descrição', 'Saldo'].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto, index) => (
                <tr
                  key={produto.ID || index}
                  className={`
                    border-b border-[var(--separator)] last:border-b-0
                    cursor-default
                    hover:bg-[var(--row-hover)]
                    ${index % 2 !== 0 ? 'bg-[var(--row-alt)]' : ''}
                  `}
                >
                  <td className="px-5">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[12px] font-medium bg-[var(--badge-bg)] text-[var(--badge-text)]">
                      {produto.PRODUTO}
                    </span>
                  </td>
                  <td className="px-5 py-1 font-medium text-[13px]">
                    {produto.DESCRICAO}
                  </td>
                  <td className="px-5 py-1 font-mono font-medium text-[13px]">
                    {produto.SALDO?.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}