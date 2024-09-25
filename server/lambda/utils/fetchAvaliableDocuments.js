const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient } = require('../lib/aws');

module.exports.fetchAvailableDocuments = async () => {
  // Cria um comando de scan para buscar todos os processos
  const command = new ScanCommand({
    TableName: `${process.env.RESOURCE_PREFIX}-documents`,
  });

  // Envia comando para buscar todos os processos no DynamoDB
  const response = await dynamoDBDocClient.send(command);

  return response.Items;
};
