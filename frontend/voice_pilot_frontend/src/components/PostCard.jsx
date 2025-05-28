import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-sky-700 mb-2">
          <Link to={`/post/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <p className="text-sm text-slate-500 mb-3">
          By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-slate-600 mb-4 leading-relaxed">{post.summary}</p>
        <Link
          to={`/post/${post.id}`}
          className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Read More &rarr;
        </Link>
      </div>
    </article>
  );
};

export default PostCard;