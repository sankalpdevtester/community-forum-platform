import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { authenticate } from '../../pages/api/auth';

const client = new MongoClient(process.env.MONGODB_URI);

const votePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const userId = authenticate(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (req.method === 'POST') {
    const vote = req.body.vote;
    if (vote === 'upvote') {
      post.upvotes.push(userId);
      post.downvotes = post.downvotes.filter((id) => id !== userId);
    } else if (vote === 'downvote') {
      post.downvotes.push(userId);
      post.upvotes = post.upvotes.filter((id) => id !== userId);
    }

    await post.save();
    return res.status(200).json({ message: 'Vote cast successfully' });
  } else if (req.method === 'DELETE') {
    post.upvotes = post.upvotes.filter((id) => id !== userId);
    post.downvotes = post.downvotes.filter((id) => id !== userId);

    await post.save();
    return res.status(200).json({ message: 'Vote removed successfully' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await client.connect();
  const db = client.db();
  const postsCollection = db.collection('posts');
  const usersCollection = db.collection('users');

  Post.collection = postsCollection;
  User.collection = usersCollection;

  await votePost(req, res);
  client.close();
}