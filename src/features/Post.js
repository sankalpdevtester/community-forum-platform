// src/features/Post.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'bson';
import { getPostById } from '../api/posts';
import { getTags } from '../api/tags';
import { getCategorizations } from '../api/categorizations';

// Define the Post component
const Post = ({ post }) => {
  const [tags, setTags] = useState([]);
  const [categorizations, setCategorizations] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategorizations, setSelectedCategorizations] = useState([]);
  const router = useRouter();

  // Fetch tags and categorizations on component mount
  useEffect(() => {
    const fetchTags = async () => {
      const tagsResponse = await getTags();
      setTags(tagsResponse.data);
    };

    const fetchCategorizations = async () => {
      const categorizationsResponse = await getCategorizations();
      setCategorizations(categorizationsResponse.data);
    };

    fetchTags();
    fetchCategorizations();
  }, []);

  // Handle tag selection
  const handleTagSelect = (tagId) => {
    const isSelected = selectedTags.includes(tagId);
    if (isSelected) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  // Handle categorization selection
  const handleCategorizationSelect = (categorizationId) => {
    const isSelected = selectedCategorizations.includes(categorizationId);
    if (isSelected) {
      setSelectedCategorizations(selectedCategorizations.filter((id) => id !== categorizationId));
    } else {
      setSelectedCategorizations([...selectedCategorizations, categorizationId]);
    }
  };

  // Save post with selected tags and categorizations
  const savePost = async () => {
    const updatedPost = {
      ...post,
      tags: selectedTags,
      categorizations: selectedCategorizations,
    };

    // Update post in database
    const client = new MongoClient(process.env.MONGODB_URI);
    const db = client.db();
    const postsCollection = db.collection('posts');
    await postsCollection.updateOne({ _id: ObjectId(post._id) }, { $set: updatedPost });

    // Redirect to post page
    router.push(`/posts/${post._id}`);
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <h2>Tags:</h2>
      <ul>
        {tags.map((tag) => (
          <li key={tag._id}>
            <input
              type="checkbox"
              checked={selectedTags.includes(tag._id)}
              onChange={() => handleTagSelect(tag._id)}
            />
            <span>{tag.name}</span>
          </li>
        ))}
      </ul>
      <h2>Categorizations:</h2>
      <ul>
        {categorizations.map((categorization) => (
          <li key={categorization._id}>
            <input
              type="checkbox"
              checked={selectedCategorizations.includes(categorization._id)}
              onChange={() => handleCategorizationSelect(categorization._id)}
            />
            <span>{categorization.name}</span>
          </li>
        ))}
      </ul>
      <button onClick={savePost}>Save Post</button>
    </div>
  );
};

export default Post;
```

```javascript
// src/api/posts.js
import { MongoClient } from 'mongodb';
import { ObjectId } from 'bson';

const getPostById = async (id) => {
  const client = new MongoClient(process.env.MONGODB_URI);
  const db = client.db();
  const postsCollection = db.collection('posts');
  const post = await postsCollection.findOne({ _id: ObjectId(id) });
  return post;
};

export { getPostById };
```

```javascript
// src/api/tags.js
import { MongoClient } from 'mongodb';
import { ObjectId } from 'bson';

const getTags = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  const db = client.db();
  const tagsCollection = db.collection('tags');
  const tags = await tagsCollection.find().toArray();
  return { data: tags };
};

export { getTags };
```

```javascript
// src/api/categorizations.js
import { MongoClient } from 'mongodb';
import { ObjectId } from 'bson';

const getCategorizations = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  const db = client.db();
  const categorizationsCollection = db.collection('categorizations');
  const categorizations = await categorizationsCollection.find().toArray();
  return { data: categorizations };
};

export { getCategorizations };