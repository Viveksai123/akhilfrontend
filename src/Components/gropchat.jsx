import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { updateProfile } from "firebase/auth";
import { Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { SHA256 } from 'crypto-js'; // Import for hashing
import questions from './Search'; // Adjust the path as needed

const styles = {
  // Styles remain unchanged
  '@keyframes slideIn': {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 }
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' }
  },
  chatContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
    zIndex: 1000,
    width: '380px',
    maxHeight: '600px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'slideIn 0.5s ease-out',
    border: '1px solid #333',
    fontFamily: "'Inter', system-ui, sans-serif"
  },
  chatContainerMinimized: {
    width: '250px',
    maxHeight: 'auto',
    cursor: 'pointer',
    marginBottom:'0px   '
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#800000',
    color: '#ffffff',
    borderRadius: '15px 15px 0 0',
    borderBottom: '2px solid #990000',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#990000'
    }
  },
  headerTitle: {
    fontWeight: 600,
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    letterSpacing: '0.5px'
  },
  headerControls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  unreadBadge: {
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    animation: 'pulse 1s infinite',
    boxShadow: '0 2px 8px rgba(255, 68, 68, 0.3)'
  },
  controlButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  },
  messagesContainer: {
    height: '400px',
    overflowY: 'auto',
    padding: '20px',
    scrollBehavior: 'smooth',
    backgroundColor: '#1a1a1a',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#1a1a1a'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#800000',
      borderRadius: '4px'
    }
  },
  messageWrapper: {
    marginBottom: '16px',
    display: 'flex',
    animation: 'fadeIn 0.3s ease-out'
  },
  messageWrapperSent: {
    justifyContent: 'flex-end'
  },
  messageWrapperReceived: {
    justifyContent: 'flex-start'
  },
  message: {
    padding: '12px 16px',
    borderRadius: '12px',
    maxWidth: '75%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)'
    }
  },
  messageSent: {
    backgroundColor: '#800000',
    color: 'white',
    borderTopRightRadius: '4px'
  },
  messageReceived: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    borderTopLeftRadius: '4px'
  },
  username: {
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '4px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  messageText: {
    fontSize: '14px',
    lineHeight: '1.5',
    wordBreak: 'break-word'
  },
  timestamp: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '4px',
    textAlign: 'right'
  },
  inputForm: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    borderTop: '1px solid #333',
    backgroundColor: '#1a1a1a',
    borderRadius: '0 0 16px 16px'
  },
  textInput: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'white',
    transition: 'all 0.2s ease',
    outline: 'none',
    '&:focus': {
      borderColor: '#800000',
      boxShadow: '0 0 0 2px rgba(128, 0, 0, 0.2)'
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.4)'
    }
  },
  sendButton: {
    padding: '12px',
    backgroundColor: '#800000',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    '&:hover:not(:disabled)': {
      backgroundColor: '#990000',
      transform: 'translateY(-1px)'
    },
    '&:active:not(:disabled)': {
      transform: 'translateY(1px)'
    }
  },
  loadingContainer: {
    padding: '20px',
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: '#1a1a1a',
    borderRadius: '16px'
  },
  loadingSpinner: {
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTop: '3px solid #800000',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  },
  errorContainer: {
    padding: '12px',
    margin: '0 16px 16px',
    color: '#ffffff',
    backgroundColor: '#ff4444',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '14px',
    animation: 'fadeIn 0.3s ease-out'
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
};

const FloatingGroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [processedMessages, setProcessedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [userCache, setUserCache] = useState({});

  // Validate that the questions object is loaded properly
  const validateQuestionsLoaded = () => {
    if (!questions) {
      console.error("Questions object is undefined!");
      return false;
    }
    
    if (Object.keys(questions).length === 0) {
      console.error("Questions object is empty!");
      return false;
    }
    
    // Check if any question has an answer
    const hasAnswers = Object.values(questions).some(q => q.answer);
    if (!hasAnswers) {
      console.error("No questions have answers defined!");
      return false;
    }
    
    console.log("Questions loaded successfully with", Object.keys(questions).length, "items");
    return true;
  };

  // Log questions on component mount
  useEffect(() => {
    console.log("Questions loaded:", questions);
    validateQuestionsLoaded();
  }, []);

  // Function to normalize text for comparison
  const normalizeInput = (input) => {
    return input
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s+$/g, '');
  };

  // Updated checkForFlag function to detect answers within message text
  const checkForFlag = (message) => {
    if (!validateQuestionsLoaded()) {
      console.error("Cannot check flag: questions not properly loaded");
      return false;
    }
    
    try {
      // Get all question answers
      const allAnswers = [];
      
      // Process each question to extract possible answers
      Object.values(questions).forEach(question => {
        if (question.answer) {
          // For each question, we'll try to "reverse" the hash to get potential answers
          // Since we can't actually reverse the hash, we'll store the hash itself
          allAnswers.push({
            hash: question.answer,
            questionId: question.id
          });
        }
      });
      
      // If there are no answers to check, exit early
      if (allAnswers.length === 0) {
        console.log("No answers to check against");
        return false;
      }
      
      // First approach: Check if the exact message matches an answer
      const exactMatch = allAnswers.some(answer => {
        const normalizedMessage = normalizeInput(message);
        const hashedMessage = SHA256(normalizedMessage).toString();
        return hashedMessage === answer.hash;
      });
      
      if (exactMatch) {
        console.log("Exact answer match found");
        return true;
      }
      
      // Second approach: Check if the message contains an answer
      // Break the message into words and check different combinations
      const words = message.split(/\s+/);
      
      // Check all possible word combinations
      for (let startIdx = 0; startIdx < words.length; startIdx++) {
        for (let length = 1; length <= words.length - startIdx; length++) {
          const phrase = words.slice(startIdx, startIdx + length).join(' ');
          const normalizedPhrase = normalizeInput(phrase);
          const hashedPhrase = SHA256(normalizedPhrase).toString();
          
          // Check if this phrase matches any answer
          const phraseMatch = allAnswers.some(answer => hashedPhrase === answer.hash);
          
          if (phraseMatch) {
            console.log("Partial answer match found in phrase:", phrase);
            return true;
          }
        }
      }
      
      // Split by common delimiters to catch answers that might be embedded without spaces
      const segments = message.split(/[.,;:!?\s\-_]/);
      for (const segment of segments) {
        if (segment.trim().length > 0) {
          const normalizedSegment = normalizeInput(segment);
          const hashedSegment = SHA256(normalizedSegment).toString();
          
          const segmentMatch = allAnswers.some(answer => hashedSegment === answer.hash);
          if (segmentMatch) {
            console.log("Answer match found in segment:", segment);
            return true;
          }
        }
      }
      
      // No matches found
      return false;
    } catch (error) {
      console.error("Error in checkForFlag:", error);
      return false;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch user data from user collection
  const fetchUserData = async (userId) => {
    // Check cache first
    if (userCache[userId]) {
      return userCache[userId];
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Update cache
        setUserCache(prev => ({
          ...prev,
          [userId]: userData.username || userData.displayName || 'User'
        }));
        return userData.username || userData.displayName || 'User';
      } else {
        // If user document doesn't exist
        return 'Unknown User';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return 'Unknown User';
    }
  };

  // Process messages to add username from the users collection
  useEffect(() => {
    const processMessages = async () => {
      const processed = await Promise.all(
        messages.map(async (message) => {
          if (!message.userId) {
            return { ...message, displayUsername: 'Unknown User' };
          }

          // Use cached username or fetch new one
          const username = await fetchUserData(message.userId);
          return { ...message, displayUsername: username };
        })
      );
      setProcessedMessages(processed);
    };

    if (messages.length > 0) {
      processMessages();
    }
  }, [messages, userCache]);

  useEffect(() => {
    const q = query(
      collection(db, 'groupChat'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messageList.reverse());
      setLoading(false);
      scrollToBottom();

      if (isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => unsubscribe();
  }, [isMinimized]);

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Updated handleSubmit with comprehensive flag checking
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    const messageText = newMessage.trim();
    const user = auth.currentUser;
    const userId = user.uid;

    try {
      console.log("Checking message:", messageText);
      
      // Check if the message contains a flag
      const hasFlag = checkForFlag(messageText);
      
      if (hasFlag) {
        console.log("FLAG DETECTED - blocking message");
        setError('Sharing answers is not allowed!');
        setTimeout(() => setError(''), 3000);
        return;
      }
      
      console.log("Message approved for sending");
      
      // If not a flag, send the message
      await addDoc(collection(db, 'groupChat'), {
        text: messageText,
        userId: userId,
        timestamp: serverTimestamp()
      });

      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error in message submission:', error);
      setError('Error sending message: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleChat = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setUnreadCount(0);
    }
  };

  if (loading) {
    return (
      <div style={styles.chatContainer}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner} />
          <div style={{ marginTop: '12px' }}>Loading chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      ...styles.chatContainer,
      ...(isMinimized && styles.chatContainerMinimized)
    }}>
      <div style={styles.chatHeader}>
        <div style={styles.headerTitle}>
          <span>Group Chat</span>
          {isMinimized && unreadCount > 0 && (
            <span style={styles.unreadBadge}>{unreadCount}</span>
          )}
        </div>
        <div style={styles.headerControls}>
          <button 
            style={styles.controlButton} 
            onClick={toggleChat}
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div style={styles.messagesContainer}>
            {processedMessages.map((message) => {
              const isCurrentUser = message.userId === auth.currentUser?.uid;

              return (
                <div
                  key={message.id}
                  style={{
                    ...styles.messageWrapper,
                    ...(isCurrentUser ? styles.messageWrapperSent : styles.messageWrapperReceived)
                  }}
                >
                  <div
                    style={{
                      ...styles.message,
                      ...(isCurrentUser ? styles.messageSent : styles.messageReceived)
                    }}
                  >
                    <div style={styles.username}>
                      {isCurrentUser ? "You" : message.displayUsername}
                    </div>
                    <div style={styles.messageText}>{message.text}</div>
                    <div style={styles.timestamp}>
                      {message.timestamp?.toDate().toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div style={styles.messageWrapper}>
                <div style={{...styles.message, ...styles.messageReceived}}>
                  <div style={styles.messageText}>typing...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div style={styles.errorContainer}>
              {error}
            </div>
          )}

          <form style={styles.inputForm} onSubmit={handleSubmit}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type your message..."
              style={styles.textInput}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              style={styles.sendButton}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default FloatingGroupChat;