'use client';

import { handleInteract } from '@/lib/interactions';
import { MessageCircle, Paperclip } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AudioRecorderWithSpeechRecognition } from './audio-recorder-with-speech-recognition';
import { ChatBotMessage, IChatBotMessage } from './chatbot-message';
import { ChatbotTyping } from './chatbot-typing';
import { Button } from './ui/button';
import { Control, Input } from './ui/input';
import { PopoverMenu, PopoverMenuContent, PopoverMenuTrigger } from './ui/popover-menu';

export const Chatbot = () => {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<IChatBotMessage[]>([]);
  const [botTyping, setBotTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [recognition, setRecognition] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior) => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Function to handle the interaction with the chatbot
  const handleSendMensage = useCallback(
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

  // Function to handle the interaction with the chatbot on first open chat
  useEffect(() => {
    if (open && messages.length === 0) {
      handleSendMensage('oi');
    }
  }, [handleSendMensage, open, messages]);

  // Function to scroll to the bottom of the chat when the chat is open
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom('instant');
    }, 10);

    return () => clearTimeout(timeout);
  }, [open]);

  // Function to scroll to the bottom of the chat when a new message is sent
  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length]);

  // Function to handle the submission of the user text message
  const handleSubmitText = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputRef.current?.value.trim()) {
      const input = inputRef.current.value.trim();

      setMessages((prevMessages) => [...prevMessages, { from: 'user', text: input }]);

      handleSendMensage(input);
      inputRef.current.value = '';
    }
  };

  // Function to handle the submission of a recording and recognition
  const handleSubmitRecordingAndRecognition = useCallback(() => {
    if (recognition && audioUrl) {
      setMessages((prevMessages) => [...prevMessages, { from: 'user', audioUrl }]);
      handleSendMensage(recognition);

      setRecognition('');
      setAudioUrl(null);
    }
  }, [recognition, audioUrl, handleSendMensage]);

  // Function to handle the submission of a recording and recognition when the recognition and audioUrl are set
  useEffect(() => {
    if (recognition && audioUrl) {
      handleSubmitRecordingAndRecognition();
    }
  }, [recognition, audioUrl, handleSubmitRecordingAndRecognition]);

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
          <div className="flex flex-col pt-4 px-4 space-y-4 overflow-y-auto">
            {messages.map((message, index) => (
              <ChatBotMessage key={index} sendMessage={handleSendMensage} {...message} />
            ))}

            {botTyping && <ChatbotTyping />}
            <div ref={messagesEndRef} />
          </div>

          <Input className="rounded-xl rounded-t-none px-1 py-2 gap-1">
            <Control
              type="text"
              placeholder="Digite algo..."
              autoComplete="off"
              autoFocus
              onKeyDown={handleSubmitText}
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
            <AudioRecorderWithSpeechRecognition
              onRecognition={setRecognition}
              onRecording={setAudioUrl}
            />
          </Input>
        </PopoverMenuContent>
      </PopoverMenu>
    </div>
  );
};
