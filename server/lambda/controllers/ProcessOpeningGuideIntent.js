const { getProcessesGuide } = require('../utils/getProcessesGuide');
const { handleResponse } = require('../utils/responseBuilder');

module.exports.handleProcessOpeningGuideIntent = async (event) => {
  const userInput = event.inputTranscript.toLowerCase();

  // Verifica se o usuário quer ver o passo a passo de como abrir um processo
  if (['passo', 'a'].some(key => userInput.includes(key))) {
    try {
      // Busca o tutorial no DynamoDB
      const processGuide = await getProcessesGuide();

      // Retorna o tutorial para abrir um processo
      const msg = 'Aqui está o passo a passo para abrir um processo!';
      return handleResponse(event, 'Close', null, [msg, processGuide]);
    } catch (error) {
      console.error(error);

      // Retorna uma mensagem de erro
      const msg =
        'Desculpe, houve um erro ao consultar os processos, tente novamente.';
      return handleResponse(event, 'Close', null, msg);
    }
  }

  // Caso o input não corresponda ao esperado
  return handleResponse(event, 'Close', null, 'Não entendi seu pedido.');
};

