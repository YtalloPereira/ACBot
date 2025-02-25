import { IChatbotMessage } from '@/contexts/chatbot';
import { useChatbot } from '@/hooks/use-chatbot';
import { formatMessage } from '@/lib/format-message';
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
        className="text-md leading-tight order-1 bg-primary  rounded-s-2xl rounded-tr-2xl data-[from=bot]:rounded-r-2xl data-[from=bot]:rounded-bl-none data-[from=bot]:data-[file=false]:bg-border/80 data-[file=false]:px-4 data-[file=false]:py-3 text-white data-[from=bot]:text-foreground data-[file=true]:bg-background break-words max-w-[380px]"
        data-from={from}
        data-file={imageUrl || audioUrl ? true : false}
      >
        {text && (
          <span
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: formatMessage(text),
            }}
          />
        )}

        {audioUrl && <audio src={audioUrl.toString()} controls />}

        {imageUrl && (
          <Image
            src={imageUrl.toString()}
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

            <div
              className="flex w-full flex-col gap-2 mt-2 data-[length=2]:flex-row"
              data-length={card?.buttons?.length}
            >
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
