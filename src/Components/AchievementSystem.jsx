import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Achievement definitions with corrected IDs
const achievements = [
  {
    id: 'first_solve',
    title: 'First Steps',
    description: 'Solve your first question',
    icon: '🎯',
    condition: (userData) => userData.solvedQuestions?.length > 0
  },
  {
    id: 'speed_solve',
    title: 'Speed Demon',
    description: 'Solve any question in under 2 minutes',
    icon: '⚡',
    condition: (userData) => {
      if (!userData.solvedAt) return false;
      const solveTimesMs = Object.values(userData.solvedAt).map(time => {
        const solveTime = new Date(time).getTime();
        const startTime = new Date(userData.startTime).getTime();
        return solveTime - startTime;
      });
      return Math.min(...solveTimesMs) < 120000; // 2 minutes in milliseconds
    }
  },
  {
    id: 'perfect_solve',
    title: 'Perfectionist',
    description: 'Score 100% on any difficulty level',
    icon: '🏆',
    condition: (userData) => userData.points >= 100
  },
  {
    id: 'streak_solve',
    title: 'Streak Master',
    description: 'Solve 5 questions in a row without hints',
    icon: '🔥',
    condition: (userData) => userData.streak >= 5
  }
];

function AchievementSystem() {
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        setError('No authenticated user');
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data:', userData);

          // Make sure achievements array exists
          if (!userData.achievements) {
            await updateDoc(userDocRef, {
              achievements: []
            });
            setUserAchievements([]);
          } else {
            setUserAchievements(userData.achievements);
          }

          // Check for new achievements
          await checkAndUnlockAchievements(userData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load achievements');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const checkAndUnlockAchievements = async (userData) => {
    if (!auth.currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const unlockedAchievements = new Set(userData.achievements || []);
      let hasNewAchievement = false;

      for (const achievement of achievements) {
        if (!unlockedAchievements.has(achievement.id) && achievement.condition(userData)) {
          unlockedAchievements.add(achievement.id);
          hasNewAchievement = true;
          console.log('Unlocked achievement:', achievement.id);

          await updateDoc(userDocRef, {
            achievements: arrayUnion(achievement.id)
          });

          setNewAchievement(achievement);
          setShowNotification(true);
        }
      }

      if (hasNewAchievement) {
        setUserAchievements(Array.from(unlockedAchievements));
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading achievements...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="achievements-container p-4">
      <h2 className="text-2xl font-bold mb-6">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card rounded-lg p-4 border ${
              userAchievements.includes(achievement.id)
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{achievement.icon}</span>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {userAchievements.includes(achievement.id) ? 'Unlocked' : 'Locked'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
}

// Export for use in Leaderboard
export { achievements };
export default AchievementSystem;