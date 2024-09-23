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
      className="flex items-center justify-end gap-2 data-[from=bot]:justify-start"
      data-from={from}
    >
      <div
        className="text-md leading-tight order-1 bg-primary data-[file=true]:bg-background rounded-s-2xl rounded-tr-2xl data-[from=bot]:rounded-r-2xl data-[from=bot]:rounded-bl-none data-[from=bot]:bg-border/80 px-4 py-3 text-white data-[from=bot]:text-foreground break-words max-w-[380px]"
        data-from={from}
        data-file={imageUrl || audioUrl ? true : false}
      >
        {text && (
          <span
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: text
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                .replace(/(?<!\*)\*(?!\*)/g, '•'),
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
          <>
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
                  className="flex-1 bg-gray-600/70 hover:bg-gray-600"
                  onClick={() => handleSubmit(button.value)}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>

      {from === 'bot' && (
        <div className="bg-primary rounded-full p-2 mt-auto">
          <Bot size={24} className="text-white" />
        </div>
      )}
    </div>
  );
};
