const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamodb } = require('../lambda/lib/aws');

const createProcessTable = async () => {
  // Comando para criar a tabela de processos
  const command = new CreateTableCommand({
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

  await dynamodb.send(command);
};

const createGuideTable = async () => {
  // comando para criar a tabela de guias
  const command = new CreateTableCommand({
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

  await dynamodb.send(command);
};

const createDocumentsTable = async () => {
  // Comando para criar a tabela de documentos
  const command = new CreateTableCommand({
    TableName: `${process.env.RESOURCE_PREFIX}-documents`,
    AttributeDefinitions: [
      {
        AttributeName: 'key',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'key',
        KeyType: 'HASH',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });

  await dynamodb.send(command);
};

(async () => {
  try {
    // Cria as tabelas de processos, guias e documentos
    await Promise.all([
      createProcessTable(),
      createGuideTable(),
      createDocumentsTable(),
    ]);

    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('As tabelas já existem.');
      return;
    }
    console.error(error);
  }
})();
