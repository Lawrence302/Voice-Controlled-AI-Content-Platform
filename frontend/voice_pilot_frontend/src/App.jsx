import { useState, useEffect, useCallback, useRef} from 'react'

import './App.css'
import About from './pages/About'
import Home from './pages/home'
import Contact from './pages/contact'
import Header from './components/header'
import CreatePostModal from './components/CreatePostModal'
import LoadingSpinner from './components/LoadingSpinner'
import Alert from './components/Alert'
import VoiceControlBar from './components/VoiceControlBar.jsx'
import AlertPopup from './components/AlertPopup.jsx'
import HelpModal from './components/HelpModal.jsx'
import AboutModal from './components/AboutModal.jsx'

import { generateBlogPostContent } from '../geminiService'
import {useLocation, useNavigate, Routes, Route } from 'react-router-dom'
import PostDetail from './pages/PostDetail'
import { useVoiceCommands } from './hooks/useVoiceCommands.js'

import { VOICE_COMMANDS_HELP } from '../constants.js'
// get existing posts from database
// get existing posts from database
let INITIAL_POSTS_DATA = [];


// const INITIAL_POSTS_DATA = [
//   {
//     id: '1',
//     title: 'Welcome to Gemini Blog!',
//     summary: 'Discover the power of AI-generated content on our new platform.',
//     content: 'This is the inaugural post on Gemini Blog, a place where creativity meets artificial intelligence. Here, you can explore articles written with the help of cutting-edge language models, and even contribute your own AI-assisted creations.\n\nOur goal is to showcase how AI can be a powerful tool for content creation, idea generation, and storytelling. Stay tuned for more exciting posts!',
//     createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
//     author: 'The Gemini Team',
//   },
//   {
//     id: '2',
//     title: 'The Future of Blogging with AI',
//     summary: 'Exploring how AI is set to revolutionize the way we create and consume blog content.',
//     content: 'Artificial intelligence is rapidly transforming various industries, and blogging is no exception. From automated content generation to personalized reading experiences, AI offers a plethora of possibilities.\n\nImagine drafting an article with an AI co-author, getting instant feedback on style and grammar, or even having AI generate topic ideas based on current trends. This is not science fiction; it\'s the near future of blogging.\n\nWhile AI provides powerful assistance, the human touch remains crucial for authentic storytelling and unique perspectives. The synergy between human creativity and AI capabilities will define the next era of digital content.',
//     createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
//     author: 'AI Enthusiast',
//   },
// ];

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


