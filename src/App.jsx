import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import QuestionList from './Components/Questions';
import QuestionDetail from './Components/QuestionDetail';
import GameOver from './Components/Cards';
import Leaderboard from './Components/Footer';
import AchievementSystem from './Components/AchievementSystem';
import NotFound from './Components/error'; // 404 Page
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/game-over" element={<GameOver />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <QuestionList />
                </>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/question/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <QuestionDetail />
                </>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Leaderboard />
                  <AchievementSystem />
                </>
              </ProtectedRoute>
            }
          />
          
          {/* 🚀 Catch-All Route for 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;