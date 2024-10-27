import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import { Chart, registerables } from "chart.js"

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
  document.getElementById("register").addEventListener("click", function(){
    auth.signOut()
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
    let adviceString = ""
    if (avgStress >= 0){
      adviceString = "You had a very restful day, with almost no stess. This is good, because you still have a lot of energy for the next day."
    }if (avgStress >= 3){
      adviceString = "You had a pretty chill day, and still have a lot of energy left for tomorrow."
    }if (avgStress >= 5){
      adviceString = "You had a average day, without too much stress but still a decent amount. If you get rest, you will be good for tomorrow."
    }if (avgStress >= 7){
      adviceString = "You had a very stressful day, and should get good sleep to be recovered tomorrow."
    }if (avgStress  >= 9){
      adviceString = "You really need to take some time to rest, and get a lot of good sleep after a really stressful day. Consider meditating. "
    }
    document.getElementById("dailyadvice").innerHTML = adviceString


    let types = ["test","hw","family","social","other"]

    let mostStressedToday = ""
    let maxStress = 0

    for (let type of types){
      let v = 0
      if (type in typedAverageSum){
        v = Math.round(typedAverageSum[type])
      }
      if (v>maxStress){
        maxStress = v
        mostStressedToday = type
      }
      document.getElementById(type+"Stress").innerHTML = v
    }

    let currentDay = parseInt(year) * 365 + daysIntoYear(`${year}-${month}-${day}`)

    let weeklyValues = [0,0,0,0,0]
    for (let a in logs){
      let activity = logs[a]
      let activityDay = parseInt(activity.date.split(":")[0])*365 + daysIntoYear(activity.date)

      if (! (activityDay > currentDay-7)){
        console.log('w',activityDay,currentDay)  
        continue
      }
      console.log('w',activity)
      weeklyValues[types.indexOf(activity.type)] += parseInt(activity.stress)
    }
    let mostStressedWeek = ""
    maxStress = 0
    for (let i=0; i<types.length; i++){
      if (weeklyValues[i] > maxStress){
        maxStress = weeklyValues[i]
        mostStressedWeek = types[i]
      }
    }

    let monthlyValues = [0,0,0,0,0]
    for (let a in logs){
      let activity = logs[a]
      let activityDay = parseInt(activity.date.split(":")[0])*365 + daysIntoYear(activity.date)

      if (! (activityDay > currentDay-30)){
          continue
      }
      monthlyValues[types.indexOf(activity.type)] += parseInt(activity.stress)
    }
    let mostStressedMonth = ""
    maxStress = 0
    for (let i=0; i<types.length; i++){
      if (monthlyValues[i] > maxStress){
        maxStress = monthlyValues[i]
        mostStressedMonth = types[i]
      }
    }

    //mostStressedToday
    //mostStressedWeek
    //mostStressedMonth
    //^^ variables that hold the type with the most total stress
    //ADD ALL YOUR IF STATEMENTS HERE

    let dailyinsight = "";
    let weeklyinsight = "";
    let monthlyinsight = "";

    if(mostStressedToday == "test"){
        dailyinsight = "You seemed to have the most stress today from taking tests. This can happen on busy days, but it is important to stay calm and not worry too much. Here is a link to some test taking strategies: <a href = 'https://summer.harvard.edu/blog/14-tips-for-test-taking-success/'>Link.</a> ";
    }
    if(mostStressedWeek == "test"){
        weeklyinsight = "You seemed to have the most stress this week from taking tests. This can happen on some weeks, but it is important to stay calm and not worry too much. Here is a link to some test taking strategies. <a href = 'https://summer.harvard.edu/blog/14-tips-for-test-taking-success/'>Link.</a> However, if you did not have many tests this week, it is important to consider why taking tests is so stressful for you. Consider going in to ask your teachers questions during their office hours.";
    }
    if(mostStressedMonth == "test"){
        monthlyinsight =  "You seemed to have the most stress this month from taking tests. Here is a link to some test taking strategies. <a href = 'https://summer.harvard.edu/blog/14-tips-for-test-taking-success/'>Link.</a> However, if you did not have many tests this week, it is important to consider why taking tests is so stressful for you. Consider going in to ask your teachers questions during their office hours. If that is still not enough, consider seeking help from other students, parents, and even the internet.";
    }

    if(mostStressedToday == "hw"){
        dailyinsight = "You seemed to have the most stress today from homework. This can happen on busy days, but it is important to not worry too much."
    }
    if(mostStressedWeek == "hw"){
        weeklyinsight = "You seemed to have the most stress this week from taking tests. This can happen on some weeks when workload is high, but you need to manage time effectively. Maybe try different techniques to improve productivity while working, and consider going in to ask your teachers questions during their office hours."
    }
    if(mostStressedMonth == "hw"){
        monthlyinsight = "You seemed to have the most stress this month from doing homework. If homework is causing you the most stress over multiple weeks, you should definitely try to change your habits in some way. Try going to teachers for support during office hours, asking other students for help, or even consulting the internet."
    }

    if(mostStressedToday == "family"){
        dailyinsight = "You seemed to have the most stress today from family. This can happen on certain days when something happens, but it is important to stay calm and not worry too much."
    }
    if(mostStressedWeek == "family"){
        weeklyinsight = "You seemed to have the most stress this week from family. This can happen occasionally on certain weeks, but you should try to talk it out with your family, and see what is causing so much stress."
    }
    if(mostStressedMonth == "family"){
        monthlyinsight = "You seemed to have the most stress this month from family. In times like this, it can be vital to go and try to talk things out with your family and find out what is causing all the stress, and how to stop it."
    }

    
    if(mostStressedToday == "social"){
        dailyinsight = "You seemed to have the most stress from social situations and interactions today. On days where there are a lot of social interactions, this can happen."
    }
    if(mostStressedWeek == "social"){
        weeklyinsight = "You seemed to have the most stress for social situations and interactions this week. Try to have some alone time, and don't worry about what other people think of you."
    }
    if(mostStressedMonth == "social"){
        monthlyinsight = "You seemed to have the most stress for social situations and interactions this month. Definitely take some alone time, and you don't always need to worry about what other people are doing, or what they think about you. If the issue persists, maybe consider asking your counselor or parents."
    }

    document.getElementById("daily").innerHTML = dailyinsight;
    document.getElementById("weekly").innerHTML = weeklyinsight;
    document.getElementById("monthly").innerHTML = monthlyinsight;

    console.log(mostStressedToday, mostStressedWeek, mostStressedMonth)


    for (let node of document.getElementById("graphSettings").childNodes){
      node.addEventListener("input",function(){showGraph(logs)})
    }

    showGraph(logs)


  }else{
    location.href = "/"
  }

})

