const {
  DynamoDBDocumentClient,
  PutCommand,
} = require('@aws-sdk/lib-dynamodb');

const { dynamodb } = require('./dynamodb');

const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamodb);

const sendMultipleItems = async (items) => {
  items.map(async(item) => {
    const command = new PutCommand({
      TableName: 'processos',
      Item: item,
    })
   
    const data = await dynamoDBDocClient.send(command);
    console.log('Itens enviados com sucesso:', data);
  })
  
};

// Exemplo de uso
const items = [
  {
    processId: '2',
    title: 'Acompanhamento domiciliar',
    description: 'Pedido de atendimento às atividades pedagógicas no próprio domicílio do estudante em decorrência de problemas de saúde ou licença maternidade.',
    documentsRequired: [
      'Laudo ou atestado médico com data de início e fim do afastamento',
      'Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)'
    ],
    flow: 'Gabinete Médico ou coordenação do curso (a depender da estrutura do Campus)'
  },
  {
    processId: '3',
    title: 'Ajuda de custo para participação em eventos',
    description: 'Solicitação de ajuda de custo para participação em eventos.',
    documentsRequired: [
      'Documentação, conforme edital',
      'Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)'
    ],
    flow: 'Coordenação de Curso > Professor/Setor de acompanhamento'
  },
];

(async () => {
  try {
    sendMultipleItems(items);
  } catch (error) {
    console.log(error);
  }
})();