const { handleCheckProcessStatusIntent } = require('./controllers/CheckProcessStatusIntent');
const { handleCheckProcessTypesIntent } = require('./controllers/CheckProcessTypesIntent');
const { handleListAllProcessTypesIntent } = require('./controllers/ListAllProcessTypesIntent');
const { handleOpenGuidedProcessIntent } = require('./controllers/OpenGuidedProcessIntent');
const { handleProcessOpeningGuideIntent } = require('./controllers/ProcessOpeningGuideIntent');
const { handleWelcomeIntent } = require('./controllers/WelcomeIntent');
const { handleResponse } = require('./lib/responseBuilder');

module.exports.handler = async (event) => {
  // Captura o nome da intenção
  const intentName = event.sessionState.intent.name;

  // Verifica a intenção e chama o controlador correspondente
  switch (intentName) {
    case 'CheckProcessStatusIntent':
      return await handleCheckProcessStatusIntent(event);
    case 'CheckProcessTypesIntent':
      return await handleCheckProcessTypesIntent(event);
    case 'ListAllProcessTypesIntent':
      return await handleListAllProcessTypesIntent(event);
    case 'OpenGuidedProcessIntent':
      return await handleOpenGuidedProcessIntent(event);
    case 'ProcessOpeningGuideIntent':
      return await handleProcessOpeningGuideIntent(event);
    case 'WelcomeIntent':
      return await handleWelcomeIntent(event);
    default:
      console.log('Intent not found:', event);
      const msg =
        'Desculpe, não entendi sua solicitação. Pode repetir, por favor?';
      return handleResponse(event, 'Close', null, msg);
  }
};
