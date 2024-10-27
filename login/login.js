import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged,createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"


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
const db = getFirestore();


let newAccount = false

window.addEventListener("load", init)
function init(){

    let email = document.getElementById("email")
    let pass = document.getElementById("password")
    let submitEmt = document.getElementById("submit")

    submitEmt.addEventListener("click",function(){ submit(email.value, pass.value) })
    newAccount = sessionStorage.getItem("authType")=="register"
    switchAuthType(sessionStorage.getItem("authType") == "register")

}

async function submit(email, pass){

    document.getElementById("submit").disabled = true

    if (newAccount){
        createUserWithEmailAndPassword(auth, email, pass)
        .then(async (userCredentials) => {

            //created new acocunt

            const user = userCredentials.user;

            let uData = {
                name: document.getElementById("name").value,
                log: []
            }


            await setDoc(doc(db, "Users/"+user.uid), uData)

            location.href = "/dashboard/"

        }).catch((error)=>{
            alert(error.message);
        })
    }else{
        signInWithEmailAndPassword(auth, email, pass)
        .then(async (userCredentials)=>{

            //logged into existing acc
            location.href = "/dashboard/"


        }).catch((error)=>{
            alert(error.message)
        })
    }

    document.getElementById("submit").disabled = false

}

document.getElementById("switch").addEventListener("click", function(){

    newAccount = !newAccount

    switchAuthType(newAccount)

})

function switchAuthType(newAccount){
    
    if (newAccount){
        document.getElementById("header").innerHTML = "Register:"

        document.getElementById("nameLabel").classList.remove("nameInputs")
        document.getElementById("name").classList.remove("nameInputs")

        document.getElementById("switch").innerHTML = "login to existing account"
        document.getElementById("submit").innerHTML = "Register"

    }else{
        document.getElementById("header").innerHTML = "Login:"

        document.getElementById("nameLabel").classList.add("nameInputs")
        document.getElementById("name").classList.add("nameInputs")

        document.getElementById("switch").innerHTML = "register new account"
        document.getElementById("submit").innerHTML = "Login"

    }

}
