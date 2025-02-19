// src/components/GameOver.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function GameOver() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000); // Redirect to login after 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Game Over!</h1>
        <p className="text-xl text-gray-700 mb-6">Your time has expired</p>
        <p className="text-gray-500">Redirecting to login in 5 seconds...</p>
      </div>
    </div>
  );
}

export default GameOver;