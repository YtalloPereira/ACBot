'use client';

import { useAuth } from '@/hooks/use-auth';
import { Interactions } from '@aws-amplify/interactions';
import { Bot, MessageCircle, Mic, Paperclip } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Control, Input } from './ui/input';
import { PopoverMenu, PopoverMenuContent, PopoverMenuTrigger } from './ui/popover-menu';

interface ResponseCard {
  title?: string;
  imageUrl?: string;
  buttons?: {
    text: string;
    value: string;
  }[];
}

interface ChatBotMessage {
  from: string;
  text?: string;
  card?: ResponseCard;
}

interface ChatBotResponse {
  contentType: string;
  content?: string;
  imageResponseCard?: ResponseCard;
}

export const Chatbot = () => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<ChatBotMessage[]>([]);

  const [botTyping, setBotTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior) => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom('smooth');
    }, 10);

    return () => clearTimeout(timeout);
  }, [messages, open]);

  const handleInteract = async (message: string) => {
    try {
      const response = await Interactions.send({
        botName: process.env.NEXT_PUBLIC_BOT_NAME as string,
        message,
      });

      const botResponses: ChatBotResponse[] | undefined = response.messages;

      return botResponses;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const addChat = useCallback(
    async (input: string) => {
      setBotTyping(true);

      const botResponses = await handleInteract(input);

      if (!botResponses) return;

      botResponses?.map((msg) => {
        if (msg.contentType === 'PlainText') {
          setMessages((prevMessages) => [
            ...prevMessages,
            { from: 'bot', text: msg?.content || '' },
          ]);
        }

        if (msg.contentType === 'ImageResponseCard') {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              from: 'bot',
              card: msg.imageResponseCard,
            },
          ]);
        }
      });

      setBotTyping(false);
    },
    [setMessages, setBotTyping],
  );

  useEffect(() => {
    if (open && messages.length === 0) {
      addChat('oi');
    }
  }, [addChat, open, messages]);

  const updateChat = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputRef.current?.value.trim()) {
      const input = inputRef.current.value.trim();
      setMessages((prevMessages) => [...prevMessages, { from: 'user', text: input }]);
      addChat(input);
      inputRef.current.value = '';
    }
  };

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
              <div
                key={index}
                className="flex items-end justify-end data-[from=bot]:justify-start"
                data-from={message.from}
              >
                <div
                  className="flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 items-end order-1 data-[from=bot]:items-start data-[from=bot]:order-2"
                  data-from={message.from}
                >
                  <div>
                    {message.text ? (
                      <span
                        className="px-4 py-3 inline-block bg-primary text-white rounded-s-2xl rounded-tr-2xl data-[from=bot]:bg-border/80 data-[from=bot]:text-foreground data-[from=bot]:rounded-r-2xl data-[from=bot]:rounded-bl-none"
                        data-from={message.from}
                      >
                        {message.text}
                      </span>
                    ) : (
                      <div
                        className="px-4 py-3 inline-block bg-primary text-white rounded-s-2xl rounded-tr-2xl data-[from=bot]:bg-border/80 data-[from=bot]:text-foreground data-[from=bot]:rounded-r-2xl data-[from=bot]:rounded-bl-none"
                        data-from={message.from}
                      >
                        {message.card?.imageUrl && (
                          <div className="bg-primary rounded-xl p-2">
                            <Image
                              src={message.card?.imageUrl || ''}
                              alt=""
                              width={200}
                              height={200}
                              className="rounded-xl"
                            />
                          </div>
                        )}
                        {message.card?.title && (
                          <span className="font-bold">{message.card.title}</span>
                        )}
                        <div className="flex w-full flex-col gap-2 mt-2">
                          {message.card?.buttons?.map((button, index) => (
                            <Button
                              key={index}
                              variant="primary"
                              className="flex-1"
                              onClick={() => addChat(button.value)}
                            >
                              {button.text}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {message.from === 'bot' ? (
                  <div className="bg-primary rounded-full p-2">
                    <Bot size={24} className="text-white" />
                  </div>
                ) : (
                  <Image
                    src="/no-profile.jpg"
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full order-2 data-[from=bot]:order-1"
                    data-from={message.from}
                  />
                )}
              </div>
            ))}
            {botTyping && (
              <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
                  <div>
                    <Image
                      src="/typing-animation.gif"
                      width={24}
                      height={24}
                      alt="..."
                      className="w-16 ml-6"
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="">
            <Input className="rounded-xl rounded-t-none px-1 py-2 gap-1">
              <Control
                type="text"
                placeholder="Digite algo..."
                autoComplete="off"
                autoFocus
                onKeyDown={updateChat}
                className="text-md w-full focus:border-primary rounded-full"
                ref={inputRef}
              />
              <Button
                variant="toggle"
                size="toggle"
                className="inline-flex items-center justify-center rounded-full h-8 w-8 "
              >
                <Paperclip size={24} />
              </Button>
              <Button
                variant="toggle"
                size="toggle"
                className="inline-flex items-center justify-center rounded-full h-8 w-8 "
              >
                <Mic size={24} />
              </Button>
            </Input>
          </div>
        </PopoverMenuContent>
      </PopoverMenu>
    </div>
  );
};
