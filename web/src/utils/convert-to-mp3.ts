import { getFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const convertToMp3 = async (audioUrl: string) => {
  const ffmpeg = await getFFmpeg();

  await ffmpeg.writeFile('input.wav', await fetchFile(audioUrl));

  await ffmpeg.exec([
    '-i',
    'input.wav',
    '-map',
    '0:a',
    '-b:a',
    '20k',
    '-acodec',
    'libmp3lame',
    'output.mp3',
  ]);

  const data = await ffmpeg.readFile('output.mp3');

  const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
  const audioFile = new File([audioFileBlob], 'output.mp3', {
    type: 'audio/mpeg',
  });

  return audioFile;
};
