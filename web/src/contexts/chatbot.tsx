'use client';

import { getUploadAudioSignedUrl, getUploadImageSignedUrl } from '@/actions/s3';
import { convertToMp3 } from '@/utils/convert-to-mp3';
import { Interactions, SendOutput } from '@aws-amplify/interactions';
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
  audioUrl?: URL;
  imageUrl?: URL;
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
  fileManager: boolean;
  setIsRecording: (isRecording: boolean) => void;
  submitMessage: (input: string) => Promise<void>;
  submitAudio: (audioUrl: string) => Promise<string>;
  submitImage: (file: File) => Promise<string>;
}

export const ChatbotContext = createContext<ChatbotProps>({} as ChatbotProps);

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<IChatbotMessage[]>([]);
  const [fileManager, setFileManager] = useState(false);
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
      if (!input) {
        return;
      }

      setBotTyping(true);

      // Send the message to the chat

      let response: SendOutput;

      try {
        response = await Interactions.send({
          botName: process.env.NEXT_PUBLIC_BOT_NAME as string,
          message: input,
        });
      } catch (error) {
        setBotTyping(false);
        throw error;
      }

      // Check if the document type is defined in the chatbot and set the file manager state
      const documentDefined =
        response?.sessionState?.sessionAttributes?.documentDefined === 'true';

      setFileManager(documentDefined);

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
          text:
            msg.contentType === 'PlainText' && !msg.content?.startsWith('https://')
              ? msg.content
              : undefined,
          audioUrl:
            msg.contentType === 'PlainText' && msg.content?.startsWith('https://')
              ? new URL(msg.content)
              : undefined,
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

    setTimeout(async () => {
      setProgress(null);
    }, 300);

    return filename;
  };

  // Function to handle the submission of an image
  const submitImage = async (file: File) => {
    setProgress(1);

    const signedUrlResponse = await getUploadImageSignedUrl(file.name);

    setProgress(50);

    const { filename, url } = signedUrlResponse;

    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    setProgress(99);

    setTimeout(async () => {
      setProgress(null);
    }, 300);

    return filename;
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
        fileManager,
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
