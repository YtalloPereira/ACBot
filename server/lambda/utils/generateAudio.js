const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient, polly } = require('../lib/aws');
const fs = require('fs');
const path = require('path');

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

// Função para gerar o áudio com Polly
module.exports.generateAudio = async (text) => {
  const params = {
    Text: text,
    OutputFormat: 'mp3',
  };

  try {
    const audioStream = await polly.synthesizeSpeech(params).promise();
    
    // Caminho temporário para salvar o arquivo de áudio localmente
    const filePath = path.join('/tmp', 'audio.mp3');
    fs.writeFileSync(filePath, audioStream.AudioStream);
    
    return filePath;
  } catch (error) {
    console.error('Erro ao gerar áudio com Polly', error);
    throw new Error('Erro ao gerar áudio com Polly');
  }
};