import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { setDoc, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user was redirected from game over
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      setError('Your session has expired. Please login again.');
    }

    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const checkUsernameExists = async (username) => {
    try {
      const q = query(
        collection(db, 'users'), 
        where('username', '==', username.trim())
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking username:', error);
      throw error;
    }
  };

  const getNextAvailableUsername = async () => {
    try {
      // Check if sequence document exists
      const sequenceRef = doc(db, 'system', 'sequence');
      const sequenceDoc = await getDoc(sequenceRef);
      
      if (!sequenceDoc.exists()) {
        // Initialize sequence document if it doesn't exist
        await setDoc(sequenceRef, { currentNumber: 1 });
        return 'A1';
      }
      
      const { currentNumber } = sequenceDoc.data();
      
      // Check if we've reached the limit
      if (currentNumber > 200) {
        return null; // No more usernames available
      }
      
      return `A${currentNumber}`;
    } catch (error) {
      console.error('Error getting next username:', error);
      throw error;
    }
  };

  const incrementSequence = async () => {
    try {
      // Get a reference to the sequence document
      const sequenceRef = doc(db, 'system', 'sequence');
      const sequenceDoc = await getDoc(sequenceRef);
      
      if (!sequenceDoc.exists()) {
        throw new Error('Sequence document not found');
      }
      
      const { currentNumber } = sequenceDoc.data();
      
      // Increment the sequence
      await setDoc(sequenceRef, { currentNumber: currentNumber + 1 });
    } catch (error) {
      console.error('Error incrementing sequence:', error);
      throw error;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate username
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get the next available username in sequence
      const nextUsername = await getNextAvailableUsername();
      
      if (!nextUsername) {
        setError('No more login slots available. Maximum user limit reached.');
        setLoading(false);
        return;
      }
      
      // Check if the entered username matches the expected next username
      if (username.trim() !== nextUsername) {
        setError(`Invalid username. Please try again.`);
        setLoading(false);
        return;
      }

      // Check if username is taken (double-check)
      const exists = await checkUsernameExists(username);
      if (exists) {
        setError('Already logged in. Please use a different username.');
        setLoading(false);
        return;
      }

      // Sign in anonymously
      const { user } = await signInAnonymously(auth);
      
      // Set up session time (40 minutes from now)
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 40 * 60 * 1000); // 40 minutes

      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        username: username.trim(),
        points: 0,
        solvedQuestions: [],
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        createdAt: startTime.toISOString(),
        lastActive: startTime.toISOString()
      });
      
      // Increment the sequence for the next user
      await incrementSequence();

      // Set up auto logout
      setTimeout(() => {
        auth.signOut();
        navigate('/game-over');
      }, 40 * 60 * 1000); // 40 minutes

      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const createMatrixLine = () => {
      const line = document.createElement('div');
      line.className = 'matrix-line';
      line.style.left = `${Math.random() * 100}%`;
      line.style.height = `${Math.random() * 50 + 20}%`;
      line.style.animationDuration = `${Math.random() * 2 + 2}s`;
      
      const matrixBg = document.querySelector('.matrix-bg');
      if (matrixBg) {
        matrixBg.appendChild(line);
        
        // Remove the line after animation
        line.addEventListener('animationend', () => {
          line.remove();
        });
      }
    };

    // Create initial lines
    for (let i = 0; i < 20; i++) {
      createMatrixLine();
    }

    // Continue creating lines
    const interval = setInterval(createMatrixLine, 200);

    return () => clearInterval(interval);
  }, []);

  // Added: Function to display the next available username
  const [nextAvailable, setNextAvailable] = useState('');
  
  useEffect(() => {
    const fetchNextUsername = async () => {
      try {
        const next = await getNextAvailableUsername();
        setNextAvailable(next || 'No more usernames available');
      } catch (error) {
        console.error('Error fetching next username:', error);
      }
    };
    
    fetchNextUsername();
  }, []);

  return (
    <div 
      className="login-page" 
      style={{ 
        overflow: 'hidden !important',
        overflowY: 'hidden !important',
        overflowX: 'hidden !important',
        position: 'relative !important',
        scrollBehavior: 'none !important',
        msOverflowStyle: 'none !important',
        scrollbarWidth: 'none !important'
      }}
    >
      <div className="matrix-bg"></div>
      
      <div className="welcome-section">
        <h1 className="welcome-title">CTF CYB3R AR3NA</h1>
        <p className="welcome-subtitle">You have 40 minutes to complete the challenge</p>
        <p className="sequence-info">Next available username: {nextAvailable}</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-wrapper">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="form-input"
                placeholder={`Enter UserName`}
              />
              <div className="input-highlight"></div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <svg 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className="error-icon"
                width="20"
                height="20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Processing...' : 'Start Challenge'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;