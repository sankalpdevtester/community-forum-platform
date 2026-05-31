// src/features/Notification.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getNotifications, markAsRead } from '../api/notification';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await getNotifications();
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.read).length);
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => {
        if (n._id === notificationId) {
          return { ...n, read: true };
        }
        return n;
      })
    );
    setUnreadCount((prevCount) => prevCount - 1);
  };

  const handleNavigateToPost = (postId) => {
    router.push(`/post/${postId}`);
  };

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      <p>Unread: {unreadCount}</p>
      <ul>
        {notifications.map((n) => (
          <li key={n._id}>
            <span>
              {n.type === 'comment' ? 'New comment on your post' : 'New reply to your comment'}
            </span>
            <span>
              {n.post.title} ({n.post._id})
            </span>
            <button onClick={() => handleMarkAsRead(n._id)}>Mark as read</button>
            <button onClick={() => handleNavigateToPost(n.post._id)}>Go to post</button>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default Notification;
```

```javascript
// src/api/notification.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markAsRead = async (notificationId) => {
  await api.patch(`/notifications/${notificationId}/read`);
};
```

```javascript
// src/models/Notification.js
import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
  type: { type: String, enum: ['comment', 'reply'] },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
```

```javascript
// src/config/index.js (update)
import Notification from '../models/Notification';

const models = {
  User: require('../models/User'),
  Post: require('../models/Post'),
  Notification,
};

module.exports = models;
```

```javascript
// src/features/Post.js (update)
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getPost, createComment, createReply } from '../api/post';
import Notification from '../features/Notification';

const Post = () => {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [reply, setReply] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const response = await getPost();
      setPost(response.data);
    };
    fetchPost();
  }, []);

  const handleCreateComment = async (comment) => {
    await createComment(comment);
    setComments((prevComments) => [...prevComments, comment]);
  };

  const handleCreateReply = async (reply, commentId) => {
    await createReply(reply, commentId);
    setComments((prevComments) =>
      prevComments.map((c) => {
        if (c._id === commentId) {
          return { ...c, replies: [...c.replies, reply] };
        }
        return c;
      })
    );
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <ul>
        {comments.map((c) => (
          <li key={c._id}>
            <span>{c.content}</span>
            <ul>
              {c.replies.map((r) => (
                <li key={r._id}>
                  <span>{r.content}</span>
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply"
            />
            <button onClick={() => handleCreateReply(reply, c._id)}>Reply</button>
          </li>
        ))}
      </ul>
      <Notification />
    </div>
  );
};

export default Post;