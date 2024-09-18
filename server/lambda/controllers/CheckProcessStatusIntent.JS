module.exports.handleCheckProcessStatusIntent = async (event) => {
    // Função fictícia que retorna o status do processo
    const getProcessStatus = async (processId) => {
        // Aqui você pode adicionar a lógica para buscar o status do processo
        // Pode ser uma chamada a um banco de dados, uma API, etc.
        // Vou usar um exemplo estático para fins de demonstração
        const statuses = {
            'process1': 'Em andamento',
            'process2': 'Concluído',
            'process3': 'Pendente'
        };
        return statuses[processId] || 'Processo não encontrado';
    };

    // Extrair o ID do processo do evento (ajuste conforme necessário)
    const processId = event.processId;

    // Obter o status do processo
    const status = await getProcessStatus(processId);

    // Construir a resposta
    const response = {
        status: status,
        message: `O status do processo ${processId} é: ${status}`
    };

    return response;
};
