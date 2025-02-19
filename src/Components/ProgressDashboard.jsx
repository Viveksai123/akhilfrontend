// src/components/ProgressDashboard.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ProgressDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Colors for charts 
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const DIFFICULTY_COLORS = {
    easy: '#00C49F',
    medium: '#FFBB28',
    hard: '#FF8042'
  };

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();
        setUserData(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user progress:', error);
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  if (loading) {
    return <div>Loading progress...</div>;
  }

  // Prepare data for difficulty distribution
  const difficultyData = [
    { name: 'Easy', value: userData.solvedQuestions.filter(q => q.difficulty === 'easy').length },
    { name: 'Medium', value: userData.solvedQuestions.filter(q => q.difficulty === 'medium').length },
    { name: 'Hard', value: userData.solvedQuestions.filter(q => q.difficulty === 'hard').length }
  ];

  // Prepare data for time analysis
  const timeData = userData.solvedQuestions.map(q => ({
    name: q.title,
    time: q.timeTaken,
    difficulty: q.difficulty
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4">
      <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Questions by Difficulty */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Questions by Difficulty</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Time Analysis */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Time Spent per Question</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeData}>
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Time (minutes)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="time" name="Time Spent">
                {timeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DIFFICULTY_COLORS[entry.difficulty]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ProgressDashboard;