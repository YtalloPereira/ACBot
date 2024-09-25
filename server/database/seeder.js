const fs = require('node:fs');
const path = require('node:path');
const { saveToDynamoDB } = require('../lambda/utils/saveToDynamoDB');

const seedArray = [
  {
    table: 'guides',
    path: path.resolve(__dirname, './jsons/guides.json'),
  },
  {
    table: 'processes',
    path: path.resolve(__dirname, './jsons/processes.json'),
  },
  {
    table: 'documents',
    path: path.resolve(__dirname, './jsons/documents.json'),
  },
];

const seedToTable = async (seed) => {
  // Lê o arquivo JSON de documentos
  const response = fs.readFileSync(seed.path, 'utf8');
  const items = await JSON.parse(response);

  // Cria comando de put para cada item do json e envia para o DynamoDB
  items.map(async (item) => {
    await saveToDynamoDB({
      table: seed.table,
      item,
    });
  });
};

(async () => {
  try {
    // Inicia o seed de guias, processos e documentos
    seedArray.map(async (item) => {
      await seedToTable(item);
    });

    console.log('Seed finalizado com sucesso!');
  } catch (error) {
    console.log(error);
  }
})();
