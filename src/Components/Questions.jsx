import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase'; // Adjust path as needed
import { doc, getDoc } from 'firebase/firestore';

function QuestionList() {
  const [questions] = useState([
    {
      id: '1',
      title: 'ASCII Numbers',
      difficulty: 'easy',
      points: 100,
      description: 'Convert the following string of ASCII numbers into a readable string:\n\n0x43 0x59 0x42 0x33 0x52 0x4e 0x33 0x58 0x34 0x7b 0x57 0x33 0x4c 0x43 0x30 0x4d 0x33 0x5f 0x54 0x30 0x5f 0x43 0x59 0x42 0x33 0x52 0x4e 0x33 0x58 0x34 0x7d',
      answer: 'hello'
    },
    {
      id: '2',
      title: 'Solo Leveling',
      difficulty: 'medium',
      points: 170,
      description: 'Web exploitation refers to the practice of identifying and exploiting vulnerabilities in web applications, websites, and online services.',
      answer: 'hello'
    },
    {
      id: '3',
      title: 'Find the Seal',
      difficulty: 'medium',
      points: 180,
      description: 'Extracting text from images involves using Optical Character Recognition (OCR) technology, which converts printed, handwritten, or digital text within an image into machine-readable text',
      answer: 'hello'
    },
    {
      id: '4',
      title: 'Rotten Secrets',
      difficulty: 'easy',
      points: 120,
      description: 'Are you familiar with ROT13, a simple encryption technique used in cryptography?',
      answer: 'hello'
    },
    {
      id: '5',
      title: 'Layers of Message',
      difficulty: 'easy',
      points: 130,
      description: 'Unravel the cryptographic maze by peeling away layers of transformation to reveal the hidden message. Use multiple decoding techniques to decrypt the truth beneath the encryption.',
      answer: 'hello'
    },
    {
      id: '6',
      title: 'Journey Through Vigenere',
      difficulty: 'easy',
      points: 150,
      description: 'Decode the Vigenère cipher, unravel the mystery, and reveal the hidden flag. Can you crack the code?',
      answer: 'hello'
    },
    {
      id: '7',
      title: 'MYSTERIES IN THE MARGINS - THE HIDDEN PDF QUEST',
      difficulty: 'medium',
      points: 190,
      description: 'Decode the Vigenère cipher, unravel the mystery, and reveal the hidden flag. Can you crack the code?',
      answer: 'hello'
    },

    {
      id: '8',
      title: 'Reyansh College: The Hex Cipher Odyssey',
      difficulty: 'medium',
      points: 200,
      description: 'Decode the Vigenère cipher, unravel the mystery, and reveal the hidden flag. Can you crack the code?',
      answer: 'hello'
    },
    {
      id: '9',
      title: 'Operation bhAAi: The Digital Trail',
      difficulty: 'hard',
      points: 220,
      description: 'Decode the Vigenère cipher, unravel the mystery, and reveal the hidden flag. Can you crack the code?',
      answer: 'hello'
    },
    {
      id: '10',
      title: 'Cipher Cascade',
      difficulty: 'hard',
      points: 240,
      description: 'Decode the Vigenère cipher, unravel the mystery, and reveal the hidden flag. Can you crack the code?',
      answer: 'hello'
    },
    {
      id: '11',
      title: 'Encrypted flag quest',
      difficulty: 'hard',
      points: 260,
      description: 'Decode the Vigenère cipher, unravel the mystery, and reveal the hidden flag. Can you crack the code?',
      answer: 'hello'
    },
    {
      id: '12',
      title: 'Scrambled Vision',
      difficulty: 'hard',
      points: 300,
      description: 'Decode the Vigenère cipher, unravel the mystery, and reveal the hidden flag. Can you crack the code?',
      answer: 'hello'
    }
    // Add other questions here
  ]);

  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolvedQuestions = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          const userData = userDoc.data();
          if (userData && userData.solvedQuestions) {
            setSolvedQuestions(userData.solvedQuestions);
          }
        }
      } catch (error) {
        console.error('Error fetching solved questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolvedQuestions();
  }, []);

  const isQuestionSolved = (questionId) => {
    return solvedQuestions.includes(questionId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="questions-container">
      <h2 className="section-title">Challenges</h2>
      
      <div className="difficulty-grid">
        {['Easy', 'Medium', 'Hard'].map((difficulty) => (
          <div
            key={difficulty}
            className={`difficulty-section difficulty-${difficulty.toLowerCase()}`}
          >
            <h3 className="difficulty-title">{difficulty}</h3>
            <div className="questions-list">
              {questions
                .filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase())
                .map(question => {
                  const solved = isQuestionSolved(question.id);
                  return (
                    <Link
                      key={question.id}
                      to={`/question/${question.id}`}
                      className={`question-link ${solved ? 'solved-question' : ''}`}
                    >
                      <div className="question-card">
                        {solved && (
                          <div className="solved-tag">
                            Solved
                          </div>
                        )}
                        <h4 className="question-title">{question.title}</h4>
                        <p className="question-points">Points: {question.points}</p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* CSS for the solved tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        .question-link {
          position: relative;
          text-decoration: none;
          display: block;
        }
        
        .solved-question .question-card {
          border: 2px solid #10B981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
        }
        
        .solved-tag {
          position: absolute;
          top: 0px;
          right: 0px;
          background-color: #10B981;
          color: white;
          font-size: 16px;
          font-weight: bold;
          padding: 6px 14px;
         border-bottom-left-radius: 15px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
          z-index: 1;
          letter-spacing: 1px;
          text-transform: uppercase;
          line-height: 1.2;
          white-space: nowrap;
          display: inline-block;
        }
      `}} />
    </div>
  );
}

export default QuestionList;