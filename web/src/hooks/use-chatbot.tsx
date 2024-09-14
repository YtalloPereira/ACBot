import { getUploadAudioSignedUrl } from '@/actions/s3';
import { handleInteract } from '@/lib/interactions';
import { convertToMp3 } from '@/utils/convert-to-mp3';
import axios from 'axios';
import { useCallback, useState } from 'react';
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

export type IChatbotMessage = {
  from: 'bot' | 'user';
  text?: string;
  audioUrl?: string;
  card?: IResponseCard;
};

export const useChatbot = () => {
  const [messages, setMessages] = useState<IChatbotMessage[]>([]);
  const [botTyping, setBotTyping] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Function to handle the interaction with the chatbot
  const sendMensage = useCallback(
    async (input: string) => {
      setBotTyping(true);

      const botResponses = await handleInteract(input);

      if (!botResponses || botResponses?.length === 0) return;

      botResponses.map((msg) =>
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            from: 'bot',
            text: msg.contentType === 'PlainText' ? msg.content : undefined,
            card:
              msg.contentType === 'ImageResponseCard' ? msg.imageResponseCard : undefined,
          },
        ]),
      );

      setBotTyping(false);
    },
    [setMessages, setBotTyping],
  );

  // Function to handle the submission of a recording and recognition after stop recording
  const submitAudio = async (audioUrl: string) => {
    try {
      setProgress(1);

      const audioFile = await convertToMp3(audioUrl);

      setProgress(33);

      const signedUrlResponse = await getUploadAudioSignedUrl(audioFile.name);

      if (signedUrlResponse === undefined) {
        throw new Error('Failed to get signed url');
      }

      setProgress(75);

      const { filename, url } = signedUrlResponse;

      const formData = new FormData();

      formData.append('file', audioFile);

      await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProgress(100);

      return filename;
    } catch (error) {
      toast.error('Erro ao enviar a gravação de áudio!');
    } finally {
      setProgress(null);
    }
  };

  return {
    messages,
    setMessages,
    botTyping,
    setBotTyping,
    progress,
    setProgress,
    isRecording,
    setIsRecording,
    sendMensage,
    submitAudio,
  };
};
