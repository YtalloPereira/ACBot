module.exports.confirmResponseCard = (title) => {
  return {
    contentType: 'ImageResponseCard',
    imageResponseCard: {
      title: title,
      subtitle: 'Selecione uma das opções',
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
};
