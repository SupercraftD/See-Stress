import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTdNmROBb4Qslb0W2vW_Pmzsss_xuztuo",
  authDomain: "seestress-cc0de.firebaseapp.com",
  projectId: "seestress-cc0de",
  storageBucket: "seestress-cc0de.appspot.com",
  messagingSenderId: "712991588919",
  appId: "1:712991588919:web:0a0877f8ce2fa46a9435b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

document.getElementById("login").addEventListener("click", function(){
  sessionStorage.setItem("authType","dashboard")
  location.href = "/dashboard/"
})

///fix this
document.getElementById("register").addEventListener("click", function(){
  auth.signOut()
})


onAuthStateChanged(auth, async(user)=>{
  if (user){

    //is signed in

  }else{
    
    //is signed out
    location.href = "/"

  }
})