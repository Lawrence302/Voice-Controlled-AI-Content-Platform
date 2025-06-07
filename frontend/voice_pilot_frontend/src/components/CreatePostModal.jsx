
import React, { useState , useEffect} from 'react';
import LoadingSpinner from './LoadingSpinner';


const CreatePostModal = ({ isOpen, onClose, onSubmit, addAlert ,  topic, setTopic }) => {
  
  // const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      addAlert && addAlert('warning', "Please enter a topic for your blog post.");
      return;
    }
   
    setIsLoading(true);
    try {
      await onSubmit(topic);
      setTopic(''); // Clear topic on successful submission
      // onClose(); // Parent will handle closing on success if needed
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unknown error occurred.";
      addAlert && addAlert('error', msg);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
    console.log("Current topic in modal:", topic);
  }, [topic]);

  if (!isOpen) return null;

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-sky-700">Create New Blog Post</h2>
          <button
            onClick={() => { onClose(); }}
            className="text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>


        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-6">
            <label htmlFor="postTopic" className="block text-sm font-medium text-slate-700 mb-1">
              Blog Post Topic
            </label>
            <input
              type="text"
              id="postTopic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The future of renewable energy"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
              disabled={isLoading}
            />
            <p className="text-xs text-slate-500 mt-1">Enter a topic, and AI will generate a blog post for you.</p>
          </div>

          <div className="flex justify-end items-center space-x-3">
            {isLoading && <LoadingSpinner size="sm" />}
            <button
              type="button"
              onClick={() => { onClose(); setTopic('') }}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              disabled={isLoading || !String(topic).trim()} // !String(topic).trim() makes sure the trim() only works on string and does not trow an error before the topic is set
            >
              {isLoading ? 'Generating...' : 'Generate Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;