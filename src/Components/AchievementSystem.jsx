import React, { useState, useEffect, useCallback } from 'react';
import { doc, updateDoc, arrayUnion, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-hot-toast'; 
import styles from './AchievementSystem.module.css';

// Achievement definitions with consistent structure and improved organization
const achievements = [
  {
    id: 'first_solve',
    title: 'First Steps',
    description: 'Solve your first question',
    icon: '🎯',
    rarity: 'common',
    points: 10,
    condition: (userData) => userData.solvedQuestions?.length > 0
  },
  {
    id: 'speed_solve',
    title: 'Speed Demon',
    description: 'Solve any question in under 2 minutes',
    icon: '⚡',
    rarity: 'rare',
    points: 30,
    condition: (userData) => {
      if (!userData.solvedAt || !userData.startTime) return false;
      const solveTimesMs = Object.values(userData.solvedAt).map(time => {
        const solveTime = new Date(time).getTime();
        const startTime = new Date(userData.startTime).getTime();
        return solveTime - startTime;
      });
      return solveTimesMs.length > 0 && Math.min(...solveTimesMs) < 120000; // 2 minutes in milliseconds
    }
  },
  {
    id: 'perfect_solve',
    title: 'Perfectionist',
    description: 'Score 100% on any level',
    icon: '🏆',
    rarity: 'uncommon',
    points: 20,
    condition: (userData) => userData.points >= 100
  },
  {
    id: 'streak_solve',
    title: 'Streak Master',
    description: 'Solve 5 questions in a row without hints',
    icon: '🔥',
    rarity: 'epic',
    points: 50,
    condition: (userData) => userData.streak >= 5
  },
  {
    id: 'advanced_solver',
    title: 'Advanced Solver',
    description: 'Solve 10 questions',
    icon: '🧠',
    rarity: 'rare',
    points: 40,
    condition: (userData) => {
      const difficultQuestions = userData.solvedQuestions?.filter(q => 
        userData.questionDifficulty?.[q] === 'difficult' || 
        userData.questionDifficulty?.[q] === 'hard'
      );
      return difficultQuestions?.length >= 10;
    }
  }
];

// Custom notification component for achievement unlocks
const AchievementNotification = ({ achievement }) => (
  <div className={styles.achievementNotification}>
    <div className={styles.notificationIcon}>{achievement.icon}</div>
    <div className={styles.notificationContent}>
      <h4 className={styles.notificationTitle}>Achievement Unlocked!</h4>
      <p className={styles.notificationDesc}>{achievement.title} - {achievement.points} points</p>
    </div>
  </div>
);

function AchievementSystem() {
  const [userData, setUserData] = useState(null);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [recentlyUnlocked, setRecentlyUnlocked] = useState([]);

  // Memoize the checkAndUnlockAchievements function to prevent unnecessary re-renders
  const checkAndUnlockAchievements = useCallback(async (userData) => {
    if (!auth.currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const unlockedAchievements = new Set(userData.achievements || []);
      let newUnlocked = [];

      for (const achievement of achievements) {
        if (!unlockedAchievements.has(achievement.id) && achievement.condition(userData)) {
          unlockedAchievements.add(achievement.id);
          newUnlocked.push(achievement);
          console.log('Unlocked achievement:', achievement.id);

          await updateDoc(userDocRef, {
            achievements: arrayUnion(achievement.id),
            achievementPoints: (userData.achievementPoints || 0) + achievement.points
          });
        }
      }

      // Show toast notification for each new achievement
      if (newUnlocked.length > 0) {
        newUnlocked.forEach(achievement => {
          toast.custom(() => (
            <AchievementNotification achievement={achievement} />
          ), {
            duration: 5000,
          });
        });
        
        setRecentlyUnlocked(newUnlocked.map(a => a.id));
        setTimeout(() => {
          setRecentlyUnlocked([]);
        }, 5000);
        
        setUserAchievements(Array.from(unlockedAchievements));
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      toast.error('Failed to update achievements');
    }
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};

    const initializeAchievements = async () => {
      if (!auth.currentUser) {
        setError('No authenticated user');
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        
        // First, ensure achievements array exists
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (!data.achievements) {
            await updateDoc(userDocRef, {
              achievements: [],
              achievementPoints: 0
            });
          }

          // Then set up real-time listener for user data changes
          unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setUserData(data);
              setUserAchievements(data.achievements || []);
              
              // Check achievements when data changes
              checkAndUnlockAchievements(data);
            }
            setLoading(false);
          }, (error) => {
            console.error('Error listening to user data:', error);
            setError('Failed to load achievements');
            setLoading(false);
          });
        } else {
          setLoading(false);
          setError('User document not found');
        }
      } catch (error) {
        console.error('Error initializing achievements:', error);
        setError('Failed to initialize achievements');
        setLoading(false);
      }
    };

    initializeAchievements();

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [checkAndUnlockAchievements]);

  const calculateProgress = () => {
    if (!userAchievements) return 0;
    return Math.round((userAchievements.length / achievements.length) * 100);
  };

  const filterAchievements = () => {
    if (activeFilter === 'all') return achievements;
    if (activeFilter === 'unlocked') return achievements.filter(a => userAchievements.includes(a.id));
    if (activeFilter === 'locked') return achievements.filter(a => !userAchievements.includes(a.id));
    return achievements.filter(a => a.rarity === activeFilter);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorTitle}>Error loading achievements</p>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  const filteredAchievements = filterAchievements();
  const progress = calculateProgress();
  const totalPoints = userAchievements.reduce((sum, id) => {
    const achievement = achievements.find(a => a.id === id);
    return sum + (achievement?.points || 0);
  }, 0);

  return (
    <div className={styles.achievementsContainer} style={{ padding: '2.5rem' }}>
      <div className={styles.header}>
        <h2 className={styles.title}>Achievements</h2>
        
        <div className={styles.statsCard}>
          <div className={styles.statItem}>
            <p className={styles.statLabel}>Unlocked</p>
            <p className={styles.statValue}>{userAchievements.length}/{achievements.length}</p>
          </div>
          
          <div className={styles.statItem}>
            <p className={styles.statLabel}>Points</p>
            <p className={styles.statValue}>{totalPoints}</p>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className={styles.progressText}>{progress}% Complete</p>
      </div>
      
      {/* Filters */}
      <div className={styles.filterContainer}>
        {['all', 'unlocked', 'locked', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`${styles.filterButton} ${
              activeFilter === filter
                ? styles.filterButtonActive
                : styles.filterButtonInactive
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      
      {/* Achievement cards */}
      <div className={styles.achievementsGrid}>
        {filteredAchievements.map((achievement) => {
          const isUnlocked = userAchievements.includes(achievement.id);
          const isNewlyUnlocked = recentlyUnlocked.includes(achievement.id);
          const rarityClass = `rarity${achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}`;
          const pointsClass = `points${achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}`;
          
          return (
            <div
              key={achievement.id}
              className={`${styles.achievementCard} ${isUnlocked ? styles[rarityClass] : styles.achievementCardLocked} ${isNewlyUnlocked ? styles.newlyUnlocked : ''}`}
            >
              {isNewlyUnlocked && <span className={styles.newBadge}>New!</span>}
              
              <div className={styles.achievementCardInner}>
                <div className={`${styles.achievementIconContainer} ${isUnlocked ? styles[rarityClass] : ''}`}>
                  {achievement.icon}
                </div>
                
                <div className={styles.achievementTextContainer}>
                  <div className={styles.achievementHeader}>
                    <h3 className={styles.achievementTitle}>{achievement.title}</h3>
                    <span className={`${styles.achievementPoints} ${isUnlocked ? styles[pointsClass] : ''}`}>
                      {achievement.points} pts
                    </span>
                  </div>
                  
                  <p className={styles.achievementDescription}>{achievement.description}</p>
                  
                  <div className={styles.achievementFooter}>
                    <span className={styles.achievementRarity}>
                      {achievement.rarity}
                    </span>
                    <p className={`${styles.achievementStatus} ${isUnlocked ? styles.statusUnlocked : styles.statusLocked}`}>
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredAchievements.length === 0 && (
        <div className={styles.emptyState}>
          <p>No achievements found matching the selected filter.</p>
        </div>
      )}
    </div>
  );
}

// Export for use in Leaderboard and other components
export { achievements };
export default AchievementSystem;