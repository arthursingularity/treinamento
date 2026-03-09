"use client"

export default function Cadastro() {

const handleSubmit = async (event) => {
    // Impede a página de recarregar ao clicar no botão submit
    event.preventDefault();

    // Cria um objeto FormData com todos os campos do formulário
    // event.target representa o próprio formulário
    const formData = new FormData(event.target);

    // Criamos um objeto JavaScript com os dados do formulário, esse objeto será enviado para a API
    const dadosDoFormulario = {

        // formData.get('filial') pega o valor do input com name="filial"
        filial: formData.get('filial')?.toUpperCase(),
        setor: formData.get('setor')?.toUpperCase(),
        codBem: formData.get('codBem')?.toUpperCase(),
        descBem: formData.get('descBem')?.toUpperCase(),
        obs: formData.get('obs')?.toUpperCase(),
        status: formData.get('status')?.toUpperCase(),
        tipoMan: formData.get('tipoMan')?.toUpperCase()
    };

    try {
        const res = await fetch('/api/ordens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            // body contém os dados(dadosDoFormulario) enviados para a API
            // JSON.stringify transforma o objeto em JSON
            body: JSON.stringify(dadosDoFormulario),
        });

        // Aqui pegamos a resposta da API e transformamos em JSON
        const data = await res.json()

        // res.ok verifica se a requisição deu certo
        // (status HTTP entre 200 e 299)
        if (res.ok) {
            // Mostra uma mensagem retornada pela API
            alert(data.message);

            // Limpa todos os campos do formulário
            event.target.reset();
        } else {
            // Caso a API retorne erro, é exibido no front-end
            alert(data.message);
        }

    } catch (error) {
        // Se acontecer algum erro na requisição
        // (ex: internet caiu, servidor fora do ar)
        console.error('Erro na requisição:', error);
    }
};
    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3 bg-white rounded-2xl p-4">
                
                {/* Repare no atributo 'name' de cada input. É ele que o FormData.get() procura! */}
                <div>
                    <label className="block text-sm font-medium text-neutral-500">Filial</label>
                    <input 
                        type="text" 
                        name="filial" 
                        required 
                        className="border border-neutral-300 rounded p-2 w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-500">Setor</label>
                    <input 
                        type="text" 
                        name="setor" 
                        required 
                        className="border border-neutral-300 rounded p-2 w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-500">Código do Bem</label>
                    <input 
                        type="text" 
                        name="codBem" 
                        required 
                        className="border border-neutral-300 rounded p-2 w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-500">Descrição do Bem</label>
                    <input 
                        type="text" 
                        name="descBem" 
                        required 
                        className="border border-neutral-300 rounded p-2 w-full"
                    />
                </div>

                
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-neutral-500">Status</label>
                        <select name="status" className="border border-neutral-300 rounded p-2 w-full">
                            <option value="ANDAMENTO">Em Andamento</option>
                            <option value="NA FILA">Na Fila</option>
                            <option value="CONCLUIDA">Concluída</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-500">Tipo de Manutenção</label>
                        <select name="tipoMan" className="border border-neutral-300 rounded p-2 w-full">
                            <option value="CORRETIVA ELETRICA">Corretiva Elétrica</option>
                            <option value="PREVENTIVA">Preventiva</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-500">Observação</label>
                    <textarea 
                        name="obs" 
                        className="border border-neutral-300 rounded p-2 w-full uppercase"
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600"
                >
                    Gerar OS
                </button>
            </form>
        </div>
    )
}