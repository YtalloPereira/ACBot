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
  const documentsRequired = Array.from(response.Item.documentsRequired);

  // Formata a mensagem com as informações do processo
  const process = `
    **ID:** ${response.Item.processId}

    **Título:** ${response.Item.title}

    **Descrição:** ${response.Item.description}

    **Fluxo:** ${response.Item.flow}

    **Documentos Necessários:** ${
      documentsRequired.length
        ? documentsRequired.join('\n')
        : 'Nenhum documento necessário.'
    }
  `;

  return process;
};
