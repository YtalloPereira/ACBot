const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamodb } = require('../lambda/lib/aws');

const createProcessTable = async () => {
  const processCommand = new CreateTableCommand({
    TableName: 'processes',
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

  const response = await dynamodb.send(processCommand);
  return response;
};

const createGuideTable = async () => {
  const processGuideCommand = new CreateTableCommand({
    TableName: 'processes-guide',
    AttributeDefinitions: [
      {
        AttributeName: 'guideId', 
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'guideId', 
        KeyType: 'HASH', 
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1, 
      WriteCapacityUnits: 1, 
    },
  });

  const response = await dynamodb.send(processGuideCommand);
  return response;
};

(async () => {
  try {
    const processTableData = await createProcessTable();
    const guideTableData = await createGuideTable();
    console.log(processTableData);
    console.log(guideTableData);
  } catch (error) {
    console.error(error);
  }
})();