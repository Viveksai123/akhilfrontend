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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Easy', 'Medium', 'Hard'].map((difficulty) => (
          <div key={difficulty} className="space-y-4">
            <h3 className="text-xl font-semibold">{difficulty}</h3>
            {questions
              .filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase())
              .map(question => (
                <Link
                  key={question.id}
                  to={`/question/${question.id}`}
                  className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium">{question.title}</h4>
                  <p className="text-sm text-gray-600">Points: {question.points}</p>
                </Link>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionList;