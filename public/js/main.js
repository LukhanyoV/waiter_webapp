document.addEventListener("DOMContentLoaded", () => {
    const flash = document.querySelector(".flash")
    if(flash.innerHTML !== ""){
        setTimeout(()=>flash.innerHTML="", 3000)
    }
})