const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient } = require('../lib/aws');

module.exports.checkAudioExists = async (hash) => {
  const params = {
    TableName: `${process.env.RESOURCE_PREFIX}-audios`,
    Key: {
      phraseHash: hash,
    },
  };

  try {
    const command = new GetCommand(params);
    const response = await dynamoDBDocClient.send(command);
    
    // Verifica se já existe áudio associado ao hash da frase
    if (response.Item) {
      return response.Item.audioUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao verificar o hash no DynamoDB', error);
    throw new Error('Erro ao verificar o hash no DynamoDB');
  }
};
