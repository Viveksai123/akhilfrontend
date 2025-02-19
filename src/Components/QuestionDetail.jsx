import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, increment, arrayUnion, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Hardcoded questions data (you can later move this to Firebase)
  const questions = {
    '1': {
      id: '1',
      title: 'ASCII Numbers',
      difficulty: 'easy',
      points: 100,
      description: 'Convert the following string of ASCII numbers into a readable string:\n\n0x43 0x59 0x42 0x33 0x52 0x4e 0x33 0x58 0x34 0x7b 0x57 0x33 0x4c 0x43 0x30 0x4d 0x33 0x5f 0x54 0x30 0x5f 0x43 0x59 0x42 0x33 0x52 0x4e 0x33 0x58 0x34 0x7d',
      answer: 'hello'
    },
    '2': {
      id: '2',
      title: 'Rotten Secrets',
      difficulty: 'medium',
      points: 150,
      description: 'Are you familiar with ROT13, a simple encryption technique used in cryptography?\n\nPLO3EA3K4{gu3_e0gg3a_frpe3gf}',
      answer: 'hello'
    },
    '3': {
      id: '3',
      title: 'Layers of Message',
      difficulty: 'hard',
      points: 200,
      description: 'Within a cryptographic maze, a hidden message lies in wait. Your task is to decipher the layers of transformation that mask the truth beneath.\n\nVm0xNFlWVXhTWGxVV0doVFYwZFNUMVV3Wkc5V1ZteFpZMGhPVlUxV1NsaFhhMlIzWVRBeFdWRnNXbFpOVmtwSVdWUktTMVl4VG5KaFJsWk9WbXR3UlZkV1dsWmxSMDVZVTJ0b1RsWnRhRmhhVjNSaFUxWmtWMVZyWkdsaVZscFhWREZhYjFSc1duUmxSVGxhVmtWYU0xcEZXbXRXVmtaMFQxWlNUbUpGY0RaWFYzUnZWVEpLUjFOWWNHaFRSVXBZVkZWYVMxSkdXa1pTVkd4UlZWUXdPUT09',
      answer: 'hello'
    },
    '4': {
      id: '4',
      title: 'Journey Through Vigenère',
      difficulty: 'hard',
      points: 250,
      description: "Step into the complex world of 'CRYPTO' GRAPHY, where your problem-solving abilities will be tested by the mysterious Vigenère cipher.\n\nAHD3CU3J4{T1P3P3C3_P5_RSW}",
      answer: 'hello'
    }
  };

  useEffect(() => {
    // Get question data
    const question = questions[id];
    if (question) {
      setQuestion(question);
    }
  }, [id]);

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
      if (answer.toLowerCase() === question.answer.toLowerCase()) {
        // Update user's points in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        
        // Get current user data
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        
        // Check if question already solved
        if (!userData.solvedQuestions.includes(question.id)) {
          await updateDoc(userRef, {
            points: increment(question.points),
            solvedQuestions: arrayUnion(question.id)
          });
          setSuccess(true);
        } else {
          setError('You have already solved this question!');
        }
      } else {
        setError('Incorrect answer. Try again!');
      }
    } catch (error) {
      console.error('Error updating points:', error);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!question) {
    return (
      <div className="flex justify-center items-center h-screen">
        Question not found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">{question.title}</h2>
        <div className="mb-4 flex justify-between items-center">
          <span className="text-gray-600">Difficulty: {question.difficulty}</span>
          <span className="text-gray-600">Points: {question.points}</span>
        </div>
        <div className="mb-6">
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
            {question.description}
          </pre>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Your Answer
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your answer"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-green-500 text-sm">
              Correct! Points have been added to your score.
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Answer'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuestionDetail;