'use strict';

import { useState, useEffect, useCallback, useRef } from 'react';


interface UseVoiceSearchProps {
  onTranscriptChange?: (text: string) => void;
  onResult?: (text: string) => void;
}

export const useVoiceSearch = ({ onTranscriptChange, onResult }: UseVoiceSearchProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any | null>(null);

  const onTranscriptChangeRef = useRef(onTranscriptChange);
  const onResultRef = useRef(onResult);

  // Sync callbacks with refs
  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
    onResultRef.current = onResult;
  }, [onTranscriptChange, onResult]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check browser compatibility
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Web Speech API is not supported in this browser.');
      return;
    }


    const reco = new SpeechRecognition();
    reco.continuous = false;
    reco.interimResults = false;
    reco.lang = 'en-IN'; // Standard locale, can fall back to standard English

    reco.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    reco.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      setError(event.error || 'Speech input failed.');
      setIsListening(false);
    };

    reco.onend = () => {
      setIsListening(false);
    };

    reco.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
      if (onTranscriptChangeRef.current) onTranscriptChangeRef.current(resultText);
      if (onResultRef.current) onResultRef.current(resultText);
    };

    setRecognition(reco);
  }, []);




  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (e) {
        console.error('Failed to start speech recognition', e);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop();
      } catch (e) {
        console.error('Failed to stop speech recognition', e);
      }
    }
  }, [recognition, isListening]);

  const isSupported = typeof window !== 'undefined' && 
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported,
  };
};

