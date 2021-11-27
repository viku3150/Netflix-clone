import { firebase } from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqqbhdShvvfHvryjJo3K_nD3l5SuKwm28",
  authDomain: "netflix-clone-f4234.firebaseapp.com",
  projectId: "netflix-clone-f4234",
  storageBucket: "netflix-clone-f4234.appspot.com",
  messagingSenderId: "72101935141",
  appId: "1:72101935141:web:2322544a89812e968967cc",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;
