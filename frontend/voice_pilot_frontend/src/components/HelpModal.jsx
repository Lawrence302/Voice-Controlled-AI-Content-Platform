import React , {forwardRef} from 'react';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {{ command: string, description: string }[]} props.commands - List of voice commands
 */
const HelpModal = forwardRef(({ isOpen, onClose, commands }, ref) => {
  

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-yellow-400">Voice Commands Help</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div ref={ref} className="overflow-y-auto space-y-3 pr-2 flex-grow">
          {commands.map((cmd, index) => (
            <div key={index} className="bg-slate-700 p-3 rounded-md">
              <p className="font-semibold text-sky-400">{cmd.command}</p>
              <p className="text-sm text-slate-300">{cmd.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors font-semibold"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
});

export default HelpModal;
