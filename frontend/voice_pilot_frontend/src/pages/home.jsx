import React from 'react'
import PostList from '../components/PostList'

const Home = ( {posts}) => {

  return (
    <PostList posts={posts} />
  )
}

export default Home