'use client';

import { detectText } from '@/actions/rekognition';
import { getUploadAudioSignedUrl, getUploadImageSignedUrl } from '@/actions/s3';
import { convertToMp3 } from '@/utils/convert-to-mp3';
import { Interactions } from '@aws-amplify/interactions';
import axios from 'axios';
import { createContext, ReactNode, useCallback, useState } from 'react';

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
  imageUrl?: string;
  card?: IResponseCard;
};

interface InteractionsResponse {
  contentType: 'PlainText' | 'ImageResponseCard';
  content?: string;
  imageResponseCard?: IResponseCard;
}

export interface ChatbotProps {
  messages: IChatbotMessage[];
  setMessage: (message: IChatbotMessage) => void;
  botTyping: boolean;
  setBotTyping: (botTyping: boolean) => void;
  progress: number | null;
  setProgress: (progress: number | null) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  submitMessage: (input: string) => Promise<void>;
  submitAudio: (audioUrl: string) => Promise<string>;
  submitImage: (file: File) => Promise<{ filename: string, text: object }>;
}

export const ChatbotContext = createContext<ChatbotProps>({} as ChatbotProps);

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<IChatbotMessage[]>([]);
  const [botTyping, setBotTyping] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Function to set a message in the chatbot
  const setMessage = useCallback((message: IChatbotMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  // Function to send a message to the chatbot and get the bot responses
  const submitMessage = useCallback(
    async (input: string) => {
      setBotTyping(true);

      // Send the message to the chat
      const response = await Interactions.send({
        botName: process.env.NEXT_PUBLIC_BOT_NAME as string,
        message: input,
      });

      console.log(response);

      // Get the bot responses
      const botResponses: InteractionsResponse[] | undefined = response.messages;

      if (!botResponses || botResponses?.length === 0) {
        setBotTyping(false);
        return;
      }

      // Set the bot responses in the chat
      botResponses.map((msg) =>
        setMessage({
          from: 'bot',
          text: msg.contentType === 'PlainText' ? msg.content : undefined,
          card:
            msg.contentType === 'ImageResponseCard' ? msg.imageResponseCard : undefined,
        }),
      );

      setBotTyping(false);
    },
    [setMessage],
  );

  // Function to handle the submission of a recording and recognition after stop recording
  const submitAudio = async (audioUrl: string) => {
    setProgress(1);

    const audioFile = await convertToMp3(audioUrl);

    setProgress(33);

    const signedUrlResponse = await getUploadAudioSignedUrl(audioFile.name);

    if (signedUrlResponse === undefined) {
      setProgress(null);
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

    setProgress(null);
    return filename;
  };

  const submitImage = async (file: File) => {
    setProgress(1);

    const signedUrlResponse = await getUploadImageSignedUrl(file.name);

    if (signedUrlResponse === undefined) {
      setProgress(null);
      throw new Error('Failed to get signed url');
    }

    setProgress(33);

    const { filename, url } = signedUrlResponse;

    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    setProgress(66);

    const text = await detectText(filename);

    setProgress(100);

    setProgress(null);
    return { filename, text };
  };

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        setMessage,
        botTyping,
        setBotTyping,
        progress,
        setProgress,
        isRecording,
        setIsRecording,
        submitMessage,
        submitAudio,
        submitImage,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};
