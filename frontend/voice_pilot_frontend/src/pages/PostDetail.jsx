
import { useParams } from "react-router-dom"
import PostView from "../components/PostView";
 
const PostDetail = ({posts}) => {
  
    const { id } = useParams();
    console.log("the id of view is : ", id)
    const post = posts.find(p => String(p.id) === id || String(p.view_id) === id);
    console.log(post)
    if (!post) {
        return <p className="text-center text-slate-600 text-lg py-10">Post not found.</p>;
    }
    return <PostView post={post} />;
    
}

export default PostDetail