function daysIntoYear(date){
  let [year,month,day] = date.split("-")
  month=month-1
  date = new Date(parseInt(year),parseInt(month),parseInt(day))
  return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}
function leapYear(year)
{
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}


let chart
let todayOptionExists=true

function showGraph(logs){

  if (chart){
    chart.destroy()
  }

  const ctx = document.getElementById("graphCanvas")

  let types = ["test","hw","family","social","other"]
  let values = [0,0,0,0,0]
  let valueCounts = [0,0,0,0,0]

  let date = new Date();
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  let currentDay = parseInt(year) * 365 + daysIntoYear(`${year}-${month+1}-${day}`)

  let timeframe = document.getElementById("timeframe").value

  for (let activity of logs){

    let activityDay = parseInt(activity.date.split(":")[0])*365 + daysIntoYear(activity.date)

    let eligible = false

    console.log(currentDay,"djhdhd",activityDay)

    if (timeframe == "today"){
      eligible = activityDay == currentDay
    }else if (timeframe == "week"){
      eligible = activityDay>currentDay-7 
    }else if (timeframe == "month"){
      eligible = activityDay>currentDay-30
    }else{
      eligible = activityDay> currentDay-365
    }

    if (!eligible){continue}

    values[types.indexOf(activity.type)]+= parseInt(activity.stress)
    valueCounts[types.indexOf(activity.type)]++
  }

  if (document.getElementById("graphType").value == "pie"){
    document.getElementById("graphCtx").style.width = "50%"
  }else{
    document.getElementById("graphCtx").style.width = "75%"
  }

  if (document.getElementById("graphType").value == "line"){
    types=[]
    values=[]
    valueCounts=[]


    document.getElementById("trendFields").style.display = "block"

    if (todayOptionExists){
      document.getElementById("timeframe").remove(0)
      todayOptionExists = false  
    }

    let t = document.getElementById("timeframe").value
    let startDate = 0
    if (t=="week"){
      startDate = currentDay-7
    }else if (t=="month"){
      startDate = currentDay-30
    }else{
      startDate = currentDay-365
    }

    for (let day = startDate+1; day <= currentDay; day++){

      let y = Math.floor(day/365)
      let diy = day%365
      let m = 0

      let daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31]
      if (leapYear(y)){
        daysInMonth[1] = 29
      }

      for (let month of daysInMonth){
        if (diy > month){
          diy -= month
          m++
        }else{
          break
        }
      }
      m++

      types.push(`${y}-${m}-${diy}`)
      values.push(0)
      valueCounts.push(0)

      for (let activity of logs){
        let activityDay = parseInt(activity.date.split(":")[0])*365 + daysIntoYear(activity.date)
        console.log(day,activityDay)
        if (activityDay == day){

          let eligible = false
          let tr = document.getElementById("trend").value
          if (tr=="all"){
            eligible = true
          }else{
            eligible = activity.type == tr
          }

          if(!eligible){continue}

          values[values.length-1]+=parseInt(activity.stress)
          valueCounts[valueCounts.length-1]++
        }
      }

      if (valueCounts[valueCounts.length-1]==0){
        valueCounts[valueCounts.length-1]=1
      }

    }
    

    
  }else{
    document.getElementById("trendFields").style.display = "none"

    if (!todayOptionExists){
      let t = new Option("Today","today")
      document.getElementById("timeframe").add(t,0)
      todayOptionExists = true
    }

  }

  if (document.getElementById("val").value == "average"){
    for (let i=0; i<values.length; i++){
      values[i] = Math.round(values[i]/valueCounts[i])
    }
  }
  let t = document.getElementById("timeframe").value
  chart = new Chart(ctx, {
    type:document.getElementById("graphType").value,
    data:{
      labels: types,
      datasets: [{
        label: `${document.getElementById("val").value == "total" ? "Total" : "Average"} Stress Level`,
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
        pointRadius: t == "week" ? 10 : t == "month" ? 7 : 1 
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

}