//data-modal-target="#modal"
function htmlMainPage(){
    return `
        <div class="main-container">
            <div class="layout-header">

                    <div class="left-area">
                        <h3>Holly <span>DB</span></h3>
                    </div>
                    <div class="right-area">
                        
                    </div>
            </div>
            <div class="layout-box">
                <div class="layout-sidebar">
                    <a href="javascript:loadFilmesMain()"><i class="fas fa-video"></i><span>Filmes</span></a>
                    <a href="javascript:loadProfissionaisMain()"><i class="fas fa-video"></i><span>Profissionais</span></a>
                    <a href="javascript:loadUtilizadoresMain()"><i class="fas fa-user"></i><span>Utilizadores</span></a>
                    <span class="span-exit">&nbsp;</span>
                    <a href="javascript:logoutUser()" id="btn-exit-app"><i class="fas fa-sign-out-alt"></i><span>Sair</span></a>
                </div>
                <div id="container" class="layout-content">
                    
                </div>
            </div>
        </div>
    `
}

function htmlFilmes(){
    return `
        <div class="content-title">
            <h4 id="title-nav-bar-label">Filmes</h4>
        </div>
        <div class="content-nav"></div>
        <div id="content-main">
        </div>   
    `
}

function htmlUsers(){
    return `
        <div class="content-title">
            <h4 id="title-nav-bar-label">Utilizadores</h4>
        </div>
        <div class="content-nav"></div>
        <div id="content-main">
        </div>   
    `
}

function htmlProf(){
    return `
        <div class="content-title">
            <h4 id="title-nav-bar-label">Profissionais</h4>
        </div>
        <div class="content-nav"></div>
        <div id="content-main">
        </div>   
    `
}

export {htmlMainPage,htmlFilmes,htmlUsers,htmlProf};
