import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <h1 className="error-code">404</h1>
      <p className="error-message">Lost in the void... This page doesn’t exist.</p>

      <button onClick={() => navigate(-1)} className="go-back-button">
        Go Back
      </button>
    </div>
  );
};

export default NotFound;