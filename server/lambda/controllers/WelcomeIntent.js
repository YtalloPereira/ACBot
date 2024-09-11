module.exports.handleWelcomeIntent = async (event) => {
   return {
      sessionState: {
         ...event.sessionState,
         dialogAction: {
            type: 'Delegate',
         },
      },

   }
}
