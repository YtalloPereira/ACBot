const { handleCheckProcessTypesIntent } = require('./controllers/CheckProcessTypesIntent');
const { handleListAllProcessTypesIntent } = require('./controllers/ListAllProcessTypesIntent');
const { handleProcessOpeningGuideIntent } = require('./controllers/ProcessOpeningGuideIntent');
const { handleProcessOutComeIntent } = require('./controllers/ProcessOutcomeIntent');
const { handleWelcomeIntent } = require('./controllers/WelcomeIntent');
const { handleResponse } = require('./utils/responseBuilder');

module.exports.handler = async (event) => {
  // Captura o nome da intenção
  const intentName = event.sessionState.intent.name;

  // Verifica a intenção e chama o controlador correspondente
  switch (intentName) {
    case 'CheckProcessTypesIntent':
      return await handleCheckProcessTypesIntent(event);
    case 'ListAllProcessTypesIntent':
      return await handleListAllProcessTypesIntent(event);
    case 'ProcessOpeningGuideIntent':
      return await handleProcessOpeningGuideIntent(event);
    case 'WelcomeIntent':
      return await handleWelcomeIntent(event);
    case 'ProcessOutComeIntent':
      return await handleProcessOutComeIntent(event);
    default:
      const msg =
        'Desculpe, não entendi sua solicitação. Pode repetir, por favor?';
      return handleResponse(event, 'Close', null, msg);
  }
};
