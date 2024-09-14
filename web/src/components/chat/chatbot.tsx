'use client';

import { startAudioRecorder, stopAudioRecorder } from '@/lib/audio-recorder';
import { startSpeechRecognition, stopSpeechRecognition } from '@/lib/speech-recognition';
import { MessageCircle, Mic, MicOff, Paperclip } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Control, Input } from '../ui/input';
import { PopoverMenu, PopoverMenuContent, PopoverMenuTrigger } from '../ui/popover-menu';
import { ChatbotMessage } from './chatbot-message';
import { ChatbotTyping } from './chatbot-typing';

import { useChatbot } from '@/hooks/use-chatbot';
import { ProgressBar } from '../ui/progress';

export const Chatbot = () => {
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    botTyping,
    isRecording,
    progress,
    setMessages,
    setIsRecording,
    sendMensage,
    submitAudio,
  } = useChatbot();

  const scrollToBottom = (behavior: ScrollBehavior) => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Function to handle the interaction with the chatbot on first open chat
  useEffect(() => {
    if (open && messages.length === 0) {
      sendMensage('oi');
    }
  }, [sendMensage, open, messages]);

  // Function to scroll to the bottom of the chat when the chat is open
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom('instant');
    }, 10);

    return () => clearTimeout(timeout);
  }, [open]);

  // Function to scroll to the bottom of the chat when a new message is sent
  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length]);

  // Function to handle the submission of the user text message
  const handleSubmitText = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputRef.current?.value.trim()) {
      const input = inputRef.current.value.trim();

      setMessages((prevMessages) => [...prevMessages, { from: 'user', text: input }]);

      sendMensage(input);
      inputRef.current.value = '';
    }
  };

  const handleSubmitAudioAndSendMensage = async (
    audioUrl: string,
    recognition: string,
  ) => {
    const filename = await submitAudio(audioUrl);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        from: 'user',
        audioUrl: `https://${process.env.NEXT_PUBLIC_S3_DOMAIN}/${filename}`,
      },
    ]);

    sendMensage(recognition);
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
      handleSubmitAudioAndSendMensage(audioUrl, recognition);
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

  const onOpenChange = () => {
    setOpen(!open);
  };

  return (
    <div className="absolute bottom-4 right-4">
      <PopoverMenu open={open}>
        <PopoverMenuTrigger className="rounded-full p-3" onClick={onOpenChange}>
          <MessageCircle className="text-background size-10 hover:text-white" />
        </PopoverMenuTrigger>
        <PopoverMenuContent className="mr-4 mb-4 h-[700px] flex flex-1 flex-col justify-between w-[450px] data-[state=closed]:animate-[chat-hide_200ms] data-[state=open]:animate-[chat-show_200ms]">
          <div className="flex flex-col mt-2 pt-2 px-4 space-y-4 overflow-y-auto">
            {messages.map((message, index) => (
              <ChatbotMessage key={index} sendMessage={sendMensage} {...message} />
            ))}

            {botTyping && <ChatbotTyping />}

            {progress && (
              <div className="flex items-end justify-end mx-2">
                <ProgressBar progress={progress} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <Input
            className="rounded-xl rounded-t-none px-1 py-2 gap-1"
            name="message"
            id="message"
          >
            <Control
              id="message"
              name="message"
              type="text"
              placeholder="Digite algo..."
              autoComplete="off"
              autoFocus
              onKeyDown={handleSubmitText}
              className="text-md w-full focus:border-primary rounded-full"
              ref={inputRef}
            />

            <Button
              variant="toggle"
              size="toggle"
              className="inline-flex items-center justify-center rounded-full"
            >
              <Paperclip size={24} />
            </Button>

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
          </Input>
        </PopoverMenuContent>
      </PopoverMenu>
    </div>
  );
};
