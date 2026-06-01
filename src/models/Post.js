// Import required modules
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Post schema
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  votes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the Post model
const Post = mongoose.model('Post', postSchema);

// Define CRUD operations for Post
class PostModel {
  async createPost(data) {
    try {
      const post = new Post(data);
      await post.save();
      return post;
    } catch (error) {
      throw error;
    }
  }

  async getPostById(id) {
    try {
      const post = await Post.findById(id).populate('author', '_id username');
      return post;
    } catch (error) {
      throw error;
    }
  }

  async getPosts() {
    try {
      const posts = await Post.find().populate('author', '_id username');
      return posts;
    } catch (error) {
      throw error;
    }
  }

  async updatePost(id, data) {
    try {
      const post = await Post.findByIdAndUpdate(id, data, { new: true });
      return post;
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id) {
    try {
      await Post.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async votePost(id) {
    try {
      const post = await Post.findById(id);
      post.votes += 1;
      await post.save();
      return post;
    } catch (error) {
      throw error;
    }
  }
}

// Export the Post model and CRUD operations
module.exports = { Post, PostModel };