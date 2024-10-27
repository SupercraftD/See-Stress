
document.getElementById("login").addEventListener("click", function(){
    sessionStorage.setItem("authType","dashboard")
    location.href = "/dashboard/"
  })
  document.getElementById("register").addEventListener("click", function(){
    sessionStorage.setItem("authType","register")
    location.href = "/login/"
  })
