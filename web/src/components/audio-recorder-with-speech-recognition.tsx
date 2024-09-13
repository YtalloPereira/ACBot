'use client';

import { startAudioRecorder, stopAudioRecorder } from '@/lib/audio-recorder';
import { startSpeechRecognition, stopSpeechRecognition } from '@/lib/speech-recognition';
import { Mic, MicOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface AudioRecorderWithSpeechRecognitionProps {
  onRecording: (audioUrl: string) => void;
  onRecognition: (recognition: string) => void;
}

export const AudioRecorderWithSpeechRecognition = ({
  onRecognition,
  onRecording,
}: AudioRecorderWithSpeechRecognitionProps) => {
  const [isRecording, setIsRecording] = useState(false);

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
    const [recognition, audioUrl] = await Promise.all([
      startSpeechRecognition(),
      startAudioRecorder(),
    ]);

    // Set the recognition and audioUrl
    onRecognition(recognition);
    onRecording(audioUrl);
  };

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
    >
      {!isRecording ? <Mic /> : <MicOff />}
    </Button>
  );
};
