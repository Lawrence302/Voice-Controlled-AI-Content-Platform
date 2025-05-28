import React from 'react'
import PostCard from './PostCard';

const PostList = ({posts}) => {
 if (posts.length === 0) {
    return <p className="text-center text-slate-600 text-lg py-10">No blog posts yet. Create one to get started!</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList