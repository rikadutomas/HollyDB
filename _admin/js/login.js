
async function loginAdminUser(email,password){
    return await new Promise((resolve,reject)=>{
        fetch('/users/loginAdminUser', {
            method:'post',
            body: JSON.stringify({
                email:email,
                password:password
            }),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then(res=>res.json())
        .then(data => resolve(data))  
	});
}

async function renewPass(hash,password){
    return await new Promise((resolve,reject)=>{
        fetch('/users/resetPass', {
            method:'post',
            body: JSON.stringify({
                hash:hash,
                password:password
            }),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then(res=>res.json())
        .then(data => resolve(data))  
	});
}

function logoutState(){
    fetch('/users/logout', {
        method:'post',
        headers: {
            "Content-Type" : "application/json; charset=utf-8"
        }
    }).catch((error)=>{
        console.log(error);
    })
}

async function userSessionState(){
    return await new Promise((resolve,reject)=>{
        fetch('/users/session', {
            method:'post',
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        })
        .then(res=>res.json())
        .then(data => resolve(data))  
	});       
}

function htmlLogin(){
  return `
        <div class="login-container">
            <div class="modal" id="modal"></div>
            <div class="form-box">
                <div class="title-box">
                    <img src="./img/holly_bkg.png" alt="">
                </div>
                <form class="input-group" id="flogin" novalidate>
                    <input type="text" id="uname" class="input-field" placeholder="Email" autocomplete ="off" >
                    <input type="password" id="psw" class="input-field" placeholder="Password" autocomplete ="off" > 
                    <div id="errmsg">&nbsp;</div>
                    <span id="msg-span">&nbsp;</span>
                    <button type="button" class="submit-btn" onclick="loginUser()">Entrar</button>
                </form>
            </div>
            <div id="overlay"></div>
        </div>
  `
}

function popRenewPass(){
    var out =   '<div class="modal-header">'+
                    '<div id="modal-title" class="title">Reset a Password</div>'+
                    '<button data-close-button class="close-button" onclick="closeModalWindow()">&times;</button>'+
                '</div>'+
                '<div id="modal-body" class="modal-body">'+
                    '<div class="tbl-login-modal">'+
                        '<div class="tbl-login-modal-in"><label>Nova Password</label>'+
                        '<input id="pass1"></input></div>'+
                        '<div class="tbl-login-modal-in"><label>Repetir Password</label>'+
                        '<input id="pass2"></input></div>'+
                    '</div>'+
                    '<div>&nbsp;</div>'+
                    '<div>'+
                        '<a class="btn-neutral" href="javascript:submitResetPassword()">Continuar</a>'+
                        '<a class="btn-neutral" href="javascript:closeModalWindow()">Cancelar</a>'+
                    '</div>'+
                '</div>'
    return out;
}


function htmlDashboard(){
    let out = '<div class="dsh-container">'+
    '<div><img src="./img/holly_bkg.png"></img></div>'+
    '<div id="ficha-tecnica"><h2>Desenvolvido por:</h2><p>Luis Mergulhao</p><p>Sandra Lourenco</p><p>Ricardo Tomas</p></div>'+
    '</div>'
    
    return out
}




export {htmlLogin,loginAdminUser,popRenewPass,renewPass,logoutState,userSessionState,htmlDashboard};


  
{/* <div class="modal" id="modal">
<!-- <div class="modal-header">
    <div id="modal-title" class="title">Example Modal</div>
    <button data-close-button class="close-button">&times;</button>
</div>
<div id="modal-body" class="modal-body">
    <div>
        <h4>Tem a Certeza que deseja Sair?</h4>
    </div>
    <div>
        <a class="btn-bad" href="">Cancelar</a><a class="btn-good" href="">Continuar</a>
    </div>
</div> -->
</div>
<div id="main-body"></div>
<div id="overlay"></div> */}
