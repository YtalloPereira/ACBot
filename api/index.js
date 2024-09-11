module.exports.health = (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: "Go Serverless v4.3.0! Your function executed successfully!",
      input: event,
    }, null, 2),
  }
}

module.exports.v1Description = (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'API version 1',
    }, null, 2),
  };
};
