import React, { useState } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../firebase";

function HintSystem({ questionId, hints, points }) {
  const [hintsUsed, setHintsUsed] = useState([]);
  const [clickedHints, setClickedHints] = useState({});

  const useHint = async (hintIndex) => {
    if (!auth.currentUser) return;

    // Block if already clicked
    if (clickedHints[hintIndex]) {
      return;
    }

    // Set clicked state immediately
    setClickedHints(prev => ({
      ...prev,
      [hintIndex]: true
    }));

    try {
      // Get current user data
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Check if hintsUsed exists and has this questionId
      if (userData.hintsUsed && 
          userData.hintsUsed.hasOwnProperty(questionId) && 
          userData.hintsUsed[questionId].includes(hintIndex)) {
        // Hint was already used, just update local state
        setHintsUsed(prev => [...prev, hintIndex]);
        return;
      }

      // If we reach here, hint hasn't been used yet
      const deduction = Math.ceil(points * 0.2);

      // Update using array union to prevent duplicates
      await updateDoc(userRef, {
        points: increment(-deduction),
        [`hintsUsed.${questionId}`]: userData.hintsUsed && userData.hintsUsed[questionId] 
          ? [...userData.hintsUsed[questionId], hintIndex]
          : [hintIndex]
      });

      setHintsUsed(prev => [...prev, hintIndex]);
    } catch (error) {
      console.error("Error using hint:", error);
      // Reset clicked state if there's an error
      setClickedHints(prev => ({
        ...prev,
        [hintIndex]: false
      }));
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-semibold">Hints Available</h3>
      <p className="text-sm text-gray-600">
        Using a hint will reduce question points by 20%
      </p>

      <div className="space-y-2" style={{ pointerEvents: 'auto' }}>
        {hints.map((hint, index) => {
          const isClicked = clickedHints[index];
          const isUsed = hintsUsed.includes(index);

          return (
            <div 
              key={index} 
              className="bg-gray-50 p-4 rounded-lg"
              style={{ pointerEvents: isClicked ? 'none' : 'auto' }}
            >
              <button
                onClick={() => useHint(index)}
                disabled={isClicked || isUsed}
                className={`w-full text-left ${
                  isUsed
                    ? "text-gray-700"
                    : isClicked
                    ? "text-gray-400 cursor-not-allowed opacity-50"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {isUsed ? (
                  <div>
                    <span className="font-bold">Hint {index + 1}:</span>
                    <p>{hint}</p>
                  </div>
                ) : isClicked ? (
                  <div className="flex items-center justify-between">
                    <span>Loading Hint {index + 1}...</span>
                    <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                  </div>
                ) : (
                  `Reveal Hint ${index + 1}`
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HintSystem;