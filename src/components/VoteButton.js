import React, { useState, useEffect } from 'react';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import axios from 'axios';

interface VoteButtonProps {
  postId: string;
  userId: string;
  voteType: string;
}

const VoteButton: React.FC<VoteButtonProps> = ({ postId, userId, voteType }) => {
  const [voteCount, setVoteCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchVoteCount = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}/votes`);
        const post = response.data;
        const votes = post.votes.filter((vote) => vote.voteType === voteType);
        setVoteCount(votes.length);
        const existingVote = post.votes.find((vote) => vote.userId.toString() === userId);
        if (existingVote && existingVote.voteType === voteType) {
          setHasVoted(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchVoteCount();
  }, [postId, userId, voteType]);

  const handleVote = async () => {
    try {
      const response = await axios.post(`/api/posts/${postId}/votes`, {
        userId,
        voteType,
      });
      if (response.status === 200) {
        setVoteCount(voteCount + 1);
        setHasVoted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      className={`bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded ${
        hasVoted ? 'text-green-500' : 'text-gray-600'
      }`}
      onClick={handleVote}
    >
      {voteType === 'upvote' ? 'Upvote' : 'Downvote'} ({voteCount})
    </button>
  );
};

export default VoteButton;