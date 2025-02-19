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
    <div className="max-w-4xl mx-auto p-4 mt-20">
      <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Remaining
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Questions Solved
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr 
                key={user.id}
                className={`
                  ${user.isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  transition-colors
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.rank === 1 && <span className="text-2xl mr-2">🏆</span>}
                    {user.rank === 2 && <span className="text-2xl mr-2">🥈</span>}
                    {user.rank === 3 && <span className="text-2xl mr-2">🥉</span>}
                    <span className="text-sm font-medium text-gray-900">
                      {user.rank}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                      {user.isCurrentUser && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user.points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  {user.timeRemaining}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  {user.solvedQuestions?.length || 0}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
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