// src/components/AchievementSystem.js
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const achievements = [
  {
    id: 'first_solve',
    title: 'First Steps',
    description: 'Solve your first question',
    icon: '🎯',
    points: 50
  },
  {
    id: 'speed_solver',
    title: 'Speed Demon',
    description: 'Solve any question in under 2 minutes',
    icon: '⚡',
    points: 100
  },
  {
    id: 'perfect_score',
    title: 'Perfectionist',
    description: 'Score 100% on any difficulty level',
    icon: '🏆',
    points: 200
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Solve 5 questions in a row without using hints',
    icon: '🔥',
    points: 150
  }
];

function AchievementSystem() {
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();
        setUserAchievements(userData.achievements || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const unlockAchievement = async (achievementId) => {
    if (userAchievements.includes(achievementId)) return;

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        achievements: arrayUnion(achievementId),
        points: increment(achievements.find(a => a.id === achievementId).points)
      });

      setNewAchievement(achievements.find(a => a.id === achievementId));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4">
      <h2 className="text-2xl font-bold mb-6">Achievements</h2>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 ${
              userAchievements.includes(achievement.id)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-sm text-blue-600">+{achievement.points} points</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Notification */}
      {showNotification && newAchievement && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{newAchievement.icon}</span>
            <div>
              <h4 className="font-bold">Achievement Unlocked!</h4>
              <p>{newAchievement.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AchievementSystem;