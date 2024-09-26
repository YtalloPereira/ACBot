const { confirmResponseCard } = require('../utils/confirmResponseCard');
const { fetchAllProcesses } = require('../utils/fetchAllProcesses');
const { handleResponse } = require('../utils/responseBuilder');
const { generateAudio } = require('../utils/generateAudio');

module.exports.handleListAllProcessTypesIntent = async (event) => {
  try {
    // Busca a lista de processos acadêmicos
    const processList = await fetchAllProcesses();

    const msg = 'Aqui está a lista de processos acadêmicos disponíveis!';
    const responseCard = confirmResponseCard(
      'Você quer ver detalhes sobre algum processo específico?'
    );

    // Retorna a lista de processos acadêmicos
    return handleResponse(
      event,
      'ElicitSlot',
      'Confirm',
      [msg, processList],
      responseCard
    );
  } catch (error) {
    // Retorna uma mensagem de erro
    const msg =
      'Desculpe, houve um erro ao consultar os processos, tente novamente.';

    const audioUrl = await generateAudio(msg);
    return handleResponse(event, 'Close', null, audioUrl);
  }
};
