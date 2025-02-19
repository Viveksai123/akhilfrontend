import React, { useState } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../firebase";

function HintSystem({ questionId, hints, points }) {
  const [hintsUsed, setHintsUsed] = useState([]);
  const [loading, setLoading] = useState(false);

  const useHint = async (hintIndex) => {
    if (!auth.currentUser) {
      console.error("User not logged in.");
      return;
    }

    if (hintsUsed.includes(hintIndex)) return;

    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const deduction = Math.ceil(points * 0.2);

      await updateDoc(userRef, {
        points: increment(-deduction),
        [`hintsUsed.${questionId}`]: increment(1),
      });

      setHintsUsed((prevHints) => [...prevHints, hintIndex]);
    } catch (error) {
      console.error("Error using hint:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-semibold">Hints Available</h3>
      <p className="text-sm text-gray-600">
        Using a hint will reduce question points by 20%
      </p>

      <div className="space-y-2">
        {hints.map((hint, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <button
              onClick={() => useHint(index)}
              disabled={loading || hintsUsed.includes(index)}
              className={`w-full text-left ${
                hintsUsed.includes(index)
                  ? "text-gray-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {hintsUsed.includes(index) ? (
                <div>
                  <span className="font-bold">Hint {index + 1}:</span>
                  <p>{hint}</p>
                </div>
              ) : (
                `Reveal Hint ${index + 1}`
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HintSystem;
