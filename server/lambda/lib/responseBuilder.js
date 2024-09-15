module.exports.handleResponse = (
  event,
  type,
  slotToElicit,
  message,
  imageResponseCard
) => {
  const intentState = type === 'Delegate' ? 'ReadyForFulfillment' : 'Fulfilled';

  let messages = [];

  if (Array.isArray(message)) {
    messages = message.map((message) => ({
      contentType: 'PlainText',
      content: message,
    }));
  } else if (message) {
    messages.push({
      contentType: 'PlainText',
      content: message,
    });
  }

  if (imageResponseCard) {
    messages.push(imageResponseCard);
  }

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
