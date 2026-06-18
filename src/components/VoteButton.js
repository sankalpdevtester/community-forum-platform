import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const VoteButton = ({ postId, upvotes, downvotes }) => {
  const [vote, setVote] = useState(null);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchVote = async () => {
      const response = await axios.get(`/api/posts/${postId}/votes`);
      if (response.data.vote) {
        setVote(response.data.vote);
        if (response.data.vote === 'upvote') {
          setIsUpvoted(true);
        } else if (response.data.vote === 'downvote') {
          setIsDownvoted(true);
        }
      }
    };
    fetchVote();
  }, [postId]);

  const handleUpvote = async () => {
    try {
      const response = await axios.post(`/api/posts/${postId}/votes`, { vote: 'upvote' });
      if (response.status === 200) {
        setIsUpvoted(true);
        setIsDownvoted(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownvote = async () => {
    try {
      const response = await axios.post(`/api/posts/${postId}/votes`, { vote: 'downvote' });
      if (response.status === 200) {
        setIsDownvoted(true);
        setIsUpvoted(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveVote = async () => {
    try {
      const response = await axios.delete(`/api/posts/${postId}/votes`);
      if (response.status === 200) {
        setIsUpvoted(false);
        setIsDownvoted(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        className={`mr-2 ${isUpvoted ? 'text-green-500' : 'text-gray-500'}`}
        onClick={isUpvoted ? handleRemoveVote : handleUpvote}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        <span className="ml-2">{upvotes}</span>
      </button>
      <button
        className={`ml-2 ${isDownvoted ? 'text-red-500' : 'text-gray-500'}`}
        onClick={isDownvoted ? handleRemoveVote : handleDownvote}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="ml-2">{downvotes}</span>
      </button>
    </div>
  );
};

export default VoteButton;