import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc, arrayUnion, increment } from 'firebase/firestore';
import { auth, db } from '../firebase';
import questions from './Search'; // Make sure this points to your updated questions.jsx file
import CryptoJS from 'crypto-js'; // Import CryptoJS for consistent hashing

// Utility function to generate hashes for answers (for setup)
async function generateHash(answer) {
  const hash = sha256(answer);
  console.log(`Original answer: "${answer}"`);
  console.log(`Generated hash: ${hash}`);
  return hash;
}

// Example usage:
// generateHash("CYB3RN3X4{th3_r0tt3n_secr3ts}").then(hash => console.log(hash));

// Function to normalize input string
function normalizeInput(input) {
  return input
    .trim()                    // Remove leading/trailing whitespace
    .toLowerCase()             // Convert to lowercase
    .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // Remove punctuation
    .replace(/\s+$/g, '');    // Remove trailing spaces
}

// Function to compute SHA-256 hash with normalization
function sha256(message) {
  const normalizedMessage = normalizeInput(message);
  // Use CryptoJS for consistent hashing with gropchat.jsx
  return CryptoJS.SHA256(normalizedMessage).toString();
}

function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hintsUsed, setHintsUsed] = useState([]);
  const [submissionTime, setSubmissionTime] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const textRef = useRef(null);
  
  const handleCopy = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(textRef.current.innerText);
      alert("Copied to clipboard!");
    }
  };

  // Questions are now imported from the questions.jsx file

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionData = questions[id];
        if (!questionData) {
          setError('Question not found');
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();
        
        if (userData.solvedQuestions.includes(id)) {
          setSuccess(true);
        }

        setHintsUsed(userData.hintsUsed?.[id] || []);
        setAttemptCount(userData.attempts?.[id] || 0);
        
        setQuestion(questionData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching question:', error);
        setError('Failed to load question');
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  // Navigation effect when success animation completes
  useEffect(() => {
    let timer;
    if (showSuccessAnimation) {
      timer = setTimeout(() => {
        navigate('/');
      }, 3000); // Navigate after 3 seconds when animation completes
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessAnimation, navigate]);

  const useHint = async (hintIndex) => {
    if (hintsUsed.includes(hintIndex) || loading) return;

    setLoading(true);

    try {
      const deduction = Math.ceil(question.points * 0.2);

      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        points: increment(-deduction),
        [`hintsUsed.${id}`]: arrayUnion(hintIndex)
      });

      setHintsUsed([...hintsUsed, hintIndex]);
    } catch (error) {
      console.error('Error using hint:', error);
      setError('Failed to use hint');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError('Please enter an answer');
      return;
    }
  
    setLoading(true);
    setError('');
    setSuccess(false);
  
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
  
      if (userData.solvedQuestions.includes(id)) {
        setError('You have already solved this question!');
        setLoading(false);
        return;
      }
  
      const newAttemptCount = (userData.attempts?.[id] || 0) + 1;
      await updateDoc(userRef, {
        [`attempts.${id}`]: newAttemptCount
      });
      setAttemptCount(newAttemptCount);
  
      // Hash the user's answer before comparison
      const hashedAnswer = sha256(answer);
      
      console.log("Challenge ID:", id);
      console.log("Original answer:", answer);
      console.log("Normalized answer:", normalizeInput(answer));
      console.log("Generated hash:", hashedAnswer);
      console.log("Expected hash:", question.answer);
      
      if (hashedAnswer === question.answer) {
        
        // Award full points - don't subtract for hints again since 
        // points were already deducted when hints were revealed
        const earnedPoints = question.points;
  
        await updateDoc(userRef, {
          points: increment(earnedPoints),
          solvedQuestions: arrayUnion(id),
          [`solvedAt.${id}`]: new Date().toISOString()
        });
  
        setSuccess(true);
        setSubmissionTime(new Date());
        
        // Force render success animation before redirecting
        setTimeout(() => {
          setShowSuccessAnimation(true); // Trigger success animation
        }, 100);
  
        if (newAttemptCount === 1 && hintsUsed.length === 0) {
          await updateDoc(userRef, {
            achievements: arrayUnion('perfect_solve')
          });
        }
      } else {
        setError('Incorrect answer. Try again!');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Question not found</div>
      </div>
    );
  }

  return (
    <div className="qd-main-container">
      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <div className="success-animation" style={{textAlign: 'center', animation: 'fadeIn 0.5s ease-in, bounce 1s infinite alternate', padding: '2rem', background: 'rgba(0,50,0,0.7)', borderRadius: '1rem', boxShadow: '0 0 30px rgba(0,255,0,0.5)'}}>
            <h1 style={{fontSize: '4rem', fontWeight: 'bold', color: '#4ade80', marginBottom: '1rem', textShadow: '0 0 10px rgba(0,255,0,0.7)'}}>
              Challenge Solved!
            </h1>
            <p style={{fontSize: '1.5rem', color: 'white', marginTop: '1rem'}}>
              Redirecting to challenges page...
            </p>
          </div>
        </div>
      )}

      <button 
        onClick={() => navigate(-1)} 
        className="qd-back-button"
      >
        <svg 
          className="qd-back-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Challenges
      </button>
      <div className="qd-wrapper">
        {/* Question Header */}
        <div className="qd-header">
          <h2 className="qd-title">{question.title}</h2>
          <div className="qd-meta-info">
            <span className={`qd-badge qd-difficulty-${question.difficulty.toLowerCase()}`}>
              Difficulty: {question.difficulty}
            </span>
            <span className="qd-badge qd-points">
              Points: {question.points}
            </span>
          </div>
        </div>

        {/* Question Description */}
        <div className="qd-description relative">
          <button onClick={handleCopy} className="copy-button">
            Copy
          </button>

          <pre ref={textRef} className="qd-description-text">
            {question.description}
          </pre>
        </div>

        {/* Added Resource Link Section (only shows when link exists) */}
        {question.link && (
          <div className="qd-resource-link bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg shadow-sm border border-rose-200 mt-2 mb-6" style={{ textDecoration: 'none', color: '#ffffff',marginBottom:'40px' }}>
            <h3 className="qd-resource-title text-lg font-medium text-maroon-700 mb-2" style={{color:'red', marginBottom:'10px'}}>Helpful Resource</h3>
            <a 
              href={question.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="qd-link inline-flex items-center px-4 py-2 text-maroon-600 hover:text-maroon-800 font-medium rounded-md transition-colors duration-200 group underline"
              
              style={{ textDecoration: '', color: '#ffffff',marginBottom:'40px' }}
            >
              <svg 
                className="qd-link-icon w-5 h-5 mr-2 group-hover:translate-x-0.5 transition-transform duration-200" 
                style={{ textDecoration: 'underline', color: '#ffffff',marginRight:'5px',  }}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              {question.link}
            </a>
          </div>
        )}

        {/* Hints Section */}
        <div className="qd-hints">
          <h3 className="qd-hints-title">Hints Available</h3>
          <p className="qd-hints-warning">
            Using a hint will reduce question points by 20%
          </p>
          {question.hints.map((hint, index) => (
            <button
              key={index}
              onClick={() => useHint(index)}
              disabled={loading || hintsUsed.includes(index) || success}
              className={`qd-hint-item ${hintsUsed.includes(index) ? 'qd-hint-revealed' : ''}`}
            >
              {hintsUsed.includes(index) ? (
                <div>
                  <span className="font-bold">Hint {index + 1}:</span>
                  <p>{hint}</p>
                </div>
              ) : (
                `Reveal Hint ${index + 1}`
              )}
            </button>
          ))}
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="qd-form">
          <label className="qd-form-label">Your Answer</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={loading || success}
            className="qd-input"
            placeholder="Enter your answer"
          />

          {error && (
            <div className="qd-error">
              {error}
            </div>
          )}

          {success && !showSuccessAnimation && (
            <div className="qd-success">
              <div className="qd-success-title">
                Correct! Question solved successfully.
              </div>
              {submissionTime && (
                <div className="qd-success-time">
                  Solved at: {submissionTime.toLocaleString()}
                </div>
              )}
            </div>
          )}

          <div className="qd-form-footer">
            <button
              type="submit"
              disabled={loading || success}
              className="qd-submit-btn"
            >
              {loading ? 'Submitting...' : 'Submit Answer'}
            </button>

            <div className="qd-attempts">
              Attempts: {attemptCount}
            </div>
          </div>
        </form>
      </div>

      {/* Add CSS for the success animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }
        
        .success-animation {
          text-align: center;
          animation: fadeIn 0.5s ease-in;
        }
      `}} />
    </div>
  );
}

export default QuestionDetail;