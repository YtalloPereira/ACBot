const { confirmResponseCard } = require('../utils/confirmResponseCard');
const { detectImageText } = require('../utils/detectImageText');
const { fetchAvailableDocuments } = require('../utils/fetchAvaliableDocuments');
const { findProcess } = require('../utils/findProcess');
const { generateAudio } = require('../utils/generateAudio');
const { handleResponse } = require('../utils/responseBuilder');

module.exports.handleCheckDocumentLegibilityIntent = async (event) => {
  const { DocumentType, ImageKey } = event.sessionState.intent.slots;

  const documents = await fetchAvailableDocuments();

  // Verifica se o slot DocumentType e ImageKey foram preenchidos
  if (DocumentType && ImageKey) {
    const documentType = DocumentType.value.interpretedValue;
    const imageKey = ImageKey.value.interpretedValue;

    event.sessionState.sessionAttributes.documentDefined = 'clear';

    // Verifica se a imageKey é válida
    const accpetedImageKeys = /(\.png|\.jpg|\.jpeg)$/i.test(imageKey);

    if (!accpetedImageKeys) {
      const msg = 'O arquivo de imagem deve ser um arquivo PNG, JPG ou JPEG.';
      return handleResponse(event, 'Close', null, msg);
    }

    const doc = documents.find((d) => d.key === documentType.toUpperCase());

    if (!doc) {
      const msg = 'Ocorreu um erro ao tentar verificar o documento.';
      const audioUrl = await generateAudio(msg);
      return handleResponse(event, 'Close', null, audioUrl);
    }

    try {
      const response = await detectImageText(imageKey);

      const textDetected = response.TextDetections.map(
        (t) => t.DetectedText
      ).join(' ');

      const missingTags = doc.tags.filter(
        (tag) => !textDetected.toUpperCase().includes(tag)
      );

      if (missingTags.length > 0) {
        const msg = `A imagem não corresponde ao documento **${documentType}**, não está legível o suficiente ou faltam partes do documento.`;
        const audioUrl = await generateAudio(msg);
        return handleResponse(event, 'Close', null, audioUrl);
      }

      const msg = `A imagem corresponde ao documento **${documentType}**.`;

      const audioUrl = await generateAudio(msg);

      return handleResponse(event, 'Close', null, audioUrl);
    } catch (error) {
      console.error(error);
      const msg = 'Ocorreu um erro ao tentar verificar o documento.';
      return handleResponse(event, 'Close', null, msg);
    }
  }

  const documentsAvailable = documents.map((doc) => doc.key).join(', ');
  const msg = `No momento posso verificar a legibilidade dos documentos a seguir: 

  **${documentsAvailable}**`;

  const slotMsg =
    'Qual o tipo de documento que você quer verificar a legibilidade? Insira o nome exatamente como descrito acima.';

  // Retorna uma mensagem solicitando o slot DocumentType e informando quais os tipos de documentos disponíveis
  return handleResponse(event, 'ElicitSlot', 'DocumentType', [msg, slotMsg]);
};
