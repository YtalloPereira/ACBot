const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient } = require('../lib/aws');

module.exports.getGuide = async (key) => {
  const params = {
    TableName: `${process.env.RESOURCE_PREFIX}-guides`,
    Key: {
      keyGuide: key,
    },
  };

  const command = new GetCommand(params);
  const response = await dynamoDBDocClient.send(command);

  // Verifica se o processo não foi encontrado
  if (!response.Item) {
    return null;
  }
  
  return response.Item.content.join('\n');
};
