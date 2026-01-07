// client/src/components/mention/MentionTag.js
import React from 'react';
import { Link } from 'react-router-dom';

const MentionTag = ({ username, className = "" }) => {
  return (
    <Link 
      to={`/profile/${username}`}
      className={`text-blue-500 hover:text-blue-600 hover:underline font-medium ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      @{username}
    </Link>
  );
};

export default MentionTag;