const { InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { bedrock } = require('../lib/aws');

module.exports.answerQuestion = async (text, question) => {
  // Cria um prompt para perguntar ao modelo de linguagem
  const prompt = `
    Interprete o seguinte texto e responda a questão fornecida:
 
    Texto:
    "${text}"
 
    Pergunta:
    "${question}"
 
    Formato de resposta:
    1. A resposta deve estar em **português do Brasil**.
    2. Use \\n para indicar quebras de linha.
    3. Utilize **negrito** para destacar termos importantes na resposta.
 
    Responda de forma clara e objetiva.`;

  // Cria um comando para invocar o modelo de linguagem com o prompt e outros parâmetros
  const command = new InvokeModelCommand({
    modelId: 'amazon.titan-text-premier-v1:0',
    body: JSON.stringify({
      inputText: prompt,
      textGenerationConfig: {
        temperature: 0.5,
        topP: 0.9,
        maxTokenCount: 512,
      },
    }),
    contentType: 'application/json',
  });

  // Envia o comando para o modelo de linguagem do Bedrock
  const response = await bedrock.send(command);

  // Decodifica a resposta do modelo de linguagem
  const answer = new TextDecoder().decode(response.body);

  // Retorna o resultado da resposta decodificada
  return JSON.parse(answer).results[0].outputText;
};
