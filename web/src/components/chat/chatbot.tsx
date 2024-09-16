'use client';

import { useChatbot } from '@/hooks/use-chatbot';
import { validateImage } from '@/utils/validate-image';
import { MessageCircle, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Control, Input } from '../ui/input';
import { PopoverMenu, PopoverMenuContent, PopoverMenuTrigger } from '../ui/popover-menu';
import { ProgressBar } from '../ui/progress';
import { ChatbotFileManager } from './chatbot-file-manager';
import { ChatbotMessage } from './chatbot-message';
import { ChatbotRecorder } from './chatbot-recorder';
import { ChatbotTyping } from './chatbot-typing';

export const Chatbot = () => {
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { messages, botTyping, progress, setMessage, submitMessage, submitImage } =
    useChatbot();

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

      inputRef.current.value = '';

      try {
        await submitMessage(input);
      } catch (error) {
        toast.error('Ocorreu um erro com o chatbot!');
      }
    }
  };

  // Function to handle the interaction with the chatbot on first open chat
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

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;

    setIsDragging(false);

    if (!files?.length) {
      return;
    }

    const selectedFile = files[0];

    if (await validateImage(selectedFile)) {
      toast.error('O formato da imagem deve ser .jpg, .jpeg ou .png!');
    }

    try {
      const filename = await submitImage(selectedFile);

      setMessage({
        from: 'user',
        imageUrl: `https://${process.env.NEXT_PUBLIC_S3_DOMAIN}/${filename}`,
      });

      await submitMessage('imagem');
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar a imagem!');
    }
  };

  return (
    <div className="absolute bottom-4 right-4">
      <PopoverMenu open={open}>
        <PopoverMenuTrigger className="rounded-full p-3" onClick={onOpenChange}>
          <MessageCircle className="text-background size-10 hover:text-white" />
        </PopoverMenuTrigger>
        <PopoverMenuContent
          className="mr-4 mb-4 h-[700px] flex flex-1 flex-col justify-between w-[450px] data-[state=closed]:animate-[chat-hide_200ms] data-[state=open]:animate-[chat-show_200ms] relative"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="size-full bg-background/40 rounded-xl backdrop-blur-sm absolute left-0 top-0 flex flex-1 items-center justify-center flex-col">
              <Upload className="size-8" />
              <h1 className="font-bold text-2xl max-w-96 text-center">
                Solte a midia aqui para ser adicionada
              </h1>
            </div>
          )}
          <div>
            <div className="p-2 border-b flex-1">
              <h1 className="font-bold text-3xl tracking-wider text-center text-primary font-alt">
                {process.env.NEXT_PUBLIC_BOT_NAME}
              </h1>
            </div>

            <div className="flex flex-col px-2 pt-3 space-y-4 overflow-y-auto h-[590px]">
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

            <ChatbotFileManager />

            <ChatbotRecorder />
          </Input>
        </PopoverMenuContent>
      </PopoverMenu>
    </div>
  );
};
