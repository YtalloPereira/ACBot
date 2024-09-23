const { fetchAllProcesses } = require('../utils/fetchAllProcesses');
const { handleResponse } = require('../utils/responseBuilder');

module.exports.handleListAllProcessTypesIntent = async (event) => {
  try {
    // Busca a lista de processos acadêmicos
    const processList = await fetchAllProcesses();

    const msg = 'Aqui está a lista de processos acadêmicos disponíveis!';
    const slotMsg = 'Você quer ver detalhes sobre algum processo específico?';

    // Retorna a lista de processos acadêmicos
    return handleResponse(event, 'ElicitSlot', 'Confirm', [
      msg,
      processList,
      slotMsg,
    ]);
  } catch (error) {
    // Retorna uma mensagem de erro
    const msg =
      'Desculpe, houve um erro ao consultar os processos, tente novamente.';
    return handleResponse(event, 'Close', null, msg);
  }
};
