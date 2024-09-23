const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient } = require('../lib/aws');

module.exports.fetchAllProcesses = async () => {
  // Cria um comando de scan para buscar todos os processos
  const command = new ScanCommand({
    TableName: `${process.env.RESOURCE_PREFIX}-processes`,
  });

  // Envia comando para buscar todos os processos no DynamoDB
  const response = await dynamoDBDocClient.send(command);

  // Ordena os processos no DynamoDB
  const sortedItems = response.Items.sort(
    (a, b) => Number(a.processId) - Number(b.processId)
  );

  // Formata o array para uma string com quebra de linha entre os processos
  return sortedItems
    .map((item) => `**${item.processId}** - ${item.title}`)
    .join('\n');
};
