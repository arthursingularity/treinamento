'use client';

import { useState, useMemo, useCallback } from 'react';

export default function DataTable({
    columns = [],
    data = [],
    isLoading = false,
    selectedId = null,
    onSelect,
    idKey = 'PRODUTO',
    alertFn,
    renderCell,
}) {
    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [checkedRows, setCheckedRows] = useState(new Set());

    /* ── Sorting ── */
    const sortedData = useMemo(() => {
        if (!sortCol) return data;
        return [...data].sort((a, b) => {
            const valA = a[sortCol] ?? '';
            const valB = b[sortCol] ?? '';
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortDir === 'asc' ? valA - valB : valB - valA;
            }
            return sortDir === 'asc'
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });
    }, [data, sortCol, sortDir]);

    const handleSort = useCallback((colKey) => {
        setSortCol((prev) => {
            if (prev === colKey) {
                setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                return colKey;
            }
            setSortDir('asc');
            return colKey;
        });
    }, []);

    /* ── Checkboxes (toggle via double-click or checkbox click) ── */
    const toggleCheck = useCallback((id, e) => {
        if (e) e.stopPropagation();
        setCheckedRows((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
        onSelect?.(id);
    }, [onSelect]);

    /* ── Number formatter ── */
    const fmt = (val) => {
        if (val == null) return '0';
        return Number(val).toLocaleString('pt-BR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
        });
    };

    /* ── Loading skeleton ── */
    if (isLoading) {
        return (
            <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
                <table className="w-full border-collapse text-xs">
                    <thead className="sticky top-0 z-10">
                        <tr>
                            <th className="w-8 text-center p-1" />
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-2.5 py-[7px] text-left text-[10.5px] font-semibold uppercase tracking-wide text-black bg-gradient-to-b from-[#f7f7f9] to-[#ededf0] border-b border-black/10 border-r border-r-black/4 whitespace-nowrap select-none last:border-r-0"
                                    style={{ width: col.width, minWidth: col.minWidth }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <tr key={i} className="border-b border-black/4">
                                <td className="w-8 text-center p-1">
                                    <div className="skeleton-bar mx-auto" style={{ width: 14, height: 14 }} />
                                </td>
                                {columns.map((col) => (
                                    <td key={col.key} className="px-2.5 py-[5px]">
                                        <div className="skeleton-bar" style={{ width: col.numeric ? 60 : '70%' }} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    /* ── Empty state ── */
    if (sortedData.length === 0) {
        return (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-12 px-6 text-[var(--text-secondary)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width={48} height={48} className="text-gray-300 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <p className="text-[13px]">Nenhum registro encontrado.</p>
            </div>
        );
    }

    /* ── Main table ── */
    return (
        <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
            <table className="w-full border-collapse text-xs">
                {/* ── THEAD ── */}
                <thead className="sticky top-0 z-10">
                    <tr>
                        {/* Checkbox column header */}
                        <th className="w-8 text-center p-1 bg-gradient-to-b from-[#F6F6F8] to-[#E6E6E6] border-b border-black/10" />

                        {columns.map((col) => (
                            <th
                                key={col.key}
                                onClick={() => handleSort(col.key)}
                                className={`
                                    px-2.5 py-[7px] text-[10.5px] font-semibold uppercase tracking-wide
                                    text-black whitespace-nowrap
                                    bg-gradient-to-b from-[#F6F6F8] to-[#E8E8E8]
                                    hover:from-[#f0f0f3] hover:to-[#e6e6ea]
                                    border-b border-black/15 border-r border-r-black/15 last:border-r-0
                                    transition-colors duration-100
                                    ${col.numeric ? 'text-right' : 'text-left'}
                                    `}
                                style={{ width: col.width, minWidth: col.minWidth }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* ── TBODY ── */}
                <tbody>
                    {sortedData.map((row, index) => {
                        const rowId = row[idKey];
                        const isChecked = checkedRows.has(rowId);
                        const isEven = index % 2 === 1;
                        const isAlert = alertFn ? alertFn(row) : false;

                        return (
                            <tr
                                key={rowId || index}
                                onDoubleClick={() => toggleCheck(rowId)}
                                className={`
                                    border-b border-black/15 cursor-pointer transition-colors duration-100
                                    ${isChecked
                                        ? 'bg-[var(--accent)] text-white [&_td]:text-white'
                                        : isEven
                                            ? 'bg-black/[0.025] hover:bg-black/[0.1]'
                                            : 'hover:bg-black/[0.1]'
                                    }
                                `}
                            >
                                {/* Checkbox */}
                                <td className="w-8 text-center px-1.5 flex py-1 justify-center items-center border-r border-black/15">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => toggleCheck(rowId, e)}
                                        className="w-3.5 h-3.5 accent-[var(--accentLight)] cursor-pointer rounded-sm"
                                    />
                                </td>

                                {/* Data cells */}
                                {columns.map((col, colIndex) => {
                                    const value = row[col.key];
                                    const isFirstCol = colIndex === 0;
                                    const isAlertCell = isAlert && col.key === 'EST_ATUAL';

                                    // Custom cell rendering
                                    const customContent = renderCell ? renderCell(row, col, value) : null;

                                    return (
                                        <td
                                            key={col.key}
                                            className={`
                                                px-2 whitespace-nowrap
                                                border-r border-r-black/[0.1] last:border-r-0
                                                tabular-nums
                                                ${!isChecked ? 'text-black' : ''}
                                                ${col.numeric ? 'text-right font-mono text-[11.5px]' : ''}
                                                ${isFirstCol ? 'font-medium text-xs' : 'font-medium'}
                                                ${isAlertCell && !isChecked ? 'text-red-500 font-semibold' : ''}
                                            `}
                                        >
                                            {customContent !== null ? customContent : (col.numeric ? fmt(value) : value)}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
