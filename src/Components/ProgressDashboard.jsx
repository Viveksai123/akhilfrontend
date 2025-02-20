import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function ProgressDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        if (!auth.currentUser) {
          console.log("No authenticated user.");
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

        if (!userDoc.exists()) {
          console.log("No data found in Firestore.");
          setLoading(false);
          return;
        }

        const data = userDoc.data();
        console.log("Fetched User Data:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  if (loading) return <div>Loading progress...</div>;

  if (!userData || !userData.solvedQuestions || userData.solvedQuestions.length === 0) {
    return <div>No progress data available.</div>;
  }

  // Count solved questions by difficulty
  const difficultyCounts = {
    easy: userData.solvedQuestions.filter((q) => q.difficulty === "easy").length,
    medium: userData.solvedQuestions.filter((q) => q.difficulty === "medium").length,
    hard: userData.solvedQuestions.filter((q) => q.difficulty === "hard").length,
  };

  return (
    <div className="progress-container">
      <h2 className="progress-title">Your Progress</h2>

      <div className="progress-card">
        <h3>Questions by Difficulty</h3>
        <div className="progress-bar-container">
          <label>Easy: {difficultyCounts.easy}</label>
          <div className="progress-bar easy" style={{ width: `${difficultyCounts.easy * 10}%` }}></div>
        </div>
        <div className="progress-bar-container">
          <label>Medium: {difficultyCounts.medium}</label>
          <div className="progress-bar medium" style={{ width: `${difficultyCounts.medium * 10}%` }}></div>
        </div>
        <div className="progress-bar-container">
          <label>Hard: {difficultyCounts.hard}</label>
          <div className="progress-bar hard" style={{ width: `${difficultyCounts.hard * 10}%` }}></div>
        </div>
      </div>

      <div className="progress-card">
        <h3>Time Spent per Question</h3>
        <table className="progress-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Time (minutes)</th>
            </tr>
          </thead>
          <tbody>
            {userData.solvedQuestions.map((q, index) => (
              <tr key={index}>
                <td>{q.title}</td>
                <td>{q.timeTaken} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProgressDashboard;
