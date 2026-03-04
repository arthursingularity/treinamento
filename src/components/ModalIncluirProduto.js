'use client';

import { useState } from 'react';

/**
 * ModalIncluirProduto – Modal de cadastro de produto
 * Estética macOS: cantos arredondados, sombras suaves, frosted glass, tipografia limpa.
 * 90% Tailwind / 10% CSS (apenas animação de entrada no globals.css)
 *
 * Props:
 *  - isOpen:   boolean
 *  - onClose:  () => void
 */
export default function ModalIncluirProduto({ isOpen, onClose }) {
    const [form, setForm] = useState({
        produto: '',
        descricao: '',
        centroCusto: '317111',
        estoqueMin: '',
        estoqueAtual: '',
        estoqueCx: '',
        qtdCx: '',
        invRfid: '',
        necessidade: '',
    });

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Apenas front-end por enquanto
        onClose();
    };

    if (!isOpen) return null;

    return (
        /* ── Backdrop ── */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 backdrop-blur-[2px]"
            onClick={onClose}
        >
            {/* ── Modal Window ── */}
            <div
                className="
          animate-modal-in
          w-full max-w-[520px] mx-4
          bg-white/95 backdrop-blur-[20px]
          rounded-xl
          shadow-[0_24px_80px_rgba(0,0,0,0.25),0_8px_24px_rgba(0,0,0,0.12)]
          overflow-hidden
          flex flex-col
        "
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Title Bar ── */}
                <div className="flex items-center justify-between px-3 py-3 bg-neutral-700 border-b border-black/10 select-none relative">
                    <span className="text-[15px] ml-2 font-semibold text-white">
                        Incluir Produto
                    </span>
                    <button
                        onClick={onClose}
                        className="w-5 h-5 rounded cursor-pointer bg-[var(--window-close)] hover:brightness-90 font-semibold text-white transition-all flex items-center justify-center text-xs leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Form Body ── */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Section: Identificação */}
                    <fieldset className="space-y-3">

                        {/* Código do Produto */}
                        <div className="space-y-1">
                            <label htmlFor="modal-produto" className="text-[12px] font-medium text-[#333]">
                                Código do Produto
                            </label>
                            <input
                                id="modal-produto"
                                type="text"
                                placeholder="Ex: 12391003004"
                                value={form.produto}
                                onChange={handleChange('produto')}
                                className="
                                    w-full px-3 py-2 rounded-lg text-[13px]
                                    bg-[#f5f5f7] border border-black/8
                                    text-[var(--foreground)] placeholder-[#aaa]
                                    outline-none
                                    focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 focus:bg-white
                                    transition-all duration-200
                                    "
                            />
                        </div>

                        {/* Descrição */}
                        <div className="space-y-1">
                            <label htmlFor="modal-descricao" className="text-[12px] font-medium text-[#333]">
                                Descrição
                            </label>
                            <input
                                id="modal-descricao"
                                type="text"
                                placeholder="Ex: CHAVE 301/501 GORJE ARGOLADA - NIQUELADO"
                                value={form.descricao}
                                onChange={handleChange('descricao')}
                                className="
                  w-full px-3 py-2 rounded-lg text-[13px]
                  bg-[#f5f5f7] border border-black/8
                  text-[var(--foreground)] placeholder-[#aaa]
                  outline-none
                  focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 focus:bg-white
                  transition-all duration-200
                "
                            />
                        </div>

                        {/* Centro de Custo */}
                        <div className="space-y-1">
                            <label htmlFor="modal-ccusto" className="text-[12px] font-medium text-[#333]">
                                Centro de Custo
                            </label>
                            <input
                                id="modal-ccusto"
                                type="text"
                                placeholder="Ex: 317111"
                                value={form.centroCusto}
                                onChange={handleChange('centroCusto')}
                                className="
                  w-full px-3 py-2 rounded-lg text-[13px]
                  bg-[#f5f5f7] border border-black/8
                  text-[var(--foreground)] placeholder-[#aaa]
                  outline-none
                  focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 focus:bg-white
                  transition-all duration-200
                "
                            />
                        </div>
                    </fieldset>

                    {/* Separator */}
                    <div className="h-px bg-black/6" />

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                px-5 py-[7px] rounded text-[12px] font-medium
                bg-[#f0f0f2] text-[#555] border border-black/8
                hover:bg-[#e5e5e8] active:scale-[0.97]
                transition-all duration-150 cursor-pointer
              "
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="
                px-5 py-[7px] rounded text-[12px] font-semibold
                bg-[var(--accent)] text-white border border-transparent
                hover:brightness-110 active:scale-[0.97]
                shadow-[0_1px_3px_rgba(0,0,0,0.12)]
                transition-all duration-150 cursor-pointer
              "
                        >
                            Salvar Produto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
