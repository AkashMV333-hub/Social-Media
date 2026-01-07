// client/src/components/mention/MentionInput.js
import React, { useState, useRef, useEffect } from 'react';
import MentionTag from './MentionTag';
import api from '../../api/axios';

const MentionInput = ({ 
  value, 
  onChange, 
  placeholder = "What's happening?", 
  className = "",
  maxLength = 280 
}) => {
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Parse mentions from text
  const parseMentions = (text) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push({
        username: match[1],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
    return mentions;
  };

  // Render text with mentions
  const renderTextWithMentions = () => {
    const mentions = parseMentions(value);
    if (mentions.length === 0) {
      return value;
    }

    const elements = [];
    let lastIndex = 0;

    mentions.forEach((mention, index) => {
      // Add text before mention
      if (mention.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {value.substring(lastIndex, mention.startIndex)}
          </span>
        );
      }

      // Add mention tag
      elements.push(
        <MentionTag 
          key={`mention-${index}`}
          username={mention.username}
        />
      );

      lastIndex = mention.endIndex;
    });

    // Add remaining text
    if (lastIndex < value.length) {
      elements.push(
        <span key="text-final">
          {value.substring(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const newCursorPosition = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(newCursorPosition);

    // Check if we're typing a mention
    const textBeforeCursor = newValue.substring(0, newCursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const term = mentionMatch[1];
      setSearchTerm(term);
      if (term.length >= 2) {
        searchUsers(term);
      } else {
        setMentionSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
      setMentionSuggestions([]);
    }
  };

  // Search users
  const searchUsers = async (term) => {
    try {
      const response = await api.get(`/api/users/search?q=${term}`);
      setMentionSuggestions(response.data.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching users:', error);
      setMentionSuggestions([]);
    }
  };

  // Handle mention selection
  const handleSelectMention = (username) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    
    // Replace the @partial with @username
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.substring(0, mentionMatch.index);
      const newValue = beforeMention + `@${username} ` + textAfterCursor;
      onChange(newValue);
      
      // Set cursor position after the mention
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = beforeMention.length + username.length + 2;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
    
    setShowSuggestions(false);
    setMentionSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          textareaRef.current && !textareaRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
        maxLength={maxLength}
        rows={3}
      />
      
      {maxLength && (
        <div className="text-right text-sm text-gray-500 mt-1">
          {value.length}/{maxLength}
        </div>
      )}

      {/* Mention Suggestions Dropdown */}
      {showSuggestions && mentionSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-10"
        >
          {mentionSuggestions.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => handleSelectMention(user.username)}
            >
              <img
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=40`}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">@{user.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionInput;