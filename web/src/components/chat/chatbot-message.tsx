import { IChatbotMessage } from '@/contexts/chatbot';
import { useChatbot } from '@/hooks/use-chatbot';
import { Bot } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export const ChatbotMessage = ({
  from,
  text,
  audioUrl,
  imageUrl,
  card,
}: IChatbotMessage) => {
  const { setMessage, submitMessage } = useChatbot();

  const handleSubmit = async (value: string) => {
    setMessage({ from: 'user', text: value });

    try {
      await submitMessage(value);
    } catch (error) {
      toast.error('Ocorreu um erro com o chatbot!');
    }
  };

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
            className="px-4 py-3 break-words text-pretty max-w-[330px] bg-primary text-white rounded-s-2xl rounded-tr-2xl data-[from=bot]:bg-border/80 data-[from=bot]:text-foreground data-[from=bot]:rounded-r-2xl data-[from=bot]:rounded-bl-none whitespace-pre-line"
            data-from={from}
            dangerouslySetInnerHTML={{
              __html: text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'),
            }}
          />
        )}

        {audioUrl && <audio src={audioUrl} controls />}

        {imageUrl && (
          <Image
            src={imageUrl}
            alt="image"
            width={200}
            height={200}
            className="rounded-xl size-auto border border-primary"
            quality={70}
          />
        )}

        {card && (
          <div
            className="px-4 py-3 inline-block bg-primary text-white rounded-s-2xl rounded-tr-2xl data-[from=bot]:bg-border/80 data-[from=bot]:text-foreground data-[from=bot]:rounded-r-2xl data-[from=bot]:rounded-bl-none"
            data-from={from}
          >
            {card?.imageUrl && (
              <div className="bg-primary rounded-xl p-2">
                <Image
                  src={card.imageUrl}
                  alt="card-image"
                  width={200}
                  height={200}
                  className="rounded-xl size-auto border border-primary"
                  quality={70}
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
                  onClick={() => handleSubmit(button.value)}
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
