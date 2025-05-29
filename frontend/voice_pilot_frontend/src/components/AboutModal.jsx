import React from 'react';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 */
const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 id="about-modal-title" className="text-2xl font-semibold text-purple-400">
            About Voice Blog AI
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200"
            aria-label="Close about modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto space-y-4 pr-2 flex-grow text-slate-300">
          <p>
            <strong>Voice Blog AI</strong> is a demonstration application showcasing how voice commands can be integrated into a web application for content creation and navigation.
          </p>
          <p>
            Users can create blog posts, dictate their content, and even get AI-powered title suggestions using the Gemini API.
          </p>
          <p>Key technologies used:</p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-slate-400">
            <li>React for the user interface</li>
            <li>Tailwind CSS for styling</li>
            <li>Web Speech API for voice recognition</li>
            <li>Google Gemini API for AI features</li>
          </ul>
          <p className="mt-4 text-sm text-slate-500">
            This project is designed to be a responsive and accessible example of modern web development with voice interaction.
          </p>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
