// Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

function Navbar() {
  const [timeRemaining, setTimeRemaining] = useState('40:00');
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }

    let pointsUnsubscribe;

    const setupTimer = async () => {
      try {
        // Get initial user data
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();
        setPoints(userData.points || 0);

        if (userData.endTime) {
          const endTime = new Date(userData.endTime);

          // Update timer every second
          timerRef.current = setInterval(() => {
            const now = new Date();
            const remaining = endTime - now;

            if (remaining <= 0) {
              if (timerRef.current) clearInterval(timerRef.current);
              handleTimeUp();
              return;
            }

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
          }, 1000);
        }

        // Real-time points updates
        pointsUnsubscribe = onSnapshot(
          doc(db, 'users', auth.currentUser.uid),
          (doc) => {
            if (doc.exists()) {
              setPoints(doc.data().points || 0);
            }
          }
        );

        setLoading(false);
      } catch (error) {
        console.error('Error setting up timer:', error);
        setLoading(false);
      }
    };

    setupTimer();

    // Cleanup
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pointsUnsubscribe) pointsUnsubscribe();
    };
  }, [navigate]);

  const handleTimeUp = async () => {
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      
      // First, sign out the user
      await auth.signOut();
      
      // Then navigate to game-over route
      // Using a small timeout to ensure the signOut completes
      setTimeout(() => {
        navigate('/game-over');
      }, 100);
    } catch (error) {
      console.error('Error handling time up:', error);
      // Attempt to navigate to game-over even if there was an error with logout
      navigate('/game-over');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="h-16 bg-white shadow-md"></div>; // Placeholder while loading
  }

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo/Home */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                CYB3R AR3N4
              </Link>
            </div>

            {/* Right side - Stats and Actions */}
            {auth.currentUser && (
              <div className="flex items-center space-x-6">
                {/* Timer */}
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium">Time:</span>
                  <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-mono">
                    {timeRemaining}
                  </span>
                </div>

                {/* Points */}
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium">Points:</span>
                  <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    {points}
                  </span>
                </div>

                {/* Leaderboard Link */}
                <Link
                  to="/leaderboard"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium 
                           rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                >
                  <svg 
                    className="w-5 h-5 mr-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                    />
                  </svg>
                  Leaderboard
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:text-red-700 font-medium 
                           rounded-lg hover:bg-red-50 transition-colors flex items-center"
                >
                  <svg 
                    className="w-5 h-5 mr-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;