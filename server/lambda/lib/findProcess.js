const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const { dynamodb } = require('../../database/dynamodb');

const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamodb);

module.exports.findProcess = async (id) => {
  const params = {
    TableName: 'processos',
    Key: {
      processId: id,
    },
  };

  const command = new GetCommand(params);
  const response = await dynamoDBDocClient.send(command);


  const flow = response.Item.flow;
  const documentsRequired = response.Item.documentsRequired;

  const process = `
    **ID:** ${response.Item.processId}

    **Título:** ${response.Item.title}

    **Descrição:** ${response.Item.description}

    ${flow ? `**Fluxo:** ${flow}` : ''}

    ${documentsRequired ? `**Documentos Necessários:** ${documentsRequired.join('\n')}` : ''}
  `;

  return process
};
