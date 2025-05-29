import React from 'react';

const VoiceControlBar = ({
  isListening,
  transcript,
  finalTranscript,
  startListening,
  stopListening,
  isSupported,
}) => {
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported, App.jsx shows a banner
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-3 shadow-2xl z-50 border-t border-slate-700 ">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full transition-colors duration-200 ${
              isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-sky-500 hover:bg-sky-600'
            }`}
            title={isListening ? 'Stop Listening' : 'Start Listening'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-6 h-6"
            >
              {isListening ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15c-2.21 0-4-1.79-4-4V5c0-2.21 1.79-4 4-4s4 1.79 4 4v6c0 2.21-1.79 4-4 4z"
                />
              )}
            </svg>
          </button>
          <span className="ml-3 text-sm text-slate-300">
            {isListening ? 'Listening...' : 'Voice control off. Click mic to start.'}
          </span>
        </div>
        <div className="text-sm text-slate-400 h-6 overflow-hidden w-full sm:w-auto text-center sm:text-right">
          <p className="truncate" title={transcript || finalTranscript}>
            {transcript || finalTranscript || (isListening ? 'Say a command...' : 'Transcript will appear here.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceControlBar;
