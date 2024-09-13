import { toast } from 'sonner';

let audioRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export const startAudioRecorder = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // create stream from the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // create a new instance of the MediaRecorder with stream
      audioRecorder = new MediaRecorder(stream);

      // clear the audio chunks
      audioChunks = [];

      // check ondataavailable event to get the audio chuck
      audioRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      // check onerror event to show an error message
      audioRecorder.onerror = () => {
        toast.error('Erro ao gravar áudio!');
        reject(new Error('Erro ao gravar áudio!'));
      };

      // check onstop event to send the audio url
      audioRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        resolve(URL.createObjectURL(audioBlob));
      };

      // start the audio recording
      audioRecorder.start();
    } catch (error) {
      toast.error('Erro ao acessar o microfone!');
      reject(new Error('Erro ao acessar o microfone!'));
    }
  });
};

// stop the audio recording
export const stopAudioRecorder = () => {
  if (audioRecorder && audioRecorder.state !== 'inactive') {
    audioRecorder.stop();
  }
};
