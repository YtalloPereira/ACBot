const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamodb } = require('./dynamodb');

const createTable = async () => {
  const command = new CreateTableCommand({
    TableName: 'processos',
    AttributeDefinitions: [
      {
        AttributeName: 'processId', 
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'processId', 
        KeyType: 'HASH', 
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1, 
      WriteCapacityUnits: 1, 
    },
  });

  const response = await dynamodb.send(command);
  return response;
};

(async () => {
  try {
    const data = await createTable();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();