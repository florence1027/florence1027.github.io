// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDovwpB8-6uGV7yGqgmpQ9MOnr-zEx08vs",
  authDomain: "authentification-760c8.firebaseapp.com",
  projectId: "authentification-760c8",
  storageBucket: "authentification-760c8.firebasestorage.app",
  messagingSenderId: "725528653652",
  appId: "1:725528653652:web:61d82865fb271eb665a2c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const logInWithEmailAndPassword = async (
    email: string,
    password: string
    ) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
    };

export const logout = () => {
    signOut(auth);
};


export const getToken = async () => {
    if (!auth.currentUser) return '';
    
    return await auth.currentUser
        .getIdToken(false)
        .then(function (idToken) {
            return idToken;
        })
        .catch(function (error) {
            console.log("erreur de get token");
            console.log(error);
            return null;
        });
    };