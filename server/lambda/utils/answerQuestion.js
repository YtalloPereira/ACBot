const { InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { bedrock } = require('../lib/aws');

module.exports.answerQuestion = async (text, question) => {
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
 
  const response = await bedrock.send(command);
  const answer = new TextDecoder().decode(response.body);
 
  return JSON.parse(answer).results[0].outputText;
}
 

 

 