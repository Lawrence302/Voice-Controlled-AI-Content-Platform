import { useState, useEffect } from 'react'
import './App.css'
import About from './pages/About'
import Home from './pages/home'
import Contact from './pages/contact'
import Header from './components/header'
import CreatePostModal from './components/CreatePostModal'
import LoadingSpinner from './components/LoadingSpinner'
import Alert from './components/Alert'

import { generateBlogPostContent } from '../geminiService'
import {useLocation, useNavigate, Routes, Route } from 'react-router-dom'
import PostDetail from './pages/PostDetail'



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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [appError, setAppError] = useState(null);
  const [appLoading, setAppLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('geminiBlogPosts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = async (topic) => {
    setAppError(null);
    try {
      const generatedData = await generateBlogPostContent(topic);
      const newPost = {
        id: crypto.randomUUID(),
        ...generatedData,
        createdAt: new Date().toISOString(),
        author: 'Lawrence ',
      };

      // save the generated post to database 
      const res = await fetch("http://127.0.0.1:8000/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          summary: newPost.summary,
          author: newPost.author,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();

      // normalize backend date field to match UI's createdAt
      const postWithUiField = { ...data, createdAt: data.date };

      setPosts(prevPosts => [postWithUiField, ...prevPosts]);
      setIsCreateModalOpen(false);
      navigate(`/post/${data.id}`);
    } catch (error) {
      console.error("Failed to create post:", error);
      if (error instanceof Error) {
        setAppError(`Error creating post: ${error.message}. The modal might show more specific details.`);
      } else {
        setAppError("An unknown error occurred while finalizing post creation.");
      }
      throw error; 
    }
  };

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
    <>
    
      <Header onNewPostClick={() => setIsCreateModalOpen(true)} />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      

       <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
      


      
      
    </>
  )
}

export default App
