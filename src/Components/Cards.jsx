// GameOver.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// Format time function for displaying average time
const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

function GameOver() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Immediately attempt to log user out when component mounts
  useEffect(() => {
    // Immediately execute logout
    const immediateLogout = async () => {
      try {
        // If user exists, log them out
        if (auth.currentUser) {
          await signOut(auth);
          console.log("User immediately logged out on GameOver page load");
        } else {
          console.log("No user to log out on immediate check");
        }
      } catch (error) {
        console.error("Error during immediate logout:", error);
      }
    };
    
    // Call the function right away
    immediateLogout();
  }, []);
  
  // Then proceed with the rest of initialization
  useEffect(() => {
    // First, ensure we try to get user data if there's a logged-in user
    const fetchUserStats = async () => {
      try {
        // Get current user ID if available
        const uid = auth.currentUser?.uid;
        
        if (uid) {
          // Get user data before logging out
          const userDocRef = doc(db, 'users', uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } else {
          console.log("User already signed out or not authenticated");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setLoading(false);
      }
    };
    
    // Next, ensure user is definitely logged out, regardless of
    // whether they were already logged out by the Navbar component
    const ensureUserLogout = async () => {
      try {
        // Check if there's a user to log out
        if (auth.currentUser) {
          await signOut(auth);
          console.log("User logged out successfully from GameOver component");
        } else {
          console.log("No user to log out - already logged out");
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    
    // Run both operations in sequence
    const initialize = async () => {
      await fetchUserStats();
      await ensureUserLogout();
    };
    
    initialize();
    
    // Redirect to login after 60 seconds
    const timer = setTimeout(() => {
      navigate('/login', { replace: true }); // Use replace to prevent history issues
    }, 60000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  const handleBackToLogin = async () => {
    // Perform a final logout check before navigating
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error during final logout check:", error);
    }
    
    // Then navigate to login
    navigate('/login?from=gameover', { replace: true });
  };
  
  return (
    <div className="game-over-container">
      <div className="game-over-box">
        <h1 className="game-over-title">Game Over!</h1>
        <p className="game-over-message">Your time has expired</p>
        
        {loading ? (
          <p className="game-over-loading">Loading your results...</p>
        ) : (
          <div className="game-over-stats">
            <p><strong>Points:</strong> {userData?.points || 0}</p>
            <p><strong>Questions Solved:</strong> {userData?.solvedQuestions?.length || 0}</p>
            {userData?.streak && <p><strong>Best Streak:</strong> {userData.streak}</p>}
            {userData?.averageTime && <p><strong>Average Time per Question:</strong> {formatTime(userData.averageTime)}</p>}
          </div>
        )}
        
        <p className="game-over-redirect">Redirecting to login in 60 seconds...</p>
        <button className="back-to-login-btn" onClick={handleBackToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default GameOver;