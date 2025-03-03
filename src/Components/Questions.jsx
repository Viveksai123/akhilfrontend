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
      points: 150,
      description: 'Web exploitation refers to the practice of identifying and exploiting vulnerabilities in web applications, websites, and online services.',
      answer: 'hello'
    },
    {
      id: '3',
      title: 'Find the Seal',
      difficulty: 'medium',
      points: 200,
      description: 'Extracting text from images involves using Optical Character Recognition (OCR) technology, which converts printed, handwritten, or digital text within an image into machine-readable text',
      answer: 'hello'
    },
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