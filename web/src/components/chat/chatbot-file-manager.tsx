import { useChatbot } from '@/hooks/use-chatbot';
import { Paperclip } from 'lucide-react';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';

export const ChatbotFileManager = () => {
  const { botTyping, isRecording, progress, setMessage, submitMessage, submitImage } =
    useChatbot();

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    if (!files?.length) {
      return;
    }

    const selectedFile = files[0];

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
    <>
      <input
        type="file"
        name="image"
        id="image"
        accept=".jpg,.jpeg,.png"
        className="peer sr-only"
        onChange={handleFileSelected}
        disabled={botTyping || isRecording || progress !== null}
      />
      <label
        htmlFor="image"
        title="Selecione ou arraste e solte um arquivo"
        className="cursor-pointer p-2 rounded-full outline-none transition-all focus-visible:ring-1 active:transition-none bg-border/60 hover:bg-border hover:ring-primary focus-visible:ring-primary active:bg-border/80 disabled:bg-border/50 data-[disabled=true]:bg-border/50 data-[disabled=true]:cursor-not-allowed"
        data-disabled={botTyping || isRecording || progress !== null}
      >
        <Paperclip size={24} />
      </label>
    </>
  );
};
