import { toast } from 'sonner';

let audioRecorder: MediaRecorder | null = null;

export const startAudioRecorder = async (setAudioUrl: (url: string) => void) => {
  // create stream from the user's microphone
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // create a new instance of the MediaRecorder with stream
  audioRecorder = new MediaRecorder(stream);

  const audioChunks: Blob[] = [];

  // check ondataavailable event to get the audio chuck
  audioRecorder.ondataavailable = (e) => {
    audioChunks.push(e.data);
  };

  // check onerror event to show an error message
  audioRecorder.onerror = () => {
    toast.error('Erro ao gravar áudio!');
  };

  // check onstop event to send the audio url
  audioRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    setAudioUrl(URL.createObjectURL(audioBlob));
    audioChunks.length = 0;
  };

  // start the audio recording
  audioRecorder.start();
};

// stop the audio recording
export const stopAudioRecorder = () => {
  if (audioRecorder) {
    audioRecorder.stop();
  }
};
