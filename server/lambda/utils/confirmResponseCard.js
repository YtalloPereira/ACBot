const confirmResponseCard = {
  contentType: 'ImageResponseCard',
  imageResponseCard: {
    title: 'Selecione uma das opções',
    buttons: [
      {
        text: 'Sim',
        value: 'Sim',
      },
      {
        text: 'Não',
        value: 'Não',
      },
    ],
  },
};

module.exports = { confirmResponseCard };
