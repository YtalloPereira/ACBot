const { handleFallbackIntent } = require('./controllers/FallbackIntent');
const { handleWelcomeIntent } = require('./controllers/WelcomeIntent');
const { handleResponse } = require('./lib/responseBuilder');

module.exports.handler = async (event) => {
  // Verifica se `interpretations` existe e é um array
  if (!event.interpretations || !Array.isArray(event.interpretations)) {
    return await handleFallbackIntent(event);
  }

  // Encontra a interpretação com a maior confiança
  const highConfidenceInterpretation = event.interpretations.find(
    (interpretation) =>
      interpretation.nluConfidence && interpretation.nluConfidence >= 0.7
  );

  if (!highConfidenceInterpretation) {
    return handleFallbackIntent(event);
  }

  // Processa a intenção correspondente à interpretação de alta confiança
  const intentName = highConfidenceInterpretation.intent.name;

  switch (intentName) {
    case 'WelcomeIntent':
      return await handleWelcomeIntent(event);
    default:
      return handleResponse(
        event,
        'Close',
        null,
        'Desculpe, não consegui processar a sua solicitação.'
      );
  }
};