const { handleSaudacaoIntent  } = require("./controllers/SaudacaoInicial");


module.exports.handler = async (event) => {
  const intentName = event.sessionState.intent.name;

  switch (intentName) {
    case 'SaudacaoInicial':
      return await handleSaudacaoIntent(event);
    default:
      return event;
  }
};
