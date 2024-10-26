import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

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

document.getElementById("login").addEventListener("click", function(){
    sessionStorage.setItem("authType","dashboard")
    location.href = "/dashboard/"
  })
  document.getElementById("register").addEventListener("click", function(){
    sessionStorage.setItem("authType","register")
    location.href = "/login/"
  })

onAuthStateChanged(auth, async(user)=>{
  if (user){

    //is signed in

    let userDoc = await getDoc(doc(db, "Users", user.uid))

    if (!userDoc.exists()){
        alert("no user document!!")
        location.href = "/login/"
    }
    let data = userDoc.data()
    console.log(data)
    let logs = data.log.reverse()
    
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()

    let dateString = year+"-"+month+"-"+day
    console.log(dateString)

    let stressSum = 0
    let stressCount = 0

    let typedAverageSum={}
    let typedAverageCount={}

    for (let a in logs){
        let activity = logs[a]
        console.log(activity.date)
        if (activity.date != dateString){
            continue
        }

        stressSum += parseInt(activity.stress)
        stressCount++

        if (activity.type in typedAverageSum){
          typedAverageSum[activity.type] += parseInt(activity.stress)
          typedAverageCount[activity.type] ++
        }else{
          typedAverageSum[activity.type] = parseInt(activity.stress)
          typedAverageCount[activity.type] = 1
        }

    }
    console.log(stressSum,stressCount)
    let avgStress = Math.round(stressSum/stressCount)
    document.getElementById("avgstresslevel").innerHTML = avgStress

    let types = ["test","hw","family","social","other"]

    for (let type of types){
      let v = 0
      if (type in typedAverageSum){
        v = Math.round(typedAverageSum[type])
      }
      document.getElementById(type+"Stress").innerHTML = v
    }

  }else{
    location.href = "/login/"
  }

})
  