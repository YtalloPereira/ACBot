const { answerQuestion } = require('../utils/answerQuestion');
const { getGuide } = require('../utils/findGuide');
const { handleResponse } = require('../utils/responseBuilder');

module.exports.handleProcessOutComeIntent = async (event) => {
    const { Question } = event.sessionState.intent.slots;

    if (Question) {
        const question = Question.value.interpretedValue;

        event.sessionState.intent.slots.Question = null;
        event.sessionState.intent.slots.Confirm = null;

        try {
            const outcomeGuide = await getGuide('outcome-guide');
            const answer = await answerQuestion(outcomeGuide, question);

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
        const outcomeGuide = await getGuide('outcome-guide');

        // Retorna o tutorial para abrir um processo
        const msg = 'Aqui está o passo a passo dos efeitos resultantes dos requerimentos!';
        const slotMsg = 'Você ainda têm alguma dúvida?';

        return handleResponse(event, 'ElicitSlot', 'Confirm', [msg, outcomeGuide, slotMsg]);
    } catch (error) {
        console.error(error);

        // Retorna uma mensagem de erro
        const msg =
            'Desculpe, houve um erro ao consultar os efeitos resultantes dos requerimentos, tente novamente.';
        return handleResponse(event, 'Close', null, msg);
    }

};

