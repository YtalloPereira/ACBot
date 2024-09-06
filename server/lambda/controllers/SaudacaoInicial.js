export const handleSaudacaoIntent = async (event) => {
   const response = {
      sessionState: {
         ...event.sessionState,
         dialogAction: {
            type: 'Close',
         },
      },
      messages: [
         {
            content: "Olá! 👋 Seja bem-vindo ao nosso assistente de processos acadêmicos. ",
            contentType: "PlainText"
         },
         {
            contentType: "ImageResponseCard",
            imageResponseCard: {
               title: "Veja as opções abaixo para começar. Basta clicar em um card para obter mais informações.",
               buttons: [
                  {
                     text: "Obtenha orientação sobre como abrir um processo.",
                     value: "Obtenha orientação sobre como abrir um processo."
                  },
                  {
                     text: "Descubra os tipos de processos disponíveis.",
                     value: "Descubra os tipos de processos disponíveis."
                  },
                  {
                     text: "Inicie um novo processo.",
                     value: "Inicie um novo processo."
                  },
                  {
                     text: "Verifique o status dos processos em andamento.",
                     value: "Verifique o status dos processos em andamento."
                  },
               ],
            },
         },
      ]
   };

   return response;
};
