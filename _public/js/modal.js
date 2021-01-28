const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');


overlay.addEventListener('click',()=>{
    closeModalFunc();
});

window.closeModalFunc = ()=>{
    if(modal==null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
    modal.innerHTML = '';
}

window.loginRegister = ()=>{
    var x = document.getElementById('login-login');
    var y = document.getElementById('login-register');
    var z = document.getElementById('login-btn');

    x.style.left = "-400px";
    y.style.left = "50px";
    z.style.left = "110px";
}
window.loginLogin = ()=>{
    var x = document.getElementById('login-login');
    var y = document.getElementById('login-register');
    var z = document.getElementById('login-btn');
    
    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "0";
}