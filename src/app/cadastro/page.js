"use client"

export default function Cadastro() {

const handleSubmit = async (event) => {
    // Evita o reload da página ao clicar em submit
    event.preventDefault();

    const formData = new FormData(event.target);

    const dadosDoFormulario = {
        produto: formData.get('produto')?.toUpperCase(),
        descricao: formData.get('descricao')?.toUpperCase(),
    };

    try {
        const res = await fetch('/api/ordens', {
            method: 'POST',
            body: JSON.stringify(dadosDoFormulario),
        });

        const data = await res.json()

        if (res.ok) {
            alert(data.message);

            // Limpa o formulário
            event.target.reset();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}
    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3 bg-white rounded-2xl p-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-500">Código</label>
                    <input 
                        type="text" 
                        name="produto" 
                        required 
                        className="border border-neutral-300 rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-500">Descrição</label>
                    <input 
                        type="text" 
                        name="descricao" 
                        required 
                        className="border border-neutral-300 rounded p-2 w-full uppercase"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600"
                >
                    Cadastrar produto
                </button>
            </form>
        </div>
    )
}