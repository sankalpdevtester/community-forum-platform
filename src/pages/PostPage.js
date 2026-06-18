import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import VoteButton from '../components/VoteButton';

const PostPage = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`/api/posts/${id}`);
      if (response.status === 200) {
        setPost(response.data);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get(`/api/posts/${id}/comments`);
      if (response.status === 200) {
        setComments(response.data);
      }
    };
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (comment) => {
    try {
      const response = await axios.post(`/api/posts/${id}/comments`, { comment });
      if (response.status === 201) {
        setComments([...comments, response.data]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-lg">{post.content}</p>
      <VoteButton postId={post._id} upvotes={post.upvotes.length} downvotes={post.downvotes.length} />
      <h2 className="text-2xl font-bold mt-4">Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id} className="mb-4">
            <p className="text-lg">{comment.content}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={(e) => {
        e.preventDefault();
        const comment = e.target.comment.value;
        handleCommentSubmit(comment);
        e.target.comment.value = '';
      }}>
        <input type="text" name="comment" placeholder="Add a comment" className="w-full p-2 border border-gray-400 rounded" />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostPage;