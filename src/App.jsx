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


  useEffect(() => {
    // Disable right-click
    const disableRightClick = (event) => event.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    // Disable Function Keys, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, etc.
    const disableShortcuts = (event) => {
      if (
        event.key.startsWith("F") || // Disables all Function keys (F1–F12)
        (event.ctrlKey && event.shiftKey && event.key === "I") || // Ctrl+Shift+I
        (event.ctrlKey && event.shiftKey && event.key === "J") || // Ctrl+Shift+J
        (event.ctrlKey && event.key === "U") || // Ctrl+U (View Source)
        (event.ctrlKey && event.key === "S") || // Ctrl+S (Save Page)
        (event.ctrlKey && event.key === "H") || // Ctrl+H (History)
        (event.ctrlKey && event.key === "A") // Ctrl+A (Select All)
      ) {
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", disableShortcuts);

    // Anti-DevTools trick (Triggers `debugger` to slow down inspections)
    const antiDebug = setInterval(() => {
      debugger;
    }, 100);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableShortcuts);
      clearInterval(antiDebug);
    };
  }, []);
  
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