import React, { useState, useEffect } from 'react';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import axios from 'axios';

interface ModerationButtonProps {
  postId: string;
  userId: string;
}

const ModerationButton: React.FC<ModerationButtonProps> = ({ postId, userId }) => {
  const [postApproved, setPostApproved] = useState(false);

  useEffect(() => {
    const fetchPostApproval = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}`);
        const post = response.data;
        setPostApproved(post.approved);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPostApproval();
  }, [postId]);

  const handleModeration = async (moderationType: string) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/moderate`, {
        userId,
        moderationType,
      });
      if (response.status === 200) {
        setPostApproved(moderationType === 'approve');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {postApproved ? (
        <button
          className="bg-green-500 hover:bg-green-700 py-2 px-4 rounded text-white"
          onClick={() => handleModeration('reject')}
        >
          Reject
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded text-white"
          onClick={() => handleModeration('approve')}
        >
          Approve
        </button>
      )}
    </div>
  );
};

export default ModerationButton;