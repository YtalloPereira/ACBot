import { useChatbot } from '@/hooks/use-chatbot';
import { startAudioRecorder, stopAudioRecorder } from '@/lib/audio-recorder';
import { startSpeechRecognition, stopSpeechRecognition } from '@/lib/speech-recognition';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export const ChatbotRecorder = () => {
  const {
    isRecording,
    botTyping,
    fileManager,
    progress,
    setIsRecording,
    submitAudio,
    setMessage,
    submitMessage,
  } = useChatbot();

  // Function to handle submit audio and send message with recognition text
  const handleSubmitAudioAndMensage = async (audioUrl: string, recognition: string) => {
    try {
      const filename = await submitAudio(audioUrl);

      setMessage({
        from: 'user',
        audioUrl: `https://${process.env.NEXT_PUBLIC_S3_DOMAIN}/uploads/audios/${filename}`,
      });

      await submitMessage(recognition);
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar o áudio!');
    }
  };

  // Function to handle start recording audio and speech recognition
  const handleStartRecording = async () => {
    // Check if the browser supports the SpeechRecognition API
    const isSpeechRecognitionAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSpeechRecognitionAvailable) {
      alert('Seu navegador não suporta a gravação de áudio nativa!');
      return;
    }

    setIsRecording(true);

    // Start config for speech recognition and audio recorder
    try {
      const [recognition, audioUrl] = await Promise.all([
        startSpeechRecognition(),
        startAudioRecorder(),
      ]);

      // submit audio and send recognition
      handleSubmitAudioAndMensage(audioUrl, recognition);
    } catch (error) {
      if (error instanceof SpeechRecognitionErrorEvent) {
        console.error('Error in speech recognition:', error.error);
      }

      if (error instanceof Event) {
        console.error('Error in audio recording:', error);
      } else {
        console.error('Error:', error);
      }
    }
  };

  // Function to handle stop recording audio and speech recognition
  const handleStopRecording = () => {
    // Stop speech recognition and audio recording
    stopSpeechRecognition();
    stopAudioRecorder();

    setIsRecording(false);
  };
  return (
    <Button
      variant="toggle"
      size="toggle"
      onClick={!isRecording ? handleStartRecording : handleStopRecording}
      title={!isRecording ? 'Gravar áudio' : 'Parar gravação'}
      className="focus-visible:ring-foreground data-[recording=true]:bg-danger data-[recording=true]:hover:bg-danger/90 data-[recording=true]:text-white"
      data-recording={isRecording}
      disabled={botTyping || fileManager || progress !== null}
    >
      {!isRecording ? <Mic /> : <MicOff />}
    </Button>
  );
};
