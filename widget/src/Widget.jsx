import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './styles.css';

const Widget = ({ apiUrl = 'http://localhost:5000' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showPreChat, setShowPreChat] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({ name: '', email: '', message: '' });
  const [conversationId, setConversationId] = useState(null);
  const [visitorId, setVisitorId] = useState(null);
  const [sessionId] = useState(() => `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [rating, setRating] = useState(0);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !socketRef.current) {
      socketRef.current = io(apiUrl, {
        transports: ['websocket'],
        reconnection: true,
      });

      socketRef.current.on('connect', () => {
        console.log('Widget connected to server');
        socketRef.current.emit('visitor:connect', {
          sessionId,
          userAgent: navigator.userAgent,
        });
      });

      socketRef.current.on('visitor:connected', (data) => {
        setVisitorId(data.visitorId);
      });

      socketRef.current.on('message:new', (data) => {
        if (data.message.conversation === conversationId) {
          setMessages((prev) => [...prev, data.message]);
          if (!isOpen) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      });

      socketRef.current.on('typing:start', () => {
        setIsTyping(true);
      });

      socketRef.current.on('typing:stop', () => {
        setIsTyping(false);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Widget disconnected from server');
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isOpen, apiUrl, sessionId, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handlePreChatSubmit = (e) => {
    e.preventDefault();
    
    if (!visitorInfo.name || !visitorInfo.email) {
      return;
    }

    setShowPreChat(false);

    if (socketRef.current && visitorId) {
      socketRef.current.emit('conversation:start', {
        visitorId,
        message: visitorInfo.message,
      });

      socketRef.current.on('conversation:created', (data) => {
        setConversationId(data.conversation._id);
        if (visitorInfo.message) {
          setMessages([{
            _id: Date.now().toString(),
            content: visitorInfo.message,
            sender: 'visitor',
            createdAt: new Date(),
          }]);
        }
      });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !conversationId) return;

    const message = {
      conversation: conversationId,
      content: inputValue,
      sender: 'visitor',
      senderId: visitorId,
      senderModel: 'Visitor',
    };

    socketRef.current.emit('message:send', message);
    
    setMessages((prev) => [...prev, {
      _id: Date.now().toString(),
      content: inputValue,
      sender: 'visitor',
      createdAt: new Date(),
    }]);

    setInputValue('');
  };

  const handleRatingSubmit = () => {
    if (rating > 0 && conversationId) {
      fetch(`${apiUrl}/api/conversations/${conversationId}/rate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      }).then(() => {
        setShowRating(false);
        setIsOpen(false);
      });
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="livechat-widget-container">
      {isOpen && (
        <div className="livechat-window">
          <div className="livechat-header">
            <div>
              <h3>LiveChat Support</h3>
              <p>We typically reply in a few minutes</p>
            </div>
            <button className="livechat-close" onClick={handleToggle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {showRating ? (
            <div className="livechat-rating">
              <h3>Rate your experience</h3>
              <p>How would you rate this conversation?</p>
              <div className="livechat-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`livechat-star ${rating >= star ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button className="livechat-submit-btn" onClick={handleRatingSubmit}>
                Submit Rating
              </button>
            </div>
          ) : showPreChat ? (
            <div className="livechat-prechat">
              <h3>Start a conversation</h3>
              <form className="livechat-prechat-form" onSubmit={handlePreChatSubmit}>
                <div className="livechat-form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={visitorInfo.name}
                    onChange={(e) => setVisitorInfo({ ...visitorInfo, name: e.target.value })}
                    required
                  />
                </div>
                <div className="livechat-form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={visitorInfo.email}
                    onChange={(e) => setVisitorInfo({ ...visitorInfo, email: e.target.value })}
                    required
                  />
                </div>
                <div className="livechat-form-group">
                  <label>How can we help?</label>
                  <textarea
                    rows="3"
                    value={visitorInfo.message}
                    onChange={(e) => setVisitorInfo({ ...visitorInfo, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="livechat-submit-btn">
                  Start Chat
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="livechat-messages">
                {messages.map((message) => (
                  <div key={message._id} className={`livechat-message ${message.sender}`}>
                    <div className="livechat-message-content">
                      {message.content}
                      <div className="livechat-message-time">
                        {formatTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="livechat-typing">Agent is typing...</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="livechat-input-area">
                <form className="livechat-form" onSubmit={handleSendMessage}>
                  <textarea
                    className="livechat-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    rows="1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button type="submit" className="livechat-send" disabled={!inputValue.trim()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      <button className="livechat-launcher" onClick={handleToggle}>
        {unreadCount > 0 && <div className="livechat-badge">{unreadCount}</div>}
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default Widget;
