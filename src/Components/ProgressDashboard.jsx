import React, { useState, useEffect } from 'react';

const NormalizedAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // The normalization function from the code
  function normalizeInput(input) {
    return input
      .trim()                    
      .toLowerCase()             
      .replace(/\s+/g, ' ')      
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') 
      .replace(/\s+$/g, '');     
  }

  useEffect(() => {
    const calculateHashes = async () => {
      const originalAnswers = [
        { id: 1, answer: "CYB3RN3X4{W3LC0M3_T0_CYB3RN3X4}", description: "ASCII Numbers" },
        { id: 2, answer: "CYB3RN3X4{th3_r0tt3n_secr3ts}", description: "Rotten Secrets (ROT13)" },
        { id: 3, answer: "CYB3RN3X4{not_too_bad_of_a_problem}", description: "Layers of Message (Base64)" },
        { id: 4, answer: "CYB3RN3X4{v1g3n3r3_i5_fun}", description: "Journey Through Vigenère" }
      ];
      
      const processedAnswers = await Promise.all(originalAnswers.map(async ({ id, answer, description }) => {
        const normalized = normalizeInput(answer);
        
        // Hash the normalized answer
        const msgBuffer = new TextEncoder().encode(normalized);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return { 
          id, 
          description, 
          original: answer, 
          normalized, 
          hash 
        };
      }));
      
      setAnswers(processedAnswers);
      setLoading(false);
    };
    
    calculateHashes();
  }, []);
  
  if (loading) {
    return <div className="p-6 text-center">Calculating hashes...</div>;
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">CTF Challenge Answers with Normalization</h1>
      <p className="mb-6 text-gray-700 text-center">
        This shows how answers are normalized and hashed according to the application's validation logic
      </p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4 text-left">Question</th>
              <th className="py-3 px-4 text-left">Original Answer</th>
              <th className="py-3 px-4 text-left">Normalized Answer</th>
              <th className="py-3 px-4 text-left">Hash (SHA-256)</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-3 px-4">
                  <div className="font-semibold">Q{item.id}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </td>
                <td className="py-3 px-4 font-mono text-sm break-all">
                  {item.original}
                </td>
                <td className="py-3 px-4 font-mono text-sm break-all">
                  {item.normalized}
                </td>
                <td className="py-3 px-4 font-mono text-sm break-all">
                  {item.hash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NormalizedAnswers;