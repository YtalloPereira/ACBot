const { findProcess } = require('../lib/findProcess');
const { getProcesses } = require('../lib/getProcesses');
const { handleResponse } = require('../lib/responseBuilder');

module.exports.handleCheckProcessTypesIntent = async (event) => {
  const userInput = event.inputTranscript.toLowerCase();

  const { ProcessId } = event.sessionState.intent.slots;

  // Verifica se o usuário quer ver a lista de processos
  switch (true) {
    case userInput.includes('lista'):
      try {
        const processList = await getProcesses();

        return handleResponse(event, 'Close', null, [
          'Aqui está a lista de processos acadêmicos disponíveis!',
          processList,
        ]);
      } catch (error) {
        console.error(error);
        return handleResponse(
          event,
          'Close',
          null,
          'Desculpe, houve um erro ao consultar os processos, tente novamente.'
        );
      }

    case ['específico', 'informações', 'consultar', 'um'].some((key) =>
      userInput.includes(key)
    ):
      return handleResponse(event, 'ElicitSlot', 'ProcessId');

    case ProcessId && typeof ProcessId.value.interpretedValue === 'string':
      const value = ProcessId.value.interpretedValue.trim();

      if (Number(value) && Number(value) > 0) {
        try {
          const process = await findProcess(value);

          return handleResponse(event, 'Close', null, [
            `Aqui está o processo acadêmico de número **${value}**.`,
            process,
          ]);
        } catch (error) {
          console.error(error);
          return handleResponse(
            event,
            'Close',
            null,
            'Desculpe, houve um erro ao consultar o processo, tente novamente.'
          );
        }
      }

    default:
      const imageResponseCard = {
        contentType: 'ImageResponseCard',
        imageResponseCard: {
          title: 'Veja as opções abaixo para começar!',
          subtitle: 'Selecione uma das opções para obter mais informações:',
          // imageUrl: 'https://example.com/image.png', // URL da imagem
          buttons: [
            {
              text: 'Ver lista de processos acadêmicos',
              value: 'Quero ver a lista de processos acadêmicos!',
            },
            {
              text: 'Consultar um processo acadêmico específico',
              value: 'Quero consultar um processo acadêmico específico!',
            },
          ],
        },
      };
      return handleResponse(
        event,
        'Close',
        null,
        'Certo, posso te ajudar com isso!',
        imageResponseCard
      );
  }
};
 