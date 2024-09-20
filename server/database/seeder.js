const fs = require('node:fs');
const path = require('node:path');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient } = require('../lambda/lib/aws');

const guidesPatch = path.resolve(__dirname, './guides.json');
const ProcessesPath = path.resolve(__dirname, './processes.json');

const seedProcesses = async () => {
  const response = fs.readFileSync(ProcessesPath, 'utf8');
  const processes = await JSON.parse(response);

  processes.map(async (item) => {
    const command = new PutCommand({
      TableName: `${process.env.RESOURCE_PREFIX}-processes`,
      Item: item,
    });

    await dynamoDBDocClient.send(command);
  });
};

const seedGuides = async () => {
  const response = fs.readFileSync(guidesPatch, 'utf8');
  const guides = await JSON.parse(response);

  guides.map(async (item) => {
    const command = new PutCommand({
      TableName: `${process.env.RESOURCE_PREFIX}-guides`,
      Item: item,
    });

    await dynamoDBDocClient.send(command);
  });
};

(async () => {
  try {
    await Promise.all([seedGuides(), seedProcesses()]);
    console.log('Seed finalizado com sucesso!');
  } catch (error) {
    console.log(error);
  }
})();
