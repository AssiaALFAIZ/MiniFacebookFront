import React from 'react';

const Comment = ({ author, text, timestamp }) => {
  return (
    <div className="comment">
      <div className="comment-author">
        <strong>{author}:</strong>
      </div>
      <div className="comment-text">
        {text}
      </div>
      <div className="comment-timestamp">
        {timestamp}
      </div>
    </div>
  );
};

export default Comment;
