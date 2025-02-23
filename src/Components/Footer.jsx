import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { achievements } from './AchievementSystem';

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
          
          // Map achievements to their icons
          const achievementIcons = (data.achievements || []).map(id => {
            const achievement = achievements.find(a => a.id === id);
            return achievement ? achievement.icon : null;
          }).filter(Boolean);

          // Calculate time taken
          const startTime = new Date(data.startTime || Date.now());
          const lastSolveTime = data.solvedAt ? 
            Math.max(...Object.values(data.solvedAt).map(time => new Date(time).getTime())) :
            startTime.getTime();
          
          const timeTaken = lastSolveTime - startTime.getTime();
          const minutes = Math.floor(timeTaken / 60000);
          const seconds = Math.floor((timeTaken % 60000) / 1000);

          return {
            id: doc.id,
            ...data,
            achievementIcons,
            timeTaken: `${minutes}:${seconds.toString().padStart(2, '0')}`
          };
        });

        // Sort users by points first
        usersList.sort((a, b) => b.points - a.points);

        // Add ranks
        usersList = usersList.map((user, index) => ({
          ...user,
          rank: index + 1,
          isCurrentUser: user.id === auth.currentUser?.uid
        }));

        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard');
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <div className="leaderboard-table-container">
        <table className="leaderboard-table" style={{ color: "black" }}>
          <thead className="leaderboard-header">
            <tr>
              <th style={{ color: "black" }}>Rank</th>
              <th style={{ color: "black" }}>Username</th>
              <th className="align-right" style={{ color: "black" }}>Points</th>
              <th className="align-right" style={{ color: "black" }}>Time Taken</th>
              <th className="align-right" style={{ color: "black" }}>Questions</th>
              <th className="align-right" style={{ color: "black" }}>Achievements</th>
            </tr>
          </thead>
          <tbody className="leaderboard-body">
            {users.map((user) => (
              <tr 
                key={user.id} 
                className={`leaderboard-row ${user.isCurrentUser ? 'current-user' : ''}`}
                style={{ color: "black" }}
              >
                <td className="leaderboard-cell">
                  <div className="rank-cell" style={{ color: "black" }}>
                    {user.rank === 1 && <span className="rank-emoji">🏆</span>}
                    {user.rank === 2 && <span className="rank-emoji">🥈</span>}
                    {user.rank === 3 && <span className="rank-emoji">🥉</span>}
                    <span className="rank-number">{user.rank}</span>
                  </div>
                </td>
                <td className="leaderboard-cell">
                  <div className="username-cell" style={{ color: "black" }}>
                    <span className="username-text">
                      {user.username}
                      {user.isCurrentUser && (
                        <span className="current-user-badge">You</span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="leaderboard-cell points-cell" style={{ color: "black" }}>
                  {user.points || 0}
                </td>
                <td className="leaderboard-cell time-cell" style={{ color: "black" }}>
                  {user.timeTaken}
                </td>
                <td className="leaderboard-cell questions-cell" style={{ color: "black" }}>
                  {user.solvedQuestions?.length || 0}
                </td>
                <td className="leaderboard-cell achievements-cell" style={{ color: "black" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "20px" }}>
                    {user.achievementIcons && user.achievementIcons.length > 0 ? (
                      user.achievementIcons.map((icon, index) => (
                        <span key={index}>{icon}</span>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-message" style={{ color: "black" }}>
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