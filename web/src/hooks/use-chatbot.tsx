import { ChatbotContext } from '@/contexts/chatbot';
import { useContext } from 'react';

export const useChatbot = () => {
  const context = useContext(ChatbotContext);

  return context;
};
