const { answerQuestion } = require('../utils/answerQuestion');
const { confirmResponseCard } = require('../utils/confirmResponseCard');
const { findGuide } = require('../utils/findGuide');
const { handleResponse } = require('../utils/responseBuilder');

module.exports.handleProcessOutcomeIntent = async (event) => {
  const { Question } = event.sessionState.intent.slots;

  let outcomeGuide;

  try {
    // Busca o tutorial no DynamoDB
    outcomeGuide = await findGuide('outcome-guide');
  } catch (error) {
    // Retorna uma mensagem de erro
    const msg =
      'Desculpe, houve um erro ao consultar os efeitos resultantes dos requerimentos, tente novamente.';

    const audioUrl = await generateAudio(msg);

    return handleResponse(event, 'Close', null, audioUrl);
  }

  if (Question) {
    const question = Question.value.interpretedValue;

    event.sessionState.intent.slots.Question = null;
    event.sessionState.intent.slots.Confirm = null;

    try {
      const answer = await answerQuestion(outcomeGuide, question);
      const responseCard = confirmResponseCard(
        'Você ainda tem alguma dúvida sobre a situação dos processos?'
      );

      return handleResponse(
        event,
        'ElicitSlot',
        'Confirm',
        answer,
        responseCard
      );
    } catch (error) {
      const msg =
        'Desculpe, houve um erro ao responder sua pergunta, tente novamente.';
      return handleResponse(event, 'Close', null, msg);
    }
  }

  // Retorna o tutorial para abrir um processo
  const msg = 'Aqui está o passo a passo sobre a situação dos processos!';
  const responseCard = confirmResponseCard(
    'Você ainda tem alguma dúvida sobre a situação dos processos?'
  );

  return handleResponse(
    event,
    'ElicitSlot',
    'Confirm',
    [msg, outcomeGuide],
    responseCard
  );
};
