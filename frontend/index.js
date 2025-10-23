let nameEl=document.getElementById("name");
let emailEL=document.getElementById("email")
let passwordEl=document.getElementById("password")
let ageEl=document.getElementById("age")

let nameErrorMsgEl=document.getElementById("nameErrorMsg")
let emailErrorMsgEl=document.getElementById("emailErrorMsg")
let passwordErrorMsgEl=document.getElementById("passwordErrorMsg")
let ageErrorMsgEl=document.getElementById("ageErrorMsg")


let formEl=document.getElementById("registrationform");

nameEl.addEventListener("blur",function(){
    if(nameEl.value===""){
        nameErrorMsgEl.style.display="block"
        nameEl.classList.add("error-border")
    }
    else{
        nameErrorMsgEl.style.display="none"
        nameEl.classList.remove("error-border")
    }
})

emailEL.addEventListener("blur",function(){
    if(emailEL.value === ""){
        emailErrorMsgEl.style.display="block";
        emailEL.classList.add("error-border")
    }
    else{
        emailErrorMsgEl.style.display="none"
        emailEL.classList.remove("error-border")
    }
})

passwordEl.addEventListener("blur",function(){
    if(passwordEl.value === ""){
        passwordErrorMsgEl.style.display="block"
        passwordEl.classList.add("error-border")
    }
    else{
        passwordErrorMsgEl.style.display="none"
        passwordEl.classList.remove("error-border")


    }
})

ageEl.addEventListener("blur",function(){
    if(ageEl.value ===""){
        ageErrorMsgEl.style.display="block"
        ageEl.classList.add("error-border");
    }
    else{
        ageErrorMsgEl.style.display="none"
        ageEl.classList.remove("error-border");

    }
})

formEl.addEventListener("submit",function(event){
    event.preventDefault()

    if(nameEl.value ==="" || emailEL.value==="" || passwordEl.value==="" || ageEl.value===""){
        alert("Please fill all required fields");
        return;
    }
    let data={
        name:nameEl.value,
        email:emailEL.value,
        password:passwordEl.value,
        age:ageEl.value

    }

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        alert(response.message);
        formEl.reset();
    })
    .catch(err => console.error(err));

})