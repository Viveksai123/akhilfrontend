// GameOver.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function GameOver() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false); // Track logout state
  
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Store the UID before signing out
        const uid = auth.currentUser?.uid;
        
        if (uid) {
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
      
      // Sign out the user
      try {
        await signOut(auth);
        console.log("User logged out");
        setLoggedOut(true); // Set logged out state to true
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
    
    fetchUserStats();
    
    // Redirect to login after 60 seconds
    const timer = setTimeout(() => {
      navigate('/login', { replace: true }); // Use replace to prevent history issues
    }, 60000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  const handleBackToLogin = () => {
    if (loggedOut) {
      navigate('/login', { replace: true }); // Use replace to prevent history issues
    } else {
      // If not logged out yet, try to log out first
      signOut(auth).then(() => {
        navigate('/login', { replace: true });
      }).catch(error => {
        console.error("Error signing out:", error);
        // Still try to navigate even if there's an error
        navigate('/login', { replace: true });
      });
    }
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