const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const { dynamodb } = require('../../database/dynamodb');

const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamodb);

module.exports.getProcesses = async () => {
  const params = {
    TableName: 'processos',
  };

  const command = new ScanCommand(params);
  const response = await dynamoDBDocClient.send(command);

  const sortedItems = response.Items.sort((a, b) =>
    Number(a.processId) - (Number(b.processId))
  );

  return sortedItems
    .map((item) => `**${item.processId}** - ${item.title}`)
    .join('\n');
};
