const { answerQuestion } = require('../utils/answerQuestion');
const { getGuide } = require('../utils/findGuide');
const { handleResponse } = require('../utils/responseBuilder');

module.exports.handleProcessOpeningGuideIntent = async (event) => {
  const { Question } = event.sessionState.intent.slots;
  
    if(Question){
      const question = Question.value.interpretedValue;
      
      event.sessionState.intent.slots.Question = null;
      event.sessionState.intent.slots.Confirm = null;

      try {
        const processGuide = await getGuide('requeriment-guide');
        const answer = await answerQuestion(processGuide, question);

        const slotMsg = 'Você ainda têm alguma dúvida?';
        return handleResponse(event, 'ElicitSlot', 'Confirm', [answer, slotMsg]);
        
      } catch (error) {
        console.log(error);
        const msg =
        'Desculpe, houve um erro ao responder sua pergunta, tente novamente.';
        return handleResponse(event, 'Close', null, msg);
      }
    }

    try {
      // Busca o tutorial no DynamoDB
      const processGuide = await getGuide('requeriment-guide');

      // Retorna o tutorial para abrir um processo
      const msg = 'Aqui está o passo a passo para abrir um processo!';
      const slotMsg = 'Você ainda têm alguma dúvida?';
      
      return handleResponse(event, 'ElicitSlot', 'Confirm', [msg, processGuide, slotMsg]);
    } catch (error) {
      console.error(error);

      // Retorna uma mensagem de erro
      const msg =
        'Desculpe, houve um erro ao consultar os processos, tente novamente.';
      return handleResponse(event, 'Close', null, msg);
    }
  
};

