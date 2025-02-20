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
        let usersList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('User data:', {
            id: doc.id,
            startTime: data.startTime,
            solvedAt: data.solvedAt,
            points: data.points
          });
          return {
            id: doc.id,
            ...data
          };
        });

        // Sort users by points first, then by time taken
        usersList.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          
          // Get the last solved question time for each user
          const aStartTime = new Date(a.startTime);
          const bStartTime = new Date(b.startTime);
          
          // Get the most recent solve time from solvedAt timestamps
          const aLastSolveTime = a.solvedAt ? 
            Math.max(...Object.values(a.solvedAt).map(time => new Date(time).getTime())) :
            new Date(a.startTime).getTime();
          
          const bLastSolveTime = b.solvedAt ? 
            Math.max(...Object.values(b.solvedAt).map(time => new Date(time).getTime())) :
            new Date(b.startTime).getTime();
          
          // Calculate total time taken
          const aTimeTaken = aLastSolveTime - aStartTime.getTime();
          const bTimeTaken = bLastSolveTime - bStartTime.getTime();
          
          console.log('Time comparison:', {
            userA: {
              username: a.username,
              startTime: aStartTime.toISOString(),
              lastSolveTime: new Date(aLastSolveTime).toISOString(),
              timeTaken: aTimeTaken
            },
            userB: {
              username: b.username,
              startTime: bStartTime.toISOString(),
              lastSolveTime: new Date(bLastSolveTime).toISOString(),
              timeTaken: bTimeTaken
            }
          });
          
          return aTimeTaken - bTimeTaken;
        });

        // Add ranks and calculate time taken
        usersList = usersList.map((user, index) => {
          const startTime = new Date(user.startTime);
          
          // Get the last solve time
          const lastSolveTime = user.solvedAt ? 
            Math.max(...Object.values(user.solvedAt).map(time => new Date(time).getTime())) :
            startTime.getTime();
          
          const timeTaken = lastSolveTime - startTime.getTime();
          
          // Convert milliseconds to minutes and seconds
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
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead className="leaderboard-header">
            <tr>
              <th>Rank</th>
              <th>Username</th>
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