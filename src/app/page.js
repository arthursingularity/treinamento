"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [ordensInfo, setOrdensInfo] = useState([])

  useEffect(() => {
    async function buscarOrdens() {
      const res = await fetch('/api/ordens')

      const data = await res.json()

      const dadosOrdenados = data.sort((a, b) => Number(a.TJ_PRIOR) - Number(b.TJ_PRIOR));

      setOrdensInfo(dadosOrdenados)
    }

    buscarOrdens()
  }, [])

  return (
    <div className="p-4 bg-neutral-200 min-h-screen w-full flex flex-col gap-4">
      {ordensInfo.length === 0 && (
        <div className="text-center text-neutral-500 mt-10">
          Nenhuma ordem de serviço encontrada.
        </div>
      )}

      {ordensInfo.map((ordem, index) => (
        <div key={index} className="bg-white w-full rounded-3xl p-4 shadow-lg">

          <div className="flex justify-between items-center">
            <div className="leading-[1.1]">
              <h2 className="font-semibold text-[25px] text-black">
                OS{ordem.TJ_ORDEM}
              </h2>
              <p className="text-[12px] font-medium text-neutral-500">
                {ordem.TJ_TIPOMAN || "TIPO NÃO INFORMADO"}
              </p>
            </div>
            <div className={`rounded-2xl w-[120px] py-1 h-[33px] flex justify-center items-center ${
                ordem.TJ_STATUS === 'ANDAMENTO' ? 'bg-green-500 text-white' :
                ordem.TJ_STATUS === 'NA FILA' ? 'bg-blue-500 text-white' :
                ordem.TJ_STATUS === 'PAUSADA' ? 'bg-orange-200 text-orange-500' : 'bg-neutral-200 text-neutral-600'}`}>
              <p className="font-semibold text-[13px]">
                {ordem.TJ_STATUS}
              </p>
            </div>
          </div>

          <div className="bg-neutral-200/40 border border-neutral-300 space-y-3 rounded-2xl p-4 pt-3 mt-4 relative">
            <div className="w-[60px] h-[27px] flex justify-center items-center bg-neutral-300 absolute top-0 right-0 rounded-tr-[14px] rounded-bl-2xl">
              <p className="font-medium text-neutral-500">{ordem.TJ_PRIOR}</p>
            </div>
            <div className="space-y-[4px]">
              <p className="text-neutral-800 font-semibold text-[14px]">Localização:</p>
              <div className="leading-[1.15]">
                <p className="font-semibold text-black text-[14px] uppercase">{ordem.TJ_SETOR}</p>
                <p className="font-medium text-neutral-500/80 text-[14px] uppercase">{ordem.TJ_FILIAL}</p>
              </div>
            </div>
            <hr className="border-neutral-300" />
            <div className="space-y-[4px]">
              <p className="text-neutral-800 font-semibold text-[14px]">Recurso/Bem:</p>
              <div className="leading-[1.15]">
                <p className="font-semibold text-black text-[14px] uppercase">{ordem.TJ_DESCBEM}</p>
                <p className="font-medium text-neutral-500/80 text-[14px] uppercase">{ordem.TJ_CODBEM}</p>
              </div>
            </div>
            <hr className="border-neutral-300" />

            <div className="space-y-[4px]">
              <p className="text-neutral-800 font-semibold text-[14px]">Observação:</p>
              <div className="leading-[1.15]">
                <p className="font-semibold text-black text-[14px] uppercase">
                  {ordem.TJ_OBS || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4 space-x-4">
            <button className="bg-neutral-300/70 hover:bg-neutral-300 transition-colors rounded-2xl py-[10px] w-[60%] text-black font-medium">
              Editar Fila
            </button>
            <button className="bg-blue-400 hover:bg-blue-500 transition-colors rounded-2xl w-full text-white">
              Ver detalhes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}