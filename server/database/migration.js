const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamodb } = require('../lambda/lib/aws');
 
const createProcessTable = async () => {
  const processCommand = new CreateTableCommand({
    TableName: `${process.env.RESOURCE_PREFIX}-processes`,
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
  await dynamodb.send(processCommand);
};
const createGuideTable = async () => {
  const processGuideCommand = new CreateTableCommand({
    TableName: `${process.env.RESOURCE_PREFIX}-guides`,
    AttributeDefinitions: [
      {
        AttributeName: 'keyGuide',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'keyGuide',
        KeyType: 'HASH',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });
  await dynamodb.send(processGuideCommand);
};
(async () => {
  try {
    await Promise.all([createProcessTable(),createGuideTable()]);
  } catch (error) {
    console.error(error);
  }
})();
 