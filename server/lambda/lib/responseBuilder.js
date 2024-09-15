module.exports.handleResponse = (
  event,
  type,
  slotToElicit,
  message,
  imageResponseCard
) => {
  const intentState = type === 'Delegate' ? 'ReadyForFulfillment' : 'Fulfilled';

  let messages = [];

  // Verifica se a mensagem é um array, se for, adiciona cada mensagem ao array de mensagens
  if (Array.isArray(message)) {
    messages = message.map((message) => ({
      contentType: 'PlainText',
      content: message,
    }));
  } else if (message) {
    // Adiciona a mensagem ao array de mensagens se não for um array
    messages.push({
      contentType: 'PlainText',
      content: message,
    });
  }

  // Adiciona o card de resposta ao array de mensagens
  if (imageResponseCard) {
    messages.push(imageResponseCard);
  }

  // Retorna o objeto de resposta
  return {
    sessionState: {
      sessionAttributes: event.sessionState.sessionAttributes,
      intent: {
        ...event.sessionState.intent,
        state: intentState,
      },
      dialogAction: {
        type: type,
        slotToElicit: slotToElicit,
      },
    },
    messages,
  };
};
