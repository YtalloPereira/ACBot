const { handleResponse } = require("../lib/responseBuilder");

module.exports.handleFallbackIntent = async (event) => {
   return handleResponse(
      event,
      'Close',
      null,
      'Desculpe, não entendi sua solicitação. Pode repetir, por favor?'
   );
};