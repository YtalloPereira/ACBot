import { useChatbot } from '@/hooks/use-chatbot';
import { validateImage } from '@/utils/validate-image';
import { Paperclip } from 'lucide-react';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';

export const ChatbotFileManager = () => {
  const {
    botTyping,
    isRecording,
    progress,
    fileManager,
    setMessage,
    submitMessage,
    submitImage,
  } = useChatbot();

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

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
        imageUrl: `https://${process.env.NEXT_PUBLIC_S3_DOMAIN}/uploads/images/${filename}`,
      });

      await submitMessage(filename);
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar a imagem!');
    }
  };

  return (
    <label
      htmlFor="image"
      title="Selecione um arquivo"
      className="cursor-pointer p-2 rounded-full outline-none transition-all focus-within:ring-1 active:transition-none bg-border/60 hover:bg-border hover:ring-primary focus-within:ring-foreground active:bg-border/80 disabled:bg-border/50 data-[disabled=true]:bg-border/50 group data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-60"
      data-disabled={botTyping || isRecording || progress !== null}
    >
      <input
        type="file"
        name="image"
        id="image"
        accept=".jpg,.jpeg,.png"
        className="peer sr-only"
        onChange={handleFileSelected}
        disabled={botTyping || isRecording || progress !== null}
      />
      <Paperclip size={24} />
    </label>
  );
};