function App() {
   const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('geminiBlogPosts');
    return savedPosts ? JSON.parse(savedPosts) : INITIAL_POSTS_DATA;
  });
 
  const [appError, setAppError] = useState(null);
  const [appLoading, setAppLoading] = useState(false);

  // varable definitions for voice recognition , draft post and alert message

  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [currentPostDraft, setCurrentPostDraft] = useState({ title: '' }); // content is optional
  const [alerts, setAlerts] = useState([]); // array of alert messages
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [showVoiceError, setShowVoiceError] = useState(false)


  const navigate = useNavigate();
  const helpScrollRef = useRef();

  
  const addAlert = useCallback((type, message) => {
  const newAlert = { id: crypto.randomUUID(), type, message };
  setAlerts(prevAlerts => [newAlert, ...prevAlerts.slice(0, 2)]);
  
  setTimeout(() => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== newAlert.id));
    }, 5000);
  }, []);


  // the function which handles the creation of a new post
  const handleCreatePost = useCallback(async () => {
  setAppError(null);
  const topic = currentPostDraft.title;

  if (!topic) {
    addAlert('warning', 'Title is required to generate and save the post.');
    return;
  }

  setIsGeminiLoading(true)
  try {
    const generatedData = await generateBlogPostContent(topic);

    const newPost = {
      id: crypto.randomUUID(),
      ...generatedData,
      createdAt: new Date().toISOString(),
      author: 'Lawrence',
    };

    const res = await fetch("http://127.0.0.1:8000/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();

    const postWithUiField = { ...data, createdAt: data.date };

    setPosts(prevPosts => [postWithUiField, ...prevPosts]);
    setIsCreatePostModalOpen(false);
    navigate(`/post/${data.id}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error.";
    setAppError(`Failed to create post: ${msg}`);
    throw error; // Still throw so caller knows it failed
  }finally{
    setIsGeminiLoading(false)
  }
}, [currentPostDraft.title, addAlert, navigate, setIsCreatePostModalOpen]);


  // using voice command hook
  const {
    isListening,
    transcript,
    finalTranscript,
    startListening,
    stopListening,
    error: voiceError,
    isSupported: voiceSupported
  } = useVoiceCommands({
    isCreatePostModalOpen,
    setIsCreatePostModalOpen,
    setCurrentPostDraft,
    handleCreatePost,
    setIsHelpModalOpen,
    setIsAboutModalOpen,
    helpScrollRef,
    addAlert,
    navigate
  });

  useEffect(() => {
    localStorage.setItem('geminiBlogPosts', JSON.stringify(posts));
  }, [posts]);

  useEffect(()=>{
    if(voiceError){
      setShowVoiceError(true)
    }
  },[voiceError])
  

  

  useEffect(()=>{
     const fetchPosts = async () => {
    try {
      setAppLoading(true);
      const res = await fetch("http://127.0.0.1:8000/blog");
      if (res.ok) {
        const postsFromDb = await res.json();
        const normalized = postsFromDb.map(post => ({
          ...post,
          createdAt: post.date,
        }));
        setPosts(normalized);
      } else {
        console.error("Failed to fetch posts from backend");
      }
    } catch (err) {
      console.error("Error fetching posts from backend:", err);
    } finally {
      setAppLoading(false);
    }
  };

  fetchPosts();
  },[])

  useEffect(() => {
    if (appError) {
      const timer = setTimeout(() => setAppError(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [appError]);
  


  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-800 ">
    
      <Header onNewPostClick={() => {
        // setCurrentPostDraft({ title: '' });
        setIsCreatePostModalOpen(true)}}
        onToggleHelp={() => setIsHelpModalOpen(prev => !prev)}
        onToggleAbout={() => setIsAboutModalOpen(prev => !prev)}
      
        />

      <main className=" mx-auto py-8 w-[90%] bg-slate-800">
        {appLoading && <div className="py-10"><LoadingSpinner message="Loading application..." /></div>}
        {appError && !appLoading && (
          <div className="mb-6">
            <Alert type="error" message={appError} onClose={() => setAppError(null)} />
          </div>
        )}
        {!appLoading && (

          <Routes>
            <Route path="/" element={<Home posts={posts} />} />
            <Route path="/post/:id" element={<PostDetail posts={posts} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          
          </Routes>
        )}
      </main>

       {isHelpModalOpen && (
        <HelpModal 
          isOpen={isHelpModalOpen} 
          onClose={() => setIsHelpModalOpen(false)} 
          commands={VOICE_COMMANDS_HELP}
          ref={helpScrollRef}
        />
      )}

      {isAboutModalOpen && (
        <AboutModal
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
        />
      )}
      

       <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
        addAlert={addAlert}
        // the below are for setting the topic
        topic={currentPostDraft.title}   // pass current title here
        setTopic={(newTitle) => setCurrentPostDraft(prev => ({ ...prev, title: newTitle }))} // pass setter here
        isLoading={isGeminiLoading}
      />
      
      <VoiceControlBar
        isListening={isListening}
        transcript={transcript}
        finalTranscript={finalTranscript}
        startListening={startListening}
        stopListening={stopListening}
        isSupported={voiceSupported}
      />

      {showVoiceError && (
        <div className="fixed bottom-0 z-50">
          {voiceError && (
            <Alert type="error" message={`Voice command issue: ${voiceError}`} onClose={() => {setShowVoiceError(false)}} />
          )}
        </div>
      )}
      

      <div className="fixed top-20 right-4 z-50 space-y-2">
        {alerts.map(alert => (
          <AlertPopup key={alert.id} type={alert.type} message={alert.message} onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))} />
        ))}
      </div>
      
      
    </div>
  )
}

export default App
