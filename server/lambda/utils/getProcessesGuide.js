const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient } = require('../lib/aws');

module.exports.getProcessesGuide = async () => {
  const params = {
    TableName: 'processes-guide',
  };

  const command = new ScanCommand(params);
  const response = await dynamoDBDocClient.send(command);

  const { Items = [] } = response;

  if (Items.length === 0) {
    return 'Nenhum processo encontrado.';
  }

  const item = Items[0];
  return `${item.content}`;
};
