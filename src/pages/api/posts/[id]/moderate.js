import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { authenticate } from '../../pages/api/auth';

const client = new MongoClient(process.env.MONGODB_URI);

const moderatePost = async (req: NextApiRequest, res: NextApiResponse) => {
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

  if (!user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'PATCH') {
    const moderationAction = req.body.action;
    if (moderationAction === 'approve') {
      post.approved = true;
    } else if (moderationAction === 'reject') {
      post.approved = false;
    } else if (moderationAction === 'delete') {
      await post.remove();
      return res.status(200).json({ message: 'Post deleted successfully' });
    }

    await post.save();
    return res.status(200).json({ message: 'Post moderated successfully' });
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

  await moderatePost(req, res);
  client.close();
}