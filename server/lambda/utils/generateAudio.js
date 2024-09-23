const { GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDBDocClient, polly, s3 } = require('../lib/aws');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Função principal que orquestra todo o processo
module.exports.processPhrase = async (phrase) => {
  // Cria o hash da frase
  const hash = crypto.createHash('sha256').update(phrase).digest('hex');

  // Verifica se o áudio já existe no DynamoDB
  let audioUrl = await this.checkAudioExists(hash);

  if (audioUrl) {
    return audioUrl;  // Retorna a URL existente
  }

  // Gera o áudio com Polly
  const filePath = await this.generateAudio(phrase);

  // Faz o upload do áudio no S3
  audioUrl = await this.uploadAudioToS3(filePath, hash);

  // Salva a URL no DynamoDB
  await this.saveAudioUrlToDynamoDB(hash, audioUrl);

  // Retorna a URL gerada
  return audioUrl;
};

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

// Função para integração com Amazon Lex
module.exports.handleLexRequest = async (event) => {
  try {
    const phrase = event.inputTranscript;  // Frase recebida do Lex
    const hash = crypto.createHash('sha256').update(phrase).digest('hex');

    let audioUrl = await this.checkAudioExists(hash);

    if (!audioUrl) {
      const filePath = await this.generateAudio(phrase);
      audioUrl = await this.uploadAudioToS3(filePath, hash);
      await this.saveAudioUrlToDynamoDB(hash, audioUrl);
    }

    return {
      sessionAttributes: event.sessionAttributes,
      dialogAction: {
        type: 'Close',
        fulfillmentState: 'Fulfilled',
        message: {
          contentType: 'PlainText',
          content: `O áudio gerado pode ser acessado em: ${audioUrl}`,
        },
      },
    };
  } catch (error) {
    console.error('Erro ao processar requisição do Lex', error);
    throw new Error('Erro ao processar requisição do Lex');
  }
};