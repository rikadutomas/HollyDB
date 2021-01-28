const toggleButton = document.getElementsByClassName('toggle-button')[0];
const navbarLinks = document.getElementsByClassName('nav-links')[0];
const navbarSearch = document.getElementsByClassName('nav-search')[0];
const mainContent = document.getElementById('main');
const tipoProcura = document.getElementById('search_film');
const strProcura = document.getElementById('str-Procura');
const navlogo = document.getElementById('navlogo');

var filmes;
var userNome='';
var user = false;
var favoritos = [];
var fvrHistory = false;


navlogo.addEventListener('click',()=>{
    loadFilmesToMainContainer();
})

strProcura.addEventListener('keyup',function (event){
    if (event.keyCode === 13) {
        event.preventDefault();
        makeSearch();
    }
})

toggleButton.addEventListener('click',()=>{
    navbarLinks.classList.toggle('active');
    navbarSearch.classList.toggle('active');
});


//=========================Main Presentation Loader ==============================================

function imageElementCode(filme){
    return `
        <div class="main" id="main">
            <div class="image">
                <img class="image__img" src="${filme.cover}" alt="${filme.titulopt}">
                <div class="image__overlay">
                    <div class="image__title"><a onclick="showDetalhesFilme(${filme.id})" class="btn-detalhes"><img class="image__icon"src="./img/details_white.svg" alt=""></a></div>
                    <div class="image__title"><a onclick="setFilmeFavoritos(${filme.id},false)" class="btn-favoritos"><img id="img${filme.id}" class="image__icon" src="${ifFavorito(filme.id,false)}" alt=""></a></div>
                </div>
            </div>
        </div>
    `
}

function getFilmes(){
    return new Promise((resolve,reject)=>{
        fetch('/filmes/getFilmesActive',{method : 'get'})
            .then(res=>res.json())
            .then(data => resolve(data))
    });
}

function snippetFilmes(arrFilmes){
    return new Promise((resolve,reject)=>{
        let out = '';
        arrFilmes.forEach(filme=>{
            out = out + imageElementCode(filme)
            // out = out + '<div class="img-snippet"><img src="'+filme.cover+'" alt=""></div>'
        })
        resolve(out);
    })
}

