const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient } = require('../lib/aws');

module.exports.findGuide = async (key) => {
  // Cria um comando de get para buscar o guia
  const command = new GetCommand({
    TableName: `${process.env.RESOURCE_PREFIX}-guides`,
    Key: {
      keyGuide: key,
    },
  });

  // Busca o guia pela key no DynamoDB
  const response = await dynamoDBDocClient.send(command);

  // Verifica se o processo não foi encontrado e retorna null
  if (!response.Item) {
    return null;
  }

  // Ordena os processos no DynamoDB
  const sortedItems = response.Item.content.sort(
    (a, b) => Number(a.id) - Number(b.id)
  );

  // Formata o array para uma string com quebra de linha entre os passos do guia
  return sortedItems
    .map((item) => `${item.id ? `**${item.id}** - ` : ''}${item.description}`)
    .join('\n');
};
