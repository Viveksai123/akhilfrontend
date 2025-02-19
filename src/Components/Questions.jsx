import { useState } from 'react';
import { Link } from 'react-router-dom';

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
      title: 'Rotten Secrets',
      difficulty: 'medium',
      points: 150,
      description: 'Are you familiar with ROT13, a simple encryption technique used in cryptography?\n\nPLO3EA3K4{gu3_e0gg3a_frpe3gf}',
      answer: 'hello'
    },{
      id: '3',
      title: 'Layers of Message',
      difficulty: 'hard',
      points: 200,
      description: 'Within a cryptographic maze, a hidden message lies in wait. Your task is to decipher the layers of transformation that mask the truth beneath.\n\nVm0xNFlWVXhTWGxVV0doVFYwZFNUMVV3Wkc5V1ZteFpZMGhPVlUxV1NsaFhhMlIzWVRBeFdWRnNXbFpOVmtwSVdWUktTMVl4VG5KaFJsWk9WbXR3UlZkV1dsWmxSMDVZVTJ0b1RsWnRhRmhhVjNSaFUxWmtWMVZyWkdsaVZscFhWREZhYjFSc1duUmxSVGxhVmtWYU0xcEZXbXRXVmtaMFQxWlNUbUpGY0RaWFYzUnZWVEpLUjFOWWNHaFRSVXBZVkZWYVMxSkdXa1pTVkd4UlZWUXdPUT09',
      answer: 'hello'
    },
    {
      id: '4',
      title: 'Journey Through Vigenère',
      difficulty: 'hard',
      points: 250,
      description: "Step into the complex world of 'CRYPTO' GRAPHY, where your problem-solving abilities will be tested by the mysterious Vigenère cipher.\n\nAHD3CU3J4{T1P3P3C3_P5_RSW}",
      answer: 'hello'
    },
    // Add other questions here
  ]);

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
              .map(question => (
                <Link
                  key={question.id}
                  to={`/question/${question.id}`}
                  className="question-link"
                >
                  <div className="question-card">
                    <h4 className="question-title">{question.title}</h4>
                    <p className="question-points">Points: {question.points}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default QuestionList;