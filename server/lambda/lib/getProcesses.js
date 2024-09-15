const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');

const { dynamodb } = require('../../database/dynamodb');

const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamodb);

module.exports.getProcesses = async () => {
  const params = {
    TableName: 'processos',
  };

  // Busca todos os processos no DynamoDB
  const command = new ScanCommand(params);
  const response = await dynamoDBDocClient.send(command);

  // Ordena os processos por ID
  const sortedItems = response.Items.sort(
    (a, b) => Number(a.processId) - Number(b.processId)
  );

  // Mapeia os processos ordenados para um array de strings formatadas para exibição
  return sortedItems
    .map((item) => `**${item.processId}** - ${item.title}`)
    .join('\n');
};
