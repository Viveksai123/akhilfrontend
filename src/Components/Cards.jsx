import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';


function GameOver() {
  const navigate = useNavigate();

  useEffect(() => {
    // Log out the user when the component mounts
    signOut(auth)
      .then(() => console.log("User logged out"))
      .catch((error) => console.error("Logout error:", error));

    // Redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 60000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="game-over-container">
      <div className="game-over-box">
        <h1 className="game-over-title">Game Over!</h1>
        <p className="game-over-message">Your time has expired</p>
        <p className="game-over-redirect">Redirecting to login in 60 seconds...</p>
        <button className="back-to-login-btn" onClick={handleBackToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default GameOver;