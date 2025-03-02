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
      title: 'Solo Leveling',
      difficulty: 'medium',
      points: 150,
      description: 'Web exploitation refers to the practice of identifying and exploiting vulnerabilities in web applications, websites, and online services.',
      answer: 'hello'
    },{
      id: '3',
      title: 'Find the Seal',
      difficulty: 'medium',
      points: 200,
      description: 'Extracting text from images involves using Optical Character Recognition (OCR) technology, which converts printed, handwritten, or digital text within an image into machine-readable text',
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