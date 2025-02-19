// src/components/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First try authentication
      const { user } = await signInAnonymously(auth);
      console.log("Authentication successful", user.uid);

      try {
        // Then try to create the user document
        await setDoc(doc(db, 'users', user.uid), {
          username: username.trim(),
          points: 0,
          solvedQuestions: [],
          createdAt: new Date().toISOString()
        });
        console.log("User document created successfully");
        
        navigate('/');
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
        setError('Failed to create user profile. Please try again.');
      }
    } catch (authError) {
      console.error("Authentication error:", authError);
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Quiz App</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Enter your username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Username"
            required
            disabled={loading}
          />
        </div>
        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Start Quiz'}
        </button>
      </form>
    </div>
  );
}

export default Login;