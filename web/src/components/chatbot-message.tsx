import { IResponseCard } from '@/lib/interactions';
import { Bot } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';

export type IChatbotMessage = {
  from: 'bot' | 'user';
  text?: string;
  audioUrl?: string;
  card?: IResponseCard;
};

export interface ChatbotMessageProps extends IChatbotMessage {
  sendMessage: (input: string) => Promise<void>;
}
export const ChatbotMessage = ({
  from,
  text,
  audioUrl,
  card,
  sendMessage,
}: ChatbotMessageProps) => {
  // Message component for the chatbot
  return (
    <div
      className="flex items-end justify-end data-[from=bot]:justify-start"
      data-from={from}
    >
      <div
        className="flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 items-end order-1 data-[from=bot]:items-start data-[from=bot]:order-2"
        data-from={from}
      >
        {text && (
          <span
            className="px-4 py-3 inline-block bg-primary text-white rounded-s-2xl rounded-tr-2xl data-[from=bot]:bg-border/80 data-[from=bot]:text-foreground data-[from=bot]:rounded-r-2xl data-[from=bot]:rounded-bl-none"
            data-from={from}
          >
            {text}
          </span>
        )}

        {audioUrl && <audio src={audioUrl} controls />}

        {card && (
          <div
            className="px-4 py-3 inline-block bg-primary text-white rounded-s-2xl rounded-tr-2xl data-[from=bot]:bg-border/80 data-[from=bot]:text-foreground data-[from=bot]:rounded-r-2xl data-[from=bot]:rounded-bl-none"
            data-from={from}
          >
            {card?.imageUrl && (
              <div className="bg-primary rounded-xl p-2">
                <Image
                  src={card?.imageUrl || ''}
                  alt=""
                  width={200}
                  height={200}
                  className="rounded-xl"
                />
              </div>
            )}

            {card?.title && <h1 className="font-bold">{card.title}</h1>}

            {card?.subtitle && <span>{card.subtitle}</span>}

            <div className="flex w-full flex-col gap-2 mt-2">
              {card?.buttons?.map((button, index) => (
                <Button
                  key={index}
                  variant="primary"
                  className="flex-1"
                  onClick={() => sendMessage(button.value)}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {from === 'bot' && (
        <div className="bg-primary rounded-full p-2">
          <Bot size={24} className="text-white" />
        </div>
      )}

      {from === 'user' && (
        <Image
          src="/no-profile.jpg"
          alt=""
          width={40}
          height={40}
          className="rounded-full order-2"
        />
      )}
    </div>
  );
};
