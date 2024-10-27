import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import {Chart, registerables} from "chart.js"
Chart.register(...registerables)

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

///fix this
document.getElementById("register").addEventListener("click", function(){
  auth.signOut()
})

document.getElementById("activitylogger").addEventListener("click", function(){
  location.href = "/activitylogger/"
})
document.getElementById("graph").addEventListener("click", function(){
  location.href = "/insights/"
})
document.getElementById("helplink").addEventListener("click", function(){
  location.href = "/resources/"
})
document.getElementById("activityarchive").addEventListener("click", function(){
  location.href = "/activityarchive/"
})


onAuthStateChanged(auth, async(user)=>{
  if (user){

    //is signed in

    let types = ["test","hw","family","social","other"]
    let values = [0,0,0,0,0]
    
    let userDoc = await getDoc(doc(db, "Users", user.uid))

    if (!userDoc.exists()){
        alert("no user document!!")
        location.href = "/login/"
    }
    let data = userDoc.data()
    let logs = data.log.reverse()

    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()

    let dateString = year+"-"+month+"-"+day

    for (let activity of logs){
      
      if (activity.date != dateString){
        continue
      }
      values[types.indexOf(activity.type)] += parseInt(activity.stress)
    }

    let chart = new Chart(document.getElementById("canv"), {
      type:"bar",
      data:{
        labels: types,
        datasets: [{
          label: `Today's Total Stress Level`,
          data: values,
          borderWidth:1,
          backgroundColor:[
            'rgba(255, 99, 132, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(201, 203, 207, 0.5)'    
          ],
          borderColor:"black",
          tension:0.1,
          fill:false,
          pointRadius: 10
        }]
      },
      options:{
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  


  }else{
    
    //is signed out
    location.href = "/"

  }
})