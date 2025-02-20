import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc, arrayUnion, increment } from 'firebase/firestore';
import { auth, db } from '../firebase';

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

  // Hardcoded questions with hints
  const questions = {
    '1': {
      id: '1',
      title: 'ASCII Numbers',
      difficulty: 'easy',
      points: 100,
      description: 'Convert the following string of ASCII numbers into a readable string:\n\n0x43 0x59 0x42 0x33 0x52 0x4e 0x33 0x58 0x34 0x7b 0x57 0x33 0x4c 0x43 0x30 0x4d 0x33 0x5f 0x54 0x30 0x5f 0x43 0x59 0x42 0x33 0x52 0x4e 0x33 0x58 0x34 0x7d',
      answer: 'hello',
      hints: [
        "Each number is in hexadecimal format (base 16)",
        "Convert each hex number to its ASCII character equivalent",
        "The 0x prefix indicates a hexadecimal number"
      ]
    },
    '2': {
      id: '2',
      title: 'Rotten Secrets',
      difficulty: 'medium',
      points: 150,
      description: 'Are you familiar with ROT13, a simple encryption technique used in cryptography?\n\nPLO3EA3K4{gu3_e0gg3a_frpe3gf}',
      answer: 'hello',
      hints: [
        "ROT13 replaces each letter with the letter 13 positions after it",
        "Numbers remain unchanged in ROT13",
        "Try an online ROT13 decoder"
      ]
    },
    '3': {
      id: '3',
      title: 'Layers of Message',
      difficulty: 'hard',
      points: 200,
      description: 'Within a cryptographic maze, a hidden message lies in wait. Your task is to decipher the layers of transformation that mask the truth beneath.\n\nVm0xNFlWVXhTWGxVV0doVFYwZFNUMVV3Wkc5V1ZteFpZMGhPVlUxV1NsaFhhMlIzWVRBeFdWRnNXbFpOVmtwSVdWUktTMVl4VG5KaFJsWk9WbXR3UlZkV1dsWmxSMDVZVTJ0b1RsWnRhRmhhVjNSaFUxWmtWMVZyWkdsaVZscFhWREZhYjFSc1duUmxSVGxhVmtWYU0xcEZXbXRXVmtaMFQxWlNUbUpGY0RaWFYzUnZWVEpLUjFOWWNHaFRSVXBZVkZWYVMxSkdXa1pTVkd4UlZWUXdPUT09',
      answer: 'hello',
      hints: [
        "This is a multi-layered encoding",
        "One of the layers is Base64",
        "Try decoding multiple times"
      ]
    },
    '4': {
      id: '4',
      title: 'Journey Through Vigenère',
      difficulty: 'hard',
      points: 250,
      description: "Step into the complex world of 'CRYPTO' GRAPHY, where your problem-solving abilities will be tested by the mysterious Vigenère cipher.\n\nAHD3CU3J4{T1P3P3C3_P5_RSW}",
      answer: 'hello',
      hints: [
        "The keyword is hidden in plain sight",
        "Look for the emphasized word in the description",
        "Vigenère cipher uses a keyword for encryption"
      ]
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        // Get question from our hardcoded questions
        const questionData = questions[id];
        if (!questionData) {
          setError('Question not found');
          setLoading(false);
          return;
        }

        // Get user's progress for this question
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();
        
        // Check if question is already solved
        if (userData.solvedQuestions.includes(id)) {
          setSuccess(true);
        }

        // Get hints used
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

  const useHint = async (hintIndex) => {
    if (hintsUsed.includes(hintIndex)) return;
    
    try {
      // Deduct points for using hint (20% of question points)
      const deduction = Math.ceil(question.points * 0.2);
      
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        points: increment(-deduction),
        [`hintsUsed.${id}`]: arrayUnion(hintIndex)
      });

      setHintsUsed([...hintsUsed, hintIndex]);
    } catch (error) {
      console.error('Error using hint:', error);
      setError('Failed to use hint');
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

      // Check if question is already solved
      if (userData.solvedQuestions.includes(id)) {
        setError('You have already solved this question!');
        setLoading(false);
        return;
      }

      // Update attempt count
      const newAttemptCount = (userData.attempts?.[id] || 0) + 1;
      await updateDoc(userRef, {
        [`attempts.${id}`]: newAttemptCount
      });
      setAttemptCount(newAttemptCount);

      if (answer.toLowerCase() === question.answer.toLowerCase()) {
        // Calculate points based on hints used
        // const hintPenalty = hintsUsed.length * (question.points * 0.2);
        const earnedPoints = Math.max(question.points , question.points * 0.2);

        await updateDoc(userRef, {
          points: increment(earnedPoints),
          solvedQuestions: arrayUnion(id),
          [`solvedAt.${id}`]: new Date().toISOString()
        });

        setSuccess(true);
        setSubmissionTime(new Date());

        // Check for achievements
        if (newAttemptCount === 1 && hintsUsed.length === 0) {
          // Perfect solve achievement
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
      <div className="qd-description">
        <pre className="qd-description-text">{question.description}</pre>
      </div>

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

        {success && (
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
  </div>
  );
}

export default QuestionDetail;