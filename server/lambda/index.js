export const handler = async (event) => {
  const intentName = event.sessionState.intent.name;

  switch (intentName) {
  // case 'IntentName':
  //   return handleIntentName(event);
    default:
      return event;
  }
};
