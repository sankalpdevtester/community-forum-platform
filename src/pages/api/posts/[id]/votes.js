import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { connectToDatabase } from '../../config/index';

const votePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { userId, voteType } = req.body;

  if (!id || !userId || !voteType) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const client = new MongoClient(connectToDatabase());
  const db = client.db();
  const postsCollection = db.collection('posts');
  const usersCollection = db.collection('users');

  try {
    const post = await postsCollection.findOne({ _id: id });
    const user = await usersCollection.findOne({ _id: userId });

    if (!post || !user) {
      return res.status(404).json({ message: 'Post or user not found' });
    }

    const existingVote = post.votes.find((vote) => vote.userId.toString() === userId);
    if (existingVote) {
      if (existingVote.voteType === voteType) {
        return res.status(400).json({ message: 'You have already voted this way' });
      } else {
        await postsCollection.updateOne(
          { _id: id },
          { $pull: { votes: { userId: userId } } }
        );
      }
    }

    await postsCollection.updateOne(
      { _id: id },
      { $push: { votes: { userId: userId, voteType: voteType } } }
    );

    return res.status(200).json({ message: 'Vote cast successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.close();
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return votePost(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}