const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDBDocClient } = require("../lib/aws");

// Função para salvar no DynamoDB
module.exports.saveToDynamoDB = async (data) => {
  // Cria comando de put para cada documento e envia para o DynamoDB
  const command = new PutCommand({
    TableName: `${process.env.RESOURCE_PREFIX}-${data.table}`,
    Item: data.item,
  });

  await dynamoDBDocClient.send(command);
};
