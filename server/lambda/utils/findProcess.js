const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient } = require('../lib/aws');
const { getObjectToS3 } = require('./getObjectToS3');

module.exports.findProcess = async (id) => {
  // Cria um comando de get para buscar o processo pelo id
  const command = new GetCommand({
    TableName: `${process.env.RESOURCE_PREFIX}-processes`,
    Key: {
      processId: id,
    },
  });

  // Busca o processo pelo id no DynamoDB
  const response = await dynamoDBDocClient.send(command);

  // Verifica se o processo não foi encontrado e retorna null
  if (!response.Item) {
    return null;
  }

  // Obtém as informações dos documentos requeridos do processo retornado
  const documentsRequired = Array.from(response.Item.documentsRequired);

  // Verifica se o processo requer o anexo III ou IV
  const attachementIII = documentsRequired.some((doc) =>
    doc.toLowerCase().includes('anexo iii')
  );
  const attachementIV = documentsRequired.some((doc) =>
    doc.toLowerCase().includes('anexo iii ou iv')
  );

  // Formata a mensagem com as informações do processo e retorna
  return `
    **ID:** ${response.Item.processId}

    **Título:** ${response.Item.title}

    **Descrição:** ${response.Item.description}

    **Fluxo:** ${response.Item.flow}

    **Documentos Necessários:** ${
      documentsRequired.length
        ? documentsRequired.join('\n')
        : 'Nenhum documento necessário.'
    }

    ${attachementIII || attachementIV ? '**Anexos:**' : ''}
    ${attachementIII ? await getObjectToS3('documents/Anexo_III.pdf') : ''}
    ${attachementIV ? await getObjectToS3('documents/Anexo_IV.pdf') : ''}
  `.trim();
};
