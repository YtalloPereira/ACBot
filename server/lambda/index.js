import { handleSaudacaoIntent } from "./controllers/SaudacaoInicial.js";


export const handler = async (event) => {
  const intentName = event.sessionState.intent.name;

  switch (intentName) {
    case 'SaudacaoInicial':
      return await handleSaudacaoIntent(event);
    default:
      return event;
  }
};
