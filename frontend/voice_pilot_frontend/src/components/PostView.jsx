import { Link } from 'react-router-dom';

const PostView = ({ post }) => {
  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-xl max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center text-sky-600 hover:text-sky-800 mb-6 transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to All Posts
      </Link>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">{post.title}</h1>
      <p className="text-sm text-slate-500 mb-1">
        By <span className="font-semibold">{post.author}</span>
      </p>
      <p className="text-sm text-slate-500 mb-8">
        Published on {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      
      <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-headings:text-slate-800">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph.trim() === '' ? <br key={index} /> : <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default PostView;