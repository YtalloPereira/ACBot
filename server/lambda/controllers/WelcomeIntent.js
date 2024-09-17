const { handleResponse } = require("../lib/responseBuilder");

module.exports.handleWelcomeIntent = async (event) => {
  const welcomeSent = event.sessionState.sessionAttributes?.welcomeSent

  if (welcomeSent === 'true') {
    const msg = 'Oi, Estou aqui para te ajudar, qual a sua dúvida?';
    return handleResponse(event, 'Close', null, msg);
  }
  
  event.sessionState.sessionAttributes.welcomeSent = 'true'

  const imageResponseCard = {
    contentType: 'ImageResponseCard',
    imageResponseCard: {
      title: 'Veja as opções abaixo para começar!',
      subtitle: 'Selecione uma das opções para obter mais informações:',
      buttons: [
        {
          text: 'Obtenha orientação sobre como abrir um processo',
          value: 'Obter orientação sobre como abrir um processo',
        },
        {
          text: 'Descubra sobre os tipos de processos disponíveis',
          value: 'Descobrir sobre os tipos de processos disponíveis',
        },
        {
          text: 'Inicie um novo processo',
          value: 'Iniciar um novo processo',
        },
        {
          text: 'Verifique o status dos processos em andamento',
          value: 'Verificar o status dos processos em andamento',
        },
      ],
    },
  };

  const msg = 'Olá! Bem-vindo ao assistente de processos acadêmicos.';

  return handleResponse(event, 'Close', null, msg, imageResponseCard);
} 