const { findProcess } = require('../lib/findProcess');
const { getProcesses } = require('../lib/getProcesses');
const { handleResponse } = require('../lib/responseBuilder');

module.exports.handleCheckProcessTypesIntent = async (event) => {
  const userInput = event.inputTranscript.toLowerCase();
  const proposedNextState = event?.proposedNextState;

  let { ProcessId, Confirm } = event.sessionState.intent.slots;

  const processNumberMatch = userInput.match(/\d+/);

  // Verifica se existe um número do processo acadêmico no input do usuário e não foi interpretado
  if (processNumberMatch && !ProcessId?.value?.interpretedValue) {
    // Define o número do processo acadêmico no slot ProcessId
    ProcessId = {
      value: {
        interpretedValue: processNumberMatch[0],
      },
    };
  }

  switch (true) {
    // Verifica se o usuário quer ver a lista de processos
    case ['lista', 'todos'].some(key => userInput.includes(key)):
      try {
        // Busca a lista de processos acadêmicos
        const processList = await getProcesses();

        // Retorna a lista de processos acadêmicos
        const msg = 'Aqui está a lista de processos acadêmicos disponíveis!';
        return handleResponse(event, 'Close', null, [msg, processList]);
      } catch (error) {
        console.error(error);

        // Retorna uma mensagem de erro
        const msg =
          'Desculpe, houve um erro ao consultar os processos, tente novamente.';
        return handleResponse(event, 'Close', null, msg);
      }

    // Verifica se o usuário quer consultar um processo e não inseriu o número do processo
    case ['específico', 'informações', 'consultar', 'um'].some(
      (key) => userInput.includes(key) && !ProcessId?.value?.interpretedValue
    ):
      // Retorna uma mensagem solicitando o slot do número do processo acadêmico
      return handleResponse(event, 'ElicitSlot', 'ProcessId');

    // Verifica o número do processo acadêmico e retorna as informações sobre o processo
    case ProcessId && typeof ProcessId?.value?.interpretedValue === 'string':
      // Obtém o número do processo acadêmico
      const value = ProcessId.value.interpretedValue.trim();

      if (Number(value) && Number(value) > 0) {
        try {
          const process = await findProcess(value);

          // Limpa o slot do número do processo acadêmico
          event.sessionState.intent.slots.ProcessId = null;

          // Retorna aviso se o processo não for encontrado
          if (!process) {
            const msg = `Desculpe, mas o processo acadêmico com ID **${value}** não existe.`;
            return handleResponse(event, 'Close', null, msg);
          }

          // Retorna as informações do processo acadêmico
          const msg = `Aqui está o processo acadêmico de número **${value}**.`;
          const slotMsg = `Você gostaria de consultar outro processo acadêmico?`;
          return handleResponse(event, 'ElicitSlot', 'Confirm', [msg, process, slotMsg]);
        } catch (error) {
          console.error(error);

          // Retorna uma mensagem de erro
          const msg =
            'Desculpe, houve um erro ao consultar o processo, tente novamente.';
          return handleResponse(event, 'Close', null, msg);
        }
      }

    // Verifica se o usuário quer continuar consultando processos ou encerrar a conversa
    case Confirm && typeof Confirm?.value?.interpretedValue === 'string':
      // Obtém a confirmação do usuário
      const confirmValue = Confirm.value.interpretedValue.toLowerCase().trim();

      // Limpa o slot de confirmação
      event.sessionState.intent.slots.Confirm = null;

      // Verifica se o usuário quer continuar consultando processos
      if (confirmValue === 'sim') {
        // Retorna uma mensagem solicitando o slot do número do processo acadêmico para continuar
        return handleResponse(event, 'ElicitSlot', 'ProcessId');
      } else {
        // Retorna uma mensagem de encerramento da conversa
        const msg = 'Certo, estou aqui para te ajudar quando precisar!';
        return handleResponse(event, 'Close', null, msg);
      }

    default:
      // Verifica se existe um próximo estado proposto
      if (proposedNextState) {
        // Verifica se o próximo estado proposto é a quarta tentativa e fecha a conversa
        if (proposedNextState?.prompt?.attempt === 'Retry4') {
          const msg = 'Não consegui finalizar sua solicitação por falta de informações válidas. Você pode tentar novamente!';
          return handleResponse(event, 'Close', null, msg);
        }

        // Retorna uma mensagem solicitando o próximo estado proposto
        const msg =
          'Desculpe, isso não é uma resposta válida. Poderia reformular sua mensagem?';
        return handleResponse(event, 'ElicitSlot', proposedNextState?.dialogAction?.slotToElicit, msg);
      }

      // Cria um card de resposta inicial para o usuário escolher uma opção
      const imageResponseCard = {
        contentType: 'ImageResponseCard',
        imageResponseCard: {
          title: 'Veja as opções abaixo para começar!',
          subtitle: 'Selecione uma das opções para obter mais informações:',
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

      // Retorna o card de resposta
      const msg = 'Certo, posso te ajudar com isso!';
      return handleResponse(event, 'Close', null, msg, imageResponseCard);
  }
};
