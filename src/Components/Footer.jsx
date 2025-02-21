import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Achievement icon mapping
const achievementIcons = {
  first_solve: '🎯',
  speed_solver: '⚡',
  perfect_score: '🏆',
  streak_master: '🔥'
};

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
        let usersList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            achievements: data.achievements || [],
            ...data
          };
        });

        // Sort users by points first, then by time taken
        usersList.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          
          const aStartTime = new Date(a.startTime);
          const bStartTime = new Date(b.startTime);
          
          const aLastSolveTime = a.solvedAt ? 
            Math.max(...Object.values(a.solvedAt).map(time => new Date(time).getTime())) :
            new Date(a.startTime).getTime();
          
          const bLastSolveTime = b.solvedAt ? 
            Math.max(...Object.values(b.solvedAt).map(time => new Date(time).getTime())) :
            new Date(b.startTime).getTime();
          
          const aTimeTaken = aLastSolveTime - aStartTime.getTime();
          const bTimeTaken = bLastSolveTime - bStartTime.getTime();
          
          return aTimeTaken - bTimeTaken;
        });

        // Add ranks and calculate time taken
        usersList = usersList.map((user, index) => {
          const startTime = new Date(user.startTime);
          
          const lastSolveTime = user.solvedAt ? 
            Math.max(...Object.values(user.solvedAt).map(time => new Date(time).getTime())) :
            startTime.getTime();
          
          const timeTaken = lastSolveTime - startTime.getTime();
          const minutes = Math.floor(timeTaken / 60000);
          const seconds = Math.floor((timeTaken % 60000) / 1000);
          
          return {
            ...user,
            rank: index + 1,
            timeTaken: `${minutes}:${seconds.toString().padStart(2, '0')}`,
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
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead className="leaderboard-header">
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Achievements</th>
              <th className="align-right">Points</th>
              <th className="align-right">Time Taken</th>
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
                <td className="leaderboard-cell achievements-cell">
                  <div className="flex gap-1">
                    {user.achievements?.map(achievementId => (
                      <span 
                        key={achievementId} 
                        className="achievement-icon text-xl" 
                        title={achievementId.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      >
                        {achievementIcons[achievementId]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="leaderboard-cell points-cell">
                  {user.points}
                </td>
                <td className="leaderboard-cell time-cell">
                  {user.timeTaken}
                </td>
                <td className="leaderboard-cell questions-cell">
                  {user.solvedQuestions?.length || 0}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-message">
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