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

  // Busca o processo no DynamoDB
  const command = new GetCommand(params);
  const response = await dynamoDBDocClient.send(command);

  // Verifica se o processo não foi encontrado
  if (!response.Item) {
    return null;
  }

  // Obtém as informações do processo do item retornado
  const flow = response.Item.flow;
  const documentsRequired = response.Item.documentsRequired;

  // Formata a mensagem com as informações do processo
  const process = `
    **ID:** ${response.Item.processId}

    **Título:** ${response.Item.title}

    **Descrição:** ${response.Item.description}

    ${flow ? `**Fluxo:** ${flow}` : ''}

    ${
      documentsRequired
        ? `**Documentos Necessários:** ${documentsRequired.join('\n')}`
        : ''
    }
  `;

  return process;
};
