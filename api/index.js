const { makeResponse } = require("./lib/response");

module.exports.health = (event, context) => {
  return makeResponse(200, {
    message: 'Go Serverless v4.3.0! Your function executed successfully!',
    input: event,
  });
}

module.exports.v1Description = (event, context) => {
  return makeResponse(200, {
    message: 'API version 1',
  });
};
