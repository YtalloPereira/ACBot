const { findProcess } = require('../utils/findProcess');
const { handleResponse } = require('../utils/responseBuilder');

module.exports.handleCheckProcessTypesIntent = async (event) => {
  const { ProcessId } = event.sessionState.intent.slots;

  // Verifica se o slot ProcessId foi preenchido e se a invocação é para o slot ProcessId
  if (ProcessId) {
    const value = ProcessId.value.interpretedValue;

    event.sessionState.intent.slots.ProcessId = null;
    event.sessionState.intent.slots.Confirm = null;

    // event.proposedNextState.prompt = {};

    try {
      const process = await findProcess(value);

      // Retorna aviso se o processo não for encontrado
      if (!process) {
        const msg = `Desculpe, mas o processo acadêmico com ID **${value}** não existe. Tente novamente.`;
        return handleResponse(event, 'Close', null, msg);
      }

      const msg = `Aqui está o processo acadêmico de número **${value}**.`;
      const slotMsg = 'Você quer consultar outro processo acadêmico?';
      
      // Retorna as informações do processo acadêmico
      return handleResponse(event, 'ElicitSlot', 'Confirm', [
        msg,
        process,
        slotMsg,
      ]);
    } catch (error) {
      // Retorna uma mensagem de erro
      const msg =
        'Desculpe, houve um erro ao consultar o processo, tente novamente.';
      return handleResponse(event, 'Close', null, msg);
    }
  }

  // Retorna uma mensagem solicitando o slot do número do processo acadêmico
  return handleResponse(event, 'Delegate', null);
};
