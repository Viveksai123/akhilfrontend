// src/components/GameOver.js
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
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="game-over-container">
  <div className="game-over-box">
    <h1 className="game-over-title">Game Over!</h1>
    <p className="game-over-message">Your time has expired</p>
    <p className="game-over-redirect">Redirecting to login in 5 seconds...</p>
  </div>
</div>

  );
}

export default GameOver;
