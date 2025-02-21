import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCEgGKPJ4v92d3Qhz3BNANC_ni-Dvm2B8g",
    authDomain: "prog-87062.firebaseapp.com",
    databaseURL: "https://prog-87062-default-rtdb.firebaseio.com",
    projectId: "prog-87062",
    storageBucket: "prog-87062.firebasestorage.app",
    messagingSenderId: "1092380967587",
    appId: "1:1092380967587:web:8bf552f2ae2e7ce0223516",
    measurementId: "G-TV4YHV9E7Y"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// const firebaseConfig = {
//   apiKey: "AIzaSyA9AC1hIfHGDQtKcLbpfWHg8D7Tb9ks8gg",
//   authDomain: "vivek-51b27.firebaseapp.com",
//   databaseURL: "https://vivek-51b27-default-rtdb.firebaseio.com",
//   projectId: "vivek-51b27",
//   storageBucket: "vivek-51b27.firebasestorage.app",
//   messagingSenderId: "38290936961",
//   appId: "1:38290936961:web:534cdf9f0646f231b36980",
//   measurementId: "G-CC5CE844PV"
// };