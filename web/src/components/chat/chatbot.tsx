'use client';

import { useChatbot } from '@/hooks/use-chatbot';
import { MessageCircle, Paperclip } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Control, Input } from '../ui/input';
import { PopoverMenu, PopoverMenuContent, PopoverMenuTrigger } from '../ui/popover-menu';
import { ProgressBar } from '../ui/progress';
import { ChatbotMessage } from './chatbot-message';
import { ChatbotRecorder } from './chatbot-recorder';
import { ChatbotTyping } from './chatbot-typing';

export const Chatbot = () => {
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, botTyping, progress, setMessage, submitMessage } = useChatbot();

  const scrollToBottom = (behavior: ScrollBehavior) => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Function to scroll to the bottom of the chat when the chat is open
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom('instant');
    }, 10);

    return () => clearTimeout(timeout);
  }, [open]);

  // Function to scroll to the bottom of the chat when a new message is sent or the bot is typing or the progress is updated
  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, botTyping, progress]);

  // Function to get input text on press enter key and submit the message
  const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputRef.current?.value.trim()) {
      const input = inputRef.current.value.trim();

      setMessage({ from: 'user', text: input });

      try {
        await submitMessage(input);
      } catch (error) {
        toast.error('Ocorreu um erro com o chatbot!');
      }

      inputRef.current.value = '';
    }
  };

  const handleSendInitialMessage = useCallback(async () => {
    try {
      await submitMessage('oi');
    } catch (error) {
      toast.error('Ocorreu um erro com o chatbot!');
    }
  }, [submitMessage]);

  // Function to handle the interaction with the chatbot on first open chat
  useEffect(() => {
    if (open && messages.length === 0) {
      handleSendInitialMessage();
    }
  }, [handleSendInitialMessage, open, messages]);

  const onOpenChange = () => {
    setOpen(!open);
  };

  return (
    <div className="absolute bottom-4 right-4">
      <PopoverMenu open={open}>
        <PopoverMenuTrigger className="rounded-full p-3" onClick={onOpenChange}>
          <MessageCircle className="text-background size-10 hover:text-white" />
        </PopoverMenuTrigger>
        <PopoverMenuContent className="mr-4 mb-4 h-[700px] flex flex-1 flex-col justify-between w-[450px] data-[state=closed]:animate-[chat-hide_200ms] data-[state=open]:animate-[chat-show_200ms]">
          <div className="flex flex-col mt-2 pt-2 px-4 space-y-4 overflow-y-auto">
            {messages.map((message, index) => (
              <ChatbotMessage key={index} {...message} />
            ))}

            {botTyping && <ChatbotTyping />}

            {progress && (
              <div className="flex items-end justify-end mx-2">
                <ProgressBar progress={progress} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <Input
            className="rounded-xl rounded-t-none px-1 py-2 gap-1"
            name="message"
            id="message"
          >
            <Control
              id="message"
              name="message"
              type="text"
              placeholder="Digite algo..."
              autoComplete="off"
              autoFocus
              onKeyDown={handleSubmit}
              className="text-md w-full focus:border-primary rounded-full"
              ref={inputRef}
            />

            <Button
              variant="toggle"
              size="toggle"
              className="inline-flex items-center justify-center rounded-full"
            >
              <Paperclip size={24} />
            </Button>

            <ChatbotRecorder />
          </Input>
        </PopoverMenuContent>
      </PopoverMenu>
    </div>
  );
};
