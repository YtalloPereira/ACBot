const fs = require('node:fs');
const path = require('node:path');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient } = require('../lambda/lib/aws');

const guidesPath = path.resolve(__dirname, './jsons/guides.json');
const processesPath = path.resolve(__dirname, './jsons/processes.json');
const documentsPath = path.resolve(__dirname, './jsons/documents.json');

const seedProcesses = async () => {
  // Lê o arquivo JSON de processos
  const response = fs.readFileSync(processesPath, 'utf8');
  const processes = await JSON.parse(response);

  // Cria comando de put para cada documento e envia para o DynamoDB
  processes.map(async (item) => {
    const command = new PutCommand({
      TableName: `${process.env.RESOURCE_PREFIX}-processes`,
      Item: item,
    });

    await dynamoDBDocClient.send(command);
  });
};

const seedGuides = async () => {
  // Lê o arquivo JSON de guias
  const response = fs.readFileSync(guidesPath, 'utf8');
  const guides = await JSON.parse(response);

  // Cria comando de put para cada documento e envia para o DynamoDB
  guides.map(async (item) => {
    const command = new PutCommand({
      TableName: `${process.env.RESOURCE_PREFIX}-guides`,
      Item: item,
    });

    await dynamoDBDocClient.send(command);
  });
};

const seedDocuments = async () => {
  // Lê o arquivo JSON de documentos
  const response = fs.readFileSync(documentsPath, 'utf8');
  const documents = await JSON.parse(response);

  // Cria comando de put para cada documento e envia para o DynamoDB
  documents.map(async (item) => {
    const command = new PutCommand({
      TableName: `${process.env.RESOURCE_PREFIX}-documents`,
      Item: item,
    });

    await dynamoDBDocClient.send(command);
  });
};

(async () => {
  try {
    // Inicia o seed de guias, processos e documentos
    await Promise.all([seedGuides(), seedProcesses(), seedDocuments()]);
    console.log('Seed finalizado com sucesso!');
  } catch (error) {
    console.log(error);
  }
})();
