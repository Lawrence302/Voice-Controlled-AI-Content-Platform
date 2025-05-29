import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Check if the browser supports the Web Speech API (SpeechRecognition)
 */
const isSpeechRecognitionSupported = () => {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * Custom hook for handling voice recognition using Web Speech API
 */
export const useVoiceRecognition = () => {
  // State to track if recognition is active
  const [isListening, setIsListening] = useState(false);

  // State for live (interim) transcript
  const [transcript, setTranscript] = useState('');

  // State for finalized (confirmed) speech results
  const [finalTranscript, setFinalTranscript] = useState('');

  // State for error messages
  const [error, setError] = useState(null);

  // Ref to store the SpeechRecognition instance (persists across renders)
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Early return if not supported
    if (!isSpeechRecognitionSupported()) {
      setError('Speech recognition is not supported by this browser.');
      return;
    }

    // Get the appropriate SpeechRecognition constructor (cross-browser)
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Create a new instance and store it in a ref
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;

    // Configure recognition settings
    recognition.continuous = true;        // Continue listening after pauses
    recognition.interimResults = true;    // Provide interim results
    recognition.lang = 'en-US';           // Set language to English (US)

    // Event fired when speech is detected
    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      // Process each result segment starting from the current index
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setTranscript(interim); // Update live transcript

      if (final) {
        // Append the final result to the previous final transcript
        setFinalTranscript(prevFinal =>
          prevFinal ? `${prevFinal.trim()} ${final.trim()}`.trim() : final.trim()
        );
      }
    };

    // Handle recognition errors
    recognition.onerror = (event) => {
      setError(event.error || 'Unknown speech recognition error');
      setIsListening(false);
    };

    // When recognition starts
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    // When recognition ends
    recognition.onend = () => {
      setIsListening(false);
    };

    // Cleanup when component unmounts
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort(); // Stop immediately
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
      }
    };
  }, []); // Run once on mount

  /**
   * Start listening (if not already)
   */
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        setFinalTranscript('');
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
        setError("Could not start voice recognition.");
        setIsListening(false);
      }
    }
  }, [isListening]);

  /**
   * Stop listening (if currently active)
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  /**
   * Clear all transcript data
   */
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setFinalTranscript('');
  }, []);

  // Return the voice recognition state and controls
  return {
    isListening,
    transcript,
    finalTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    isSupported: isSpeechRecognitionSupported()
  };
};
