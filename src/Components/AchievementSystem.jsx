import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Simplified achievements without points
const achievements = [
  {
    id: 'first_solve',
    title: 'First Steps',
    description: 'Solve your first question',
    icon: '🎯'
  },
  {
    id: 'speed_solver',
    title: 'Speed Demon',
    description: 'Solve any question in under 2 minutes',
    icon: '⚡'
  },
  {
    id: 'perfect_score',
    title: 'Perfectionist',
    description: 'Score 100% on any difficulty level',
    icon: '🏆'
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Solve 5 questions in a row without using hints',
    icon: '🔥'
  }
];

function AchievementSystem() {
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
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
          setUserAchievements(userData.achievements || []);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
        setError('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const unlockAchievement = async (achievementId) => {
    if (!auth.currentUser) {
      console.error('No authenticated user');
      return;
    }

    // Check if achievement is already unlocked
    if (userAchievements.includes(achievementId)) {
      console.log('Achievement already unlocked');
      return;
    }

    const userDocRef = doc(db, 'users', auth.currentUser.uid);

    try {
      // Get current user data
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      const userData = userDoc.data();
      const achievement = achievements.find(a => a.id === achievementId);
      
      if (!achievement) {
        throw new Error('Achievement not found');
      }

      // Check if achievement is already in the database
      if (userData.achievements?.includes(achievementId)) {
        console.log('Achievement already in database');
        return;
      }

      // Update user document with new achievement only
      await updateDoc(userDocRef, {
        achievements: arrayUnion(achievementId),
        lastAchievementUnlocked: new Date().toISOString()
      });

      // Update local state
      setUserAchievements(prev => [...prev, achievementId]);
      setNewAchievement(achievement);
      setShowNotification(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
        setNewAchievement(null);
      }, 3000);

    } catch (error) {
      console.error('Error unlocking achievement:', error);
      setError('Failed to unlock achievement');
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

      {/* Achievement Grid */}
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Notification */}
      {showNotification && newAchievement && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 rounded-lg p-4 shadow-lg achievement-notification">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{newAchievement.icon}</span>
            <div>
              <h4 className="font-bold">Achievement Unlocked!</h4>
              <p className="text-sm">{newAchievement.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AchievementSystem;