import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import { getFirestore, doc, setDoc} from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

        }).catch((error)=>{
            alert(error.message);
        })
    }else{
        signInWithEmailAndPassword(auth, email, pass)
        .then(async (userCredentials)=>{

            //logged into existing acc



        }).catch((error)=>{
            alert(error.message)
        })
    }

    document.getElementById("submit").disabled = false

}

document.getElementById("switch").addEventListener("click", function(){

    newAccount = !newAccount

    if (newAccount){
        Array.from(document.getElementsByClassName("nameInputs")).forEach((e)=>{e.style.display = "block"})
        document.getElementById("switch").innerHTML = "login to existing account"
        document.getElementById("submit").innerHTML = "Register"

    }else{
        document.getElementById("switch").innerHTML = "register new account"
        Array.from(document.getElementsByClassName("nameInputs")).forEach((e)=>{e.style.display = "none"})
        document.getElementById("submit").innerHTML = "Login"

    }

})

