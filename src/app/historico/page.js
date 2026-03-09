'use client'

import { useEffect, useState } from "react"

export default function Historico() {
    const [ordemInfo, setOrdemInfo] = useState([])
    const [detailedInfo, setDetailedInfo] = useState(false)

    useEffect(() => {
        async function fetchOrdens() {
            const res = await fetch('/api/ordens', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            const data = await res.json()

            setOrdemInfo(data)
        }

        fetchOrdens()
    }, [])

    const handleDetailedInfo = (index) => {
        if (detailedInfo === index) {
            setDetailedInfo(false)
        } else {
            setDetailedInfo(index)
        }
    }

    return (
        <div className="p-4">
            <div className="bg-white rounded-2xl p-4">
                {ordemInfo.map((os, index) => (
                    <div key={index} className="space-y-3">
                        <div className="space-y-2">
                            <div
                                onClick={() => handleDetailedInfo(index)}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex space-x-2 items-center">
                                    <div className={`w-[14px] h-[14px] rounded-full ${
                                        os.TJ_STATUS === 'ANDAMENTO' ? 'bg-green-400' :
                                        os.TJ_STATUS === 'NA FILA' ? 'bg-blue-400' :
                                        os.TJ_STATUS === 'CONCLUIDA' ? 'bg-neutral-300' : ''
                                        }`}></div>
                                    <p className="text-black font-semibold">OS{os.TJ_ORDEM}</p>
                                </div>
                                <div className="flex space-x-3 text-[13px] items-center text-neutral-400">
                                    <p>{os.TJ_FILIAL}</p>
                                    <img
                                        src="/imagens/arrowIcon.svg"
                                        alt="Seta"
                                        className={`w-[17px] transition-all duration-300 ${detailedInfo === index ? '-rotate-90' : 'rotate-90'}`}
                                    />
                                </div>
                            </div>
                            {detailedInfo === index && (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[13px] font-semibold text-neutral-600">Status:</p>
                                        <p className="text-black font-semibold text-[14px]">{os.TJ_STATUS}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[13px] font-semibold text-neutral-600">Localização:</p>
                                            <p className="text-black font-semibold text-[14px]">{os.TJ_SETOR}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-[3px]">
                                        <p className="text-[13px] font-semibold text-neutral-600">Recurso/Bem:</p>
                                        <div className="leading-[1.2]">
                                            <p className="text-black font-semibold text-[14px]">{os.TJ_DESCBEM}</p>
                                            <p className="text-neutral-500 font-semibold text-[14px]">{os.TJ_CODBEM}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-neutral-600">Tipo de Manutenção:</p>
                                        <p className="text-black font-semibold text-[14px]">{os.TJ_TIPOMAN}</p>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-neutral-600">Observação do Solicitante:</p>
                                        <p className="text-black font-semibold text-[14px]">{os.TJ_OBS}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {index !== ordemInfo.length - 1 && (
                            <hr className="border-neutral-200 my-2 pb-1" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}