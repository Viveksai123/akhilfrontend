import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function ProgressDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const userData = userDoc.data();
        setUserData(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user progress:", error);
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  if (loading) {
    return <div>Loading progress...</div>;
  }

  // Prepare data for difficulty distribution
  const difficultyCounts = {
    easy: userData.solvedQuestions.filter((q) => q.difficulty === "easy").length,
    medium: userData.solvedQuestions.filter((q) => q.difficulty === "medium").length,
    hard: userData.solvedQuestions.filter((q) => q.difficulty === "hard").length,
  };

  const difficultyChartData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [difficultyCounts.easy, difficultyCounts.medium, difficultyCounts.hard],
        backgroundColor: ["#00C49F", "#FFBB28", "#FF8042"],
      },
    ],
  };

  // Prepare data for time analysis
  const timeChartData = {
    labels: userData.solvedQuestions.map((q) => q.title),
    datasets: [
      {
        label: "Time Spent (minutes)",
        data: userData.solvedQuestions.map((q) => q.timeTaken),
        backgroundColor: userData.solvedQuestions.map((q) =>
          q.difficulty === "easy" ? "#00C49F" : q.difficulty === "medium" ? "#FFBB28" : "#FF8042"
        ),
      },
    ],
  };

  return (
    <div className="progress-container">
      <h2 className="progress-title">Your Progress</h2>

      <div className="progress-grid">
        {/* Questions by Difficulty */}
        <div className="progress-card">
          <h3 className="progress-subtitle">Questions by Difficulty</h3>
          <Pie data={difficultyChartData} />
        </div>

        {/* Time Analysis */}
        <div className="progress-card">
          <h3 className="progress-subtitle">Time Spent per Question</h3>
          <Bar data={timeChartData} />
        </div>
      </div>
    </div>
  );
}

export default ProgressDashboard;
