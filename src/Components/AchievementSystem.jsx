// src/components/AchievementSystem.js
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, getDoc, increment } from 'firebase/firestore';
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
      if (!auth.currentUser) return; // Ensure user is authenticated
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserAchievements(userData.achievements || []);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const unlockAchievement = async (achievementId) => {
    if (!auth.currentUser || userAchievements.includes(achievementId)) return;

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const achievement = achievements.find(a => a.id === achievementId);
      if (!achievement) return;

      await updateDoc(userDocRef, {
        achievements: arrayUnion(achievementId),
        points: increment(achievement.points)
      });

      setUserAchievements(prev => [...prev, achievementId]);
      setNewAchievement(achievement);
      setShowNotification(true);

      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  return (
    <div className="achievements-container">
      <h2 className="achievements-title">Achievements</h2>

      {/* Achievement Grid */}
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card ${userAchievements.includes(achievement.id) ? 'achievement-earned' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <span className="achievement-icon">{achievement.icon}</span>
              <div>
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-description">{achievement.description}</p>
                <p className="achievement-points">+{achievement.points} points</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Notification */}
      {showNotification && newAchievement && (
        <div className="achievement-notification">
          <span className="achievement-icon">{newAchievement.icon}</span>
          <div>
            <h4>Achievement Unlocked!</h4>
            <p>{newAchievement.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AchievementSystem;
