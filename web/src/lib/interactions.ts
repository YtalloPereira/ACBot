import { Interactions } from '@aws-amplify/interactions';
import { toast } from 'sonner';

export type IResponseCard = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  buttons?: {
    text: string;
    value: string;
  }[];
};

interface InteractionsResponse {
  contentType: 'PlainText' | 'ImageResponseCard';
  content?: string;
  imageResponseCard?: IResponseCard;
}

export const handleInteract = async (input: string) => {
  try {
    // Send the message to the chatbot
    const response = await Interactions.send({
      botName: process.env.NEXT_PUBLIC_BOT_NAME as string,
      message: input,
    });

    // Get the bot responses
    const botResponses: InteractionsResponse[] | undefined = response.messages;

    return botResponses;
  } catch (error) {
    toast.error('Erro ao enviar mensagem!');
  }
};
