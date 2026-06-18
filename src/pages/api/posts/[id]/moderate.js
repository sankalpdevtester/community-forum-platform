import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { connectToDatabase } from '../../config/index';

const moderatePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { userId, moderationType } = req.body;

  if (!id || !userId || !moderationType) {
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

    if (moderationType === 'approve') {
      await postsCollection.updateOne(
        { _id: id },
        { $set: { approved: true, moderatedBy: userId } }
      );
    } else if (moderationType === 'reject') {
      await postsCollection.updateOne(
        { _id: id },
        { $set: { approved: false, moderatedBy: userId } }
      );
    } else {
      return res.status(400).json({ message: 'Invalid moderation type' });
    }

    return res.status(200).json({ message: 'Post moderated successfully' });
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
      return moderatePost(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}