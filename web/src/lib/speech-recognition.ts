let speechRecognition: SpeechRecognition | null = null;

export const startSpeechRecognition = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // get the SpeechRecognition API class
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    // create a new instance of the SpeechRecognition API
    speechRecognition = new SpeechRecognitionAPI();

    // set speechRecognition parameters
    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    let recognition = '';

    // check if the user is using an Android device
    const isAndroid = /Android/i.test(navigator.userAgent);

    // set the continuous property to false if the user is using an Android device because it doesn't support continuous recognition
    if (isAndroid) {
      speechRecognition.continuous = false;
    }

    // check onresult event to get the recognized text
    speechRecognition.onresult = (event) => {
      recognition = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0]?.transcript || '');
      }, '');
    };

    // check onerror event to show an error message
    speechRecognition.onerror = (ev) => {
      reject(ev);
    };

    // check onend event to send recognition
    speechRecognition.onend = () => {
      resolve(recognition);
    };

    // start the speech recognition
    speechRecognition.start();
  });
};

// stop the speech recognition
export const stopSpeechRecognition = () => {
  if (speechRecognition) {
    speechRecognition.stop();
  }
};
