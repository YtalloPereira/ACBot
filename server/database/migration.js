const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamodb } = require('../lambda/lib/aws');

const tablesArray = [
  { table: 'processes', attribute: 'processId' },
  { table: 'guides', attribute: 'keyGuide' },
  { table: 'documents', attribute: 'key' },
  { table: 'audios', attribute: 'phraseHash' },
];

const createTable = async (data) => {
  // Comando para criar a tabela
  const command = new CreateTableCommand({
    TableName: `${process.env.RESOURCE_PREFIX}-${data.table}`,
    AttributeDefinitions: [
      {
        AttributeName: data.attribute,
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: data.attribute,
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
    await Promise.all(
      tablesArray.map(async (item) => {
        await createTable(item);
      })
    );

    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('As tabelas já existem.');
      return;
    }
    console.error(error);
  }
})();
