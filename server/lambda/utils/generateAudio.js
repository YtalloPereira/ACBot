const { GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient, polly, s3 } = require('../lib/aws');
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
    
    if (response.Item) {
      return response.Item.audioUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao verificar o hash no DynamoDB', error);
    throw new Error('Erro ao verificar o hash no DynamoDB');
  }
};

module.exports.generateAudio = async (text) => {
  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Joanna',
  };

  try {
    const audioStream = await polly.synthesizeSpeech(params).promise();
    
    const filePath = path.join('/tmp', 'audio.mp3');
    fs.writeFileSync(filePath, audioStream.AudioStream);
    
    return filePath;
  } catch (error) {
    console.error('Erro ao gerar áudio com Polly', error);
    throw new Error('Erro ao gerar áudio com Polly');
  }
};

module.exports.uploadAudioToS3 = async (filePath, hash) => {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: process.env.AUDIO_BUCKET,
    Key: `audios/${hash}.mp3`,
    Body: fileStream,
  };

  try {
    const result = await s3.upload(uploadParams).promise();
    return result.Location;
  } catch (error) {
    console.error('Erro ao fazer upload do áudio no S3', error);
    throw new Error('Erro ao fazer upload do áudio no S3');
  }
};

// Função para salvar a URL do áudio no DynamoDB
module.exports.saveAudioUrlToDynamoDB = async (hash, audioUrl) => {
  const params = {
    TableName: `${process.env.RESOURCE_PREFIX}-audios`,
    Item: {
      phraseHash: hash,
      audioUrl: audioUrl,
    },
  };

  try {
    const command = new PutCommand(params);
    await dynamoDBDocClient.send(command);
  } catch (error) {
    console.error('Erro ao salvar a URL no DynamoDB', error);
    throw new Error('Erro ao salvar a URL no DynamoDB');
  }
};