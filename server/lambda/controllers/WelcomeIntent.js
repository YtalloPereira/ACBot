const { generateAudio } = require('../utils/generateAudio');
const { handleResponse } = require('../utils/responseBuilder');

module.exports.handleWelcomeIntent = async (event) => {
  // Captura o atributo de sessão que indica se a mensagem de boas-vindas já foi enviada, definido no lex
  const welcomeSent = event.sessionState.sessionAttributes?.welcomeSent;

  // Verifica se a mensagem de boas-vindas já foi enviada ao usuário, caso contrário, envia a mensagem
  if (!welcomeSent) {
    return handleResponse(event, 'Delegate', null);
  }

  // Define outra mensagem caso o usuário já tenha recebido a mensagem de boas-vindas
  const msg = 'Oi, Estou aqui para te ajudar, qual a sua dúvida?';

  // Gera ou busca o áudio da mensagem
  const audioUrl = await generateAudio(msg);

  return handleResponse(event, 'Close', null, audioUrl);
};
