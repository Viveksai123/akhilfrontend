import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

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
const database = getDatabase(app);

export { database };