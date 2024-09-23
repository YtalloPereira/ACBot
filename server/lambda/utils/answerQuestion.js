const { InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { bedrock } = require('../lib/aws');

module.exports.answerQuestion = async (text, question) => {
  // Cria um prompt para perguntar ao modelo de linguagem
  const prompt = `
    Interprete o seguinte texto e responda a pergunta fornecida:
 
    Texto:
    "${text}"
 
    Pergunta:
    "${question}"
 
    Formato de resposta:
      A resposta deve estar em **português do Brasil**.
      Use \n para indicar quebras de linha.
      Utilize **negrito** para destacar termos importantes na resposta.
 
    A resposta deve estar de forma clara e objetiva.
    
    Se o usuário não fornecer uma pergunta válida mediante o texto fornecido, 
    você deve informar a ele esta mensagem: "Desculpe, sua pergunta está fora do contexto.
    
    Não acrescente mais texto à resposta caso a pergunta não esteja relacionada ao texto fornecido.`;

  // Cria um comando para invocar o modelo de linguagem com o prompt e outros parâmetros
  const command = new InvokeModelCommand({
    modelId: 'amazon.titan-text-premier-v1:0',
    body: JSON.stringify({
      inputText: prompt,
      textGenerationConfig: {
        temperature: 0.4,
        topP: 0.8,
        maxTokenCount: 1024,
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
