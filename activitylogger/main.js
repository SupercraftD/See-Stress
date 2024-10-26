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

    function refreshList(){

        let list = document.getElementById("activityList")
        let template = document.getElementById("activityTemplate")

        list.innerHTML = ""

        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()+1
        let day = date.getDate()

        let dateString = year+"-"+month+"-"+day
        console.log(dateString)

        for (let a in logs){
            let activity = logs[a]
            console.log(activity.date)
            if (activity.date != dateString){
                continue
            }            

            let fields = ["type","stress","writeup","time"]
            let currentField = 0
    
    
    
            let element = template.cloneNode(true)
            for (let child of element.childNodes){
                console.log(child)
                if (child.classList && child.classList.contains("activityField")){
    
                    let f = fields[currentField]
                    if (f == "type"){
                        child.innerHTML = "<span class='lbl'>Type: </span> "+activity.type
                    }else if (f == "stress"){
                        child.innerHTML = "<span class='lbl'>Stress Level: </span>"+activity.stress
                    }else if (f=="writeup"){
                        child.innerHTML = "<span class='lbl'>Writeup: </span>"+activity.writeup
                    }else{

                        let [year,month,day] = activity.date.split("-")
                        let [hour,minute] = activity.time.split(":")

                        let m = "am"
                        hour = parseInt(hour)
                        if (hour > 12){
                            m = "pm"
                            hour-=12
                        }
                        hour = hour.toString()

                        child.innerHTML = "<span class='lbl'>Time: </span>"+ `${month}/${day}/${year} ${hour}:${minute}${m}`
                    }
                    currentField++

                }
            }
            element.id = "activity"+a
            element.style.display = "block"
            list.appendChild(element)
    
        }

    }

    document.getElementById("add").addEventListener("click",toggleShowAdd)
    document.getElementById("submitActivity").addEventListener("click",async function(){
    
        document.getElementById("submitActivity").disabled = true

        let type = document.getElementById("type").value
        let stress = document.getElementById("stress").value
        let writeup = document.getElementById("writeup").value
        let date = document.getElementById("date").value
        let time = document.getElementById("time").value
    
        let activityData = {
            type:type,
            stress:stress,
            writeup:writeup,
            date:date,
            time:time
        }
    
        logs.push(activityData)

        await updateDoc(doc(db, "Users", user.uid), {log:logs})

        document.getElementById("submitActivity").disabled = false
        toggleShowAdd()
        refreshList()
        alert("activity added!")
    
    })
    
    refreshList()
    

  }else{
    
    //is signed out
    location.href = "/login/"
  }
})

function toggleShowAdd(){
    let a = document.getElementById("add")

    if (a.innerHTML == "Add Log"){
        document.getElementById("addActivity").style.display = "block"
        a.innerHTML = "Cancel"
    }else{
        document.getElementById("addActivity").style.display = "none"
        a.innerHTML = "Add Log"
    }
}