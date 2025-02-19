import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('points', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        let usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort users by points first, then by time taken
        usersList.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          
          // If points are equal, sort by time taken
          const aStartTime = new Date(a.startTime);
          const bStartTime = new Date(b.startTime);
          const aEndTime = new Date(a.endTime);
          const bEndTime = new Date(b.endTime);
          
          const aTimeTaken = aEndTime - aStartTime;
          const bTimeTaken = bEndTime - bStartTime;
          
          return aTimeTaken - bTimeTaken;
        });

        // Add ranks and calculate time remaining
        usersList = usersList.map((user, index) => {
          const startTime = new Date(user.startTime);
          const endTime = new Date(user.endTime);
          const now = new Date();
          
          let timeRemaining = Math.max(0, endTime - now);
          const minutes = Math.floor(timeRemaining / 60000);
          const seconds = Math.floor((timeRemaining % 60000) / 1000);
          
          return {
            ...user,
            rank: index + 1,
            timeRemaining: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            isCurrentUser: user.id === auth.currentUser?.uid
          };
        });

        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard. Please try again.');
        setLoading(false);
      }
    };

    fetchLeaderboard();
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    /* Component JSX */
<div className="leaderboard-container">
  <h2 className="leaderboard-title">Leaderboard</h2>
  <div className="leaderboard-table-container">
    <table className="leaderboard-table">
      <thead className="leaderboard-header">
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th className="align-right">Points</th>
          <th className="align-right">Time Remaining</th>
          <th className="align-right">Questions Solved</th>
        </tr>
      </thead>
      <tbody className="leaderboard-body">
        {users.map((user) => (
          <tr 
            key={user.id}
            className={`leaderboard-row ${user.isCurrentUser ? 'current-user' : ''}`}
          >
            <td className="leaderboard-cell">
              <div className="rank-cell">
                {user.rank === 1 && <span className="rank-emoji">🏆</span>}
                {user.rank === 2 && <span className="rank-emoji">🥈</span>}
                {user.rank === 3 && <span className="rank-emoji">🥉</span>}
                <span className="rank-number">{user.rank}</span>
              </div>
            </td>
            <td className="leaderboard-cell">
              <div className="username-cell">
                <span className="username-text">
                  {user.username}
                  {user.isCurrentUser && (
                    <span className="current-user-badge">You</span>
                  )}
                </span>
              </div>
            </td>
            <td className="leaderboard-cell points-cell">
              {user.points}
            </td>
            <td className="leaderboard-cell time-cell">
              {user.timeRemaining}
            </td>
            <td className="leaderboard-cell questions-cell">
              {user.solvedQuestions?.length || 0}
            </td>
          </tr>
        ))}
        {users.length === 0 && (
          <tr>
            <td colSpan="5" className="empty-message">
              No users have participated yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
  );
}

export default Leaderboard;