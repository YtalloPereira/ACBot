const { answerQuestion } = require('../utils/answerQuestion');
const { confirmResponseCard } = require('../utils/confirmResponseCard');
const { findGuide } = require('../utils/findGuide');
const { handleResponse } = require('../utils/responseBuilder');

module.exports.handleProcessOpeningGuideIntent = async (event) => {
  const { Question } = event.sessionState.intent.slots;

  let processGuide;

  try {
    // Busca o tutorial no DynamoDB
    processGuide = await findGuide('requeriment-guide');
  } catch (error) {
    // Retorna uma mensagem de erro
    const msg =
      'Desculpe, houve um erro ao consultar os processos, tente novamente.';
    return handleResponse(event, 'Close', null, msg);
  }

  if (Question) {
    const question = Question.value.interpretedValue;

    event.sessionState.intent.slots.Question = null;
    event.sessionState.intent.slots.Confirm = null;

    try {
      const answer = await answerQuestion(processGuide, question);

      const slotMsg =
        'Você ainda tem alguma dúvida sobre como abrir um processo?';
      return handleResponse(
        event,
        'ElicitSlot',
        'Confirm',
        [answer, slotMsg],
        confirmResponseCard
      );
    } catch (error) {
      const msg =
        'Desculpe, houve um erro ao responder sua pergunta, tente novamente.';
      return handleResponse(event, 'Close', null, msg);
    }
  }

  // Retorna o tutorial para abrir um processo
  const msg = 'Aqui está o passo a passo para abrir um processo!';
  const slotMsg = 'Você ainda tem alguma dúvida sobre como abrir um processo?';

  return handleResponse(
    event,
    'ElicitSlot',
    'Confirm',
    [msg, processGuide, slotMsg],
    confirmResponseCard
  );
};
