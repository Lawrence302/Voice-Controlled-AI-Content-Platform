import React from'react';
import { Link } from 'react-router-dom';

const Header = ({ onNewPostClick, onToggleHelp  }) => {
 
  


  // Start recognition 
 
 

  return (
    <div className=' flex flex-wrap justify-around p-4 bg-slate-900 text-white ' >
      
      <h1 className='text-3xl text-indigo-600 font-bold' >VoicePilot</h1>
      
      
      <ul className=' flex justify-around items-center gap-6'>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
        <li><Link to='/contact'>Contact</Link></li>
        {/* ////////////////// */}
       

          <button
            onClick={onToggleHelp}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-2 px-3 rounded-lg text-sm transition-colors duration-150 flex items-center"
            title="Show Voice Commands Help"
            aria-label="Show voice commands help"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Help
          </button>

      </ul>

      
      <button
        onClick={onNewPostClick}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors flex items-center text-sm"
        aria-label="Create new post"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 sm:mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Post
      </button>

     
    </div>
  );
};

export default Header;