async function loadFilmesToMainContainer(jump=false){
    if(!user && jump==false){
        fetch('/users/session', {
            method:'post',
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then((response)=>{
            return response.json();
        }).then((qry)=>{
            if(qry.result =='ok'){
                user = true;
                userNome = qry.nome;
                favoritos = qry.favoritos;
                loggedState();
            }
        }).catch((error)=>{
            console.log(error);
        })      
    }
    // let value = document.cookie.split(';')
    filmes = await getFilmes();
    console.log(filmes);
    if(filmes.error){
        mainContent.innerHTML = htmlErr(filmes.error);
    }else{
        mainContent.innerHTML = await snippetFilmes(filmes);
    }
        
}

function getFilmById(id){
    for (let i=0;i<filmes.length;i++){
        if(filmes[i].id == id){
            return filmes[i];
        }
    }
}


//======================================Detalhes Filmes============================================

function duracaoFilme(num){
    let hours = (num / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return rhours + "h" + rminutes + "m";
}

window.showDetalhesFilme = (id)=>{
    modal.innerHTML = codeDetalhesFilme(id);
    $('.modal').css('width','750px');
    overlay.classList.add('active');
    modal.classList.add('active');   
}

function codeDetalhesFilme(id){
    let filme = getFilmById(id);
    return `
        <div class="modal-header">
            <div class="title">
                <div class="title1">${filme.titulopt}<span>(${filme.titulo})</span></div>
                <div class="title2">${filme.etaria} | ${filme.ano} | ${duracaoFilme(filme.duracao)}</div>
            </div>
            <button class="close-button" id="close-modal" onclick="closeModalFunc()"><img src="./img/cancel.svg" alt="" style="width:30px;height:30px;"></button>
        </div>
        <div class="modal-body">
            <div class="modal-image-movie"><img src="${filme.cover}" alt=">${filme.titulopt}"></div>
            <div class="modal-filme-detalhes">
                <table class="modal-table">
                    <tr>
                    <th>Realizador:</th>
                    <td>${filme.realizador}</td>
                    </tr>
                    <tr>
                    <th>Com:</th>
                    <td>${filme.actor}</td>
                    </tr>
                    <tr>
                    <th>Genero:</th>
                    <td>${filme.genero}</td>
                    </tr>
                    <tr>
                    <th>Sinopse:</th>
                    <td>${filme.sinopse}</td>
                    </tr>
                </table>
            </div>
            <div class="fvr-estrela">
                <a onclick="playVideoTrailler(${filme.id})"><img src="./img/video-player.svg" alt=""></a>
            </div>
            <div class="fvr-estrela">
                <a onclick="setFilmeFavoritos(${filme.id},true)"><img id="img${filme.id}" src="${ifFavorito(filme.id,true)}" alt=""></a>
            </div>
        </div>
    `;
}
//======================================Utilizador============================================
window.loginModal = async ()=>{
    modal.innerHTML = await codeLoginModal();
    await $('.modal').css('width','400px');
    await overlay.classList.add('active');
    await modal.classList.add('active');

    document.getElementById('email').addEventListener('click',()=>{
        document.getElementById('login-out').textContent = '';
    })
    document.getElementById('passwd').addEventListener('click',()=>{
        document.getElementById('login-out').textContent = '';
    })
    document.getElementById('remail').addEventListener('click',()=>{
        document.getElementById('register-out').textContent = '';
    })
    document.getElementById('rpasswd').addEventListener('click',()=>{
        document.getElementById('register-out').textContent = '';
    })
    document.getElementById('rnome').addEventListener('click',()=>{
        document.getElementById('register-out').textContent = '';
    })

    const loginForm = document.getElementById('login-login');
    loginForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const email = document.getElementById('email').value;
        const passwd = document.getElementById('passwd').value;
        fetch('/users/login', {
            method:'post',
            body: JSON.stringify({
                email:email,
                password:passwd
            }),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then((response)=>{
            return response.json();
        }).then((qry)=>{
            if(qry.result !='ok')
                document.getElementById('login-out').textContent = qry.result;
            else{
                user = true;
                userNome = qry.nome;
                favoritos = qry.favoritos;
                document.getElementById('login-out').textContent = '';
                loggedState();
                mainContent.innerHTML='';
                if(fvrHistory==true){
                    fvrHistory=false;
                    loadFavoritosToMainContainer();
                }else{
                    loadFilmesToMainContainer();
                }
                closeModalFunc();
            }
        }).catch((error)=>{
            console.log(error);
        })      
    });

    const registerForm = document.getElementById('login-register');
    registerForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const nome = document.getElementById('rnome').value;
        const email = document.getElementById('remail').value;
        const passwd = document.getElementById('rpasswd').value;
        const outBox = document.getElementById('register-out')
        fetch('/users/register', {
            method:'post',
            body: JSON.stringify({
                nome:nome,
                email:email,
                password:passwd
            }),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then((response)=>{
            return response.json();
        }).then((qry)=>{
            if(qry.result!='ok')
                return outBox.textContent = qry.result;
            else{
                user = true;
                document.getElementById('register-out').textContent = '';
                loggedState();
                closeModalFunc();
            }
        }).catch((error)=>{
            console.log(error);
        })      
    });
}

function codeLoginModal(id){
    return `
        <div class="login-form-box">
            <button class="login-close-button" id="close-modal" onclick="closeModalFunc()"><img src="./img/cancel.svg" alt="" style="width:30px;height:30px;"></button>
            <div class="login-button-box">
                <div id="login-btn"></div>
                <button type="button" class="login-toggle-btn" onclick="loginLogin()">Log In</button>
                <button type="button" class="login-toggle-btn" onclick="loginRegister()">Register</button>
            </div>
            <div class="login-logo">
                <img src="./img/holly.png" alt="">
            </div>
            <form class="login-input-group" id="login-login">
                <input type="text" id="email" class="login-input-field" placeholder="Email">
                <input type="password" id="passwd" class="login-input-field" placeholder="Password">
                <div class="login-out"><label id="login-out">&nbsp</label></div>
                <button type="submit" class="login-submit-btn">Log In</button>
            </form>
            <form id="login-register" class="login-input-group" onsubmit="">
                <input type="text" id="rnome" class="login-input-field" placeholder="Nome">
                <input type="email" id="remail" class="login-input-field" placeholder="Email">
                <input type="password" id="rpasswd" class="login-input-field" placeholder="Password">
                <div class="login-out"><label id="register-out">&nbsp</label></div>
                <button type="submit" class="login-submit-btn">Register</button>
            </form>
        </div>
    `;
}

window.loggedState = ()=>{
    var cols = document.getElementsByClassName('login-state');
    for(let i = 0; i < cols.length; i++) {
        cols[i].style.display = 'flex';
    }
    var cols = document.getElementsByClassName('logout-state');
    for(let i = 0; i < cols.length; i++) {
        cols[i].style.display = 'none';
    }
}

window.logoutState = ()=>{
    fetch('/users/logout', {
        method:'post',
        headers: {
            "Content-Type" : "application/json; charset=utf-8"
        }
    }).catch((error)=>{
        console.log(error);
    })
    favoritos = [];
    user = false;
    var cols = document.getElementsByClassName('login-state');
    for(let i = 0; i < cols.length; i++) {
        cols[i].style.display = 'none';
    }
    var cols = document.getElementsByClassName('logout-state');
    for(let i = 0; i < cols.length; i++) {
        cols[i].style.display = 'flex';
    }
    loadFilmesToMainContainer(true);
}

//======================================Set Favoritos============================================

window.loadFavoritosToMainContainer = ()=>{
    if (!user){
        fvrHistory = true;
        loginModal();
        return;
    }
    let out = '';
    if (favoritos.length==0){
        mainContent.innerHTML = htmlErr('Não tem filmes favoritos selecionados');
        return;
    }
    favoritos.forEach(id=>{
        out = out + filmeSnippet(id);
    })
    mainContent.innerHTML = out;
}

function filmeSnippet(id){
    let filme;
    if (typeof(id)=='object'){
        filme = id;
    }else{
        filme = getFilmById(id);
    }

    return `
            <div class="fvr-box">
                <div class="fvr-img-box"><img src="${filme.cover}" alt="${filme.titulopt}"></div>
                <div class="fvr-detalhes-box">
                    <div class="fvr-titulo-box">
                        <div class="fvr-titulo">
                            <div class="fvr-titulo1">${filme.titulopt}<span>${filme.titulo}</span></div>
                            <div class="fvr-titulo2">${filme.etaria} | ${filme.ano} | ${duracaoFilme(filme.duracao)}</div>
                        </div>
                        <div class="fvr-estrela">
                            <a onclick="playVideoTrailler(${filme.id})"><img src="./img/video-player.svg" alt=""></a>
                        </div>
                        <div class="fvr-estrela">
                            <a onclick="setFilmeFavoritos(${filme.id},true)"><img id="img${filme.id}" src="${ifFavorito(filme.id,true)}" alt=""></a>
                        </div>
                    </div>
                    <div class="fvr-table-box">
                        <table class="fvr-table">
                            <tr>
                                <th>Realizador:</th>
                                <td>${filme.realizador}</td>
                            </tr>
                            <tr>
                                <th>Com:</th>
                                <td>${filme.actor}</td>
                            </tr>
                            <tr>
                                <th>Genero:</th>
                                <td>${filme.genero}</td>
                            </tr>
                            <tr>
                                <th>Sinopse:</th>
                                <td>${filme.sinopse}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <span class="fvr-span"></span>
            </div>
        `
}


window.ifFavorito=(id,st)=>{
    if(st){
        if(favoritos.includes(id)){
            return './img/favorito_on_border.svg'
        }
        else{
            return './img/favorito_off_border.svg'
        }
    }
    else{
        if(favoritos.includes(id)){
            return './img/favorito_on.svg'
        }
        else{
            return './img/favorito_off.svg'
        }
    }
}

window.setFilmeFavoritos = (id,st)=>{
    let oldFavoritos = [];
    if (!user){
        fvrHistory = st;
        loginModal();
        return;
    }
    if(favoritos.includes(id)){
        
        oldFavoritos = favoritos;
        for(let x = 0; x<favoritos.length; x++){
            if(favoritos[x] == id){
                favoritos.splice(x,1);

                if(updateUserFavoritos()==false){
                    favoritos = oldFavoritos;
                    return;
                }
                if(st){
                    document.getElementById('img'+id).src="./img/favorito_off_border.svg";
                }else{
                    document.getElementById('img'+id).src="./img/favorito_off.svg";
                }
                return;
            }
        }
    }
    else{
        favoritos.unshift(id);
        if(updateUserFavoritos()==false){
            favoritos = oldFavoritos;
            return;
        }
        if(st){
            document.getElementById('img'+id).src="./img/favorito_on_border.svg";
        }else{
            document.getElementById('img'+id).src="./img/favorito_on.svg";
        }
    }
    
}

function updateUserFavoritos(){
    let x = favoritos;
    fetch('/users/updateFavoritos', {
        method:'post',
        body: JSON.stringify({
            "favoritos":x
        }),
        headers: {
            "Content-Type" : "application/json; charset=utf-8"
        }
    }).then((response)=>{
        return response.json();
    }).then((qry)=>{
        if(qry.result=='error'){
            return false;
        }else{
            return true;
        }
    }).catch((error)=>{
        console.log(error);
        return false;
    })     
}



//======================================Procura============================================

window.makeSearch = ()=>{
    let str = strProcura.value;
    if (str != ''){
        searchMovies(str);
    }else alert('O conteudo nao pode ser vazio');
}

function searchMovies(str) {
    
    let arrFilme = [], arrActor = [], arrRealizador = [], arrGenero = [];
    let filter = tipoProcura.value.toLowerCase();
    str = str.toLowerCase();
    let out = '';
    let hasResults = false;

    switch(filter){
        case 'filme':
            searchFilme(str);
            break;
        case 'actor':
            searchActor(str);
            break;
        case 'realizador':
            searchRealizador(str);
            break;
        case 'genero':
            searchGenero(str);
            break;
        default:
            searchFilme(str);
            searchActor(str);
            searchRealizador(str);
            searchGenero(str);
    }

    if (arrFilme.length != 0){
        out = out + '<div class="search-header"><h1>Filmes</h1></div>'
        for (let i=0;i<arrFilme.length;i++){
            out = out + filmeSnippet(arrFilme[i]);
        }
        hasResults = true;
    }
    if (arrActor.length != 0){
        out = out + '<div class="search-header"><h1>Actor</h1></div>'
        for (let i=0;i<arrActor.length;i++){
            out = out + filmeSnippet(arrActor[i]);
        }
        hasResults = true;
    }
    if (arrRealizador.length != 0){
        out = out + '<div class="search-header"><h1>Realizador</h1></div>'
        for (let i=0;i<arrRealizador.length;i++){
            out = out + filmeSnippet(arrRealizador[i]);
        }
        hasResults = true;
    }
    if (arrGenero.length != 0){
        out = out + '<div class="search-header"><h1>Genero</h1></div>'
        for (let i=0;i<arrGenero.length;i++){
            out = out + filmeSnippet(arrGenero[i]);
        }
        hasResults = true;
    }
    if(hasResults == false){
        out = '<div class="search-header"><h1>Sem Resultados</h1></div>'
    }    

    
    mainContent.innerHTML = out;

    function searchFilme(str) {
        let out1 = filmes.filter(item => item.titulo.toLowerCase().includes(str));
        let out2 = filmes.filter(item => item.titulopt.toLowerCase().includes(str));
        out2 = out2.filter(val => !out1.includes(val));
        arrFilme = out1.concat(out2);
    }
    function searchActor(str) {
        arrActor = filmes.filter(item => item.actor.toLowerCase().includes(str));
    }
    function searchRealizador(str) {
        arrRealizador = filmes.filter(item => item.realizador.toLowerCase().includes(str));
    }
    function searchGenero(str) {
        arrGenero = filmes.filter(item => item.genero.toLowerCase().includes(str));
    }

}

//=======================Opcoes de utilizador=======================

window.loadOpcoesUtilizador = ()=>{
    let out = `
    <div class="opcoes-container">
        <div class="opcoes-user-header">
            <h1>Opcoes do Utilizador - ${userNome}</h1>
        </div>
        <div class="opcoes-user-box">
            <h4>Alterar Password</h4><button onclick="resetPasswordUtilizador()">Alterar</button>
        </div>
        <div class="opcoes-user-box">
            <h4>Terminar conta</h4><button onclick="terminarUtilizador()">Terminar</button>
        </div>  
    </div>
    `
    mainContent.innerHTML = out; 
}

function codeResetPassword(){
    return `
        <div class="modal-header">
            <div class="title">
                <div class="opcoes-title1">Alterar Password</div>
            </div>
            <button class="close-button" id="close-modal" onclick="closeModalFunc()"><img src="./img/cancel.svg" alt="" style="width:30px;height:30px;"></button>
        </div>
        <div id="modal-body" class="opcoes-modal-body">
            <div class="opcoes-modal-body-left">
                <div class="opcoes-password">
                    <h4>Password Actual</h4><input id="pantiga" type="password"></input>
                </div>
                <div class="opcoes-password">
                    <h4>Password Nova</h4><input id="pnova" type="password"></input>
                </div>
                <div class="opcoes-password">
                    <h4>Confirmar Password Nova</h4><input id="pconfirma" type="password"></input>
                </div>
                <div class="opcoes-password">
                    <h5 id="opcoes-outtext">&nbsp;</h5>
                </div>         
                <div class="opcoes-password">
                    <button onclick="subPasswordNova()">Submeter</button>
                </div>
            </div>
        </div>
    `;
}

function codeResetPasswordSuccess(){
    return `
            <div class="opcoes-modal-body-success">
                <div class="opcoes-password">
                    <h4>Password Alterada com sucesso</h4>   
                </div>  
                <div class="opcoes-password">
                    <button onclick="closeModalFunc()">Sair</button>
                </div>
            </div>
    `;
}

function codeTerminarContaSuccess(){
    return `
            <div class="opcoes-modal-body-success">
                <div class="opcoes-terminar-success">
                    <h4>Conta Terminada com sucesso</h4>
                    <h4>Volte Sempre... Sera sempre benvindo!!!</h4>   
                </div>
                <div class="opcoes-terminar-success">
                    <img src="../img/goodbye.png" alt="Goodbye">
                </div>  
                <div class="opcoes-password">
                    <button onclick="closeModalFunc()">Sair</button>
                </div>
            </div>
    `;
}

function codeTerminarConta(){
    return `
        <div class="modal-header">
            <div class="title">
                <div class="opcoes-title1">Terminar Conta</div>
            </div>
            <button class="close-button" id="close-modal" onclick="closeModalFunc()"><img src="./img/cancel.svg" alt="" style="width:30px;height:30px;"></button>
        </div>
        <div id="modal-body" class="opcoes-modal-body">
            <div class="opcoes-modal-body-terminar">
                <div class="opcoes-terminar-header">
                    <h1>Atencao!!!</h1>
                    <h3>Ira apagar toda a sua informacao incluindo os seus conteudos favoritos</h3>
                    <h3>Esta operacao e irreversivel apos concluida</h3>
                </div>
                <div class="opcoes-password">
                    <h4>Introduza a sua Password</h4><input id="pconfirma" type="password"></input>
                </div>
                <div class="opcoes-password">
                    <h5 id="opcoes-outtext">&nbsp;</h5>
                </div>         
                <div class="opcoes-password">
                    <button onclick="subTerminarConta()">Submeter</button>
                </div>
            </div>
        </div>
    `;
}

window.subPasswordNova = ()=>{
    const pnova = document.getElementById('pnova').value;
    const pantiga = document.getElementById('pantiga').value;
    const pconfirma = document.getElementById('pconfirma').value;
    const pouttext = document.getElementById('opcoes-outtext');
    
    document.getElementById('pnova').addEventListener('click',()=>{
        document.getElementById('opcoes-outtext').innerHTML = '&nbsp;';
    })
    document.getElementById('pantiga').addEventListener('click',()=>{
        document.getElementById('opcoes-outtext').innerHTML = '&nbsp;';
    })
    document.getElementById('pconfirma').addEventListener('click',()=>{
        document.getElementById('opcoes-outtext').innerHTML = '&nbsp;';
    })
    fetch('/users/renewPassword', {
        method:'post',
        body:JSON.stringify({
            pswantiga:pantiga,
            pswnova:pnova,
            pswconf:pconfirma
        }),
        headers: {
            "Content-Type" : "application/json; charset=utf-8"
        }
    }).then((response)=>{
        return response.json();
    }).then((qry)=>{
        if(qry.result!='ok'){
            pouttext.textContent = qry.result;
            return;
        }
        document.getElementById('modal-body').innerHTML = codeResetPasswordSuccess()
    }).catch((error)=>{
        console.log(error);
    })
};

window.subTerminarConta = ()=>{
    const pconfirma = document.getElementById('pconfirma').value;
    const pouttext = document.getElementById('opcoes-outtext');
    document.getElementById('pconfirma').addEventListener('click',()=>{
        document.getElementById('opcoes-outtext').innerHTML = '&nbsp;';
    });
    fetch('/users/terminarUser', {
        method:'post',
        body:JSON.stringify({
            password:pconfirma
        }),
        headers: {
            "Content-Type" : "application/json; charset=utf-8"
        }
    }).then((response)=>{
        return response.json();
    }).then((qry)=>{
        if(qry.result!='ok'){
            pouttext.textContent = qry.result;
            return;
        }
        document.getElementById('modal-body').innerHTML = codeTerminarContaSuccess();
        favoritos = [];
        user = false;
        var cols = document.getElementsByClassName('login-state');
        for(let i = 0; i < cols.length; i++) {
            cols[i].style.display = 'none';
        }
        var cols = document.getElementsByClassName('logout-state');
        for(let i = 0; i < cols.length; i++) {
            cols[i].style.display = 'flex';
        }
        loadFilmesToMainContainer(true);
    }).catch((error)=>{
        console.log(error);
    })
}

window.terminarUtilizador = ()=>{
    modal.innerHTML = codeTerminarConta();
    $('.modal').css('width','750px');
    overlay.classList.add('active');
    modal.classList.add('active');  
}

window.resetPasswordUtilizador = ()=>{
    modal.innerHTML = codeResetPassword();
    $('.modal').css('width','750px');
    overlay.classList.add('active');
    modal.classList.add('active');  
}

//=======================Videos=======================


function codeVideoPlayer(filme){
    
    return `
        <div class="modal-header">
            <div class="title">
                <div class="opcoes-title1">${filme.titulopt}</div>
                <div class="title2">${filme.etaria} | ${filme.ano} | ${duracaoFilme(filme.duracao)}</div>
            </div>
            <button class="close-button" id="close-modal" onclick="closeModalFunc()"><img src="./img/cancel.svg" alt="" style="width:30px;height:30px;"></button>
        </div>
        <div id="modal-body" class="modal-body-video">
            <iframe src="${filme.video}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    `;
}

window.playVideoTrailler = (id)=>{
    console.log(id);
    const filme = getFilmById(id);
    modal.innerHTML = codeVideoPlayer(filme);
    $('.modal').css('width','838px');
    overlay.classList.add('active');
    modal.classList.add('active');  
}

//=======================Erros=======================

function htmlErr(str){
    return `<h1 class="err-html" style="color:#fff;padding:30px;">${str}</h1>`
}


//=======================Loader=======================
loadFilmesToMainContainer();
