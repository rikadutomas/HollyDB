import * as MODAL from '../adminjs/modal.js';

function tableFilmesMain(filmes){
    let out = '<table id="filmes-tblfilmes" class="content-table">'+
                    '<thead>'+
                    '<tr>'+
                        '<th width="60px" id="tbl-filme-id">ID</th>'+
                        '<th width="200px">Titulo Original</th>'+
                        '<th width="200px">Tutulo PT</th>'+
                        '<th width="50px" id="tbl-filme-ano">Ano</th>'+
                        '<th width="200px">Genero</th>'+
                        '<th width="50px" id="tbl-filme-duracao">Duração</th>'+
                        '<th width="80px" id="tbl-filme-butoes"></th>'+
                        '<th width="15px"></th>'+
                    '</tr>'+
                    '</thead>'+
                '<tbody id="tableData">'
    filmes.forEach(filme=>{
        out = out + 
            ('<tr id="'+filme.id+'" '+filme.titulo+' class="tblfilmes-tr '+stateClass(filme.active)+'"><td width="60px">&nbsp;&nbsp;<img src="'+stateImg(filme.active)+'" width="12px">&nbsp;&nbsp;'+filme.id+
            '</td><td width="200px">'+filme.titulo+
            '</td><td width="200px">'+filme.titulopt+
            '</td><td width="50px" id="tbl-filme-ano">'+filme.ano+
            '</td><td width="200px">'+filme.genero+
            '</td><td width="50px" id="tbl-filme-duracao">'+duracaoFilme(filme.duracao)+
            '</td><td width="80px" id="tbl-filme-butoes">'+
                '<button type="button" onclick="javascript:openFilmeDetalhes('+ filme.id +')"><img src="./adminimg/edit.svg" width="15px"></button>'+
            '</td></tr>');
    });
    out = out + '</tbody></table>'+
        '<div class="aside-filme">'+
        '<div><input id="prof-searchbox" type="text" placeholder="Filtrar Titulo Original..."></input><button class="table-buttons" onclick="javascript:openCreateFilme()"><img src="./adminimg/add.png" width="15px"></button><button id="btn-filter-active" class="active" onclick="javascript:toggleViewActiveFilms()"><img src="./adminimg/true.png" width="15px"></button></div>'+
        '<div id="aside-filme-detalhes-box" class="aside-filme-detalhes">'+
        '</div>'


    return out;
}

function updateTableFilmesMain(filmes){
    let out = ''
    filmes.forEach(filme=>{
        out = out + 
            ('<tr id="'+filme.id+'" '+filme.titulo+' class="tblfilmes-tr '+stateClass(filme.active)+'"><td width="60px">&nbsp;&nbsp;<img src="'+stateImg(filme.active)+'" width="12px">&nbsp;&nbsp;'+filme.id+
            '</td><td width="200px">'+filme.titulo+
            '</td><td width="200px">'+filme.titulopt+
            '</td><td width="50px" id="tbl-filme-ano">'+filme.ano+
            '</td><td width="200px">'+filme.genero+
            '</td><td width="50px" id="tbl-filme-duracao">'+duracaoFilme(filme.duracao)+
            '</td><td width="80px" id="tbl-filme-butoes">'+
                '<button type="button" onclick="javascript:openFilmeDetalhes('+ filme.id +')"><img src="./adminimg/edit.svg" width="15px"></button>'+
            '</td></tr></tbody>');
    });


    return out;
}

async function tableFilmesDetalhes(id){
    const filme = await getFilmeById(id);
    let state;
    if(filme.active){
        state = 'Desactivar'
    }else{
        state = 'Activar'
    }
    const out = '<table>'+
            '<tr>'+
                '<td><label>Filme ID</label></td>'+
                '<td><label>'+filme.id+'</label></td><td width="60px">&nbsp;&nbsp;<img id="img-detalhes-state" src="'+stateImg(filme.active)+'" width="12px"></td>'+
                '<div class="aside-buttons-group"><button class="table-buttons" id="btn-filme-state" onclick="changeFilmeState('+filme.id+','+filme.active+')">'+state+'</button>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Titulo Original</label></td>'+
                '<td><label>'+filme.titulo+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Titulo Portugues</label></td>'+
                '<td><label>'+filme.titulopt+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Ano</label></td>'+
                '<td><label>'+filme.ano+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Faixa Etaria</label></td>'+
                '<td><label>'+filme.etaria+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Genero</label></td>'+
                '<td><label>'+filme.genero+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Duracao</label></td>'+
                '<td><label>'+duracaoFilme(filme.duracao)+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Realizador</label></td>'+
                '<td><label>'+filme.realizador+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Actor</label></td>'+
                '<td><label>'+filme.actor+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Sinopse</label></td>'+
                '<td><label>'+filme.sinopse+'</label></td>'+
            '</tr>'+
            '<tr>'+
            '<td><label>Capa</label></td>'+
            '<td><div id="aside-filme-detalhes-imagem">'+
                '<img src="'+filme.cover+'" width="80px">'+
                '<div class="aside-buttons-group"><button class="table-buttons" onclick="openFilmeDetalhes('+filme.id+')">Editar</button>'+
                '<button class="table-buttons bad" onclick="popDeleteFilme('+filme.id+')">Remover Filme da DB</button></div>'+
                '</div></td>'+
            '</tr>'+
        '</table>'
    return out;
}

function htmlFormFilmesDetalhes(filme){
    return `<div id="form-filmes-main">
                <form id="form-filmes-detalhes" action="">
                    <div class="form-filmes-section1">
                        <table >
                            <tr>
                                <td><label for="">Filme ID</label></td>
                                <td><div class="in-textbox txt-large"><label id="label-filme-id">${filme.id}</label></div></td>
                            </tr>
                            <tr>
                                <td><label for="input-filme-titulo">Titulo Original</label></td>
                                <td><input type="text" id="input-filme-titulo" value="${filme.titulo}"></input></td>
                            </tr>
                            <tr>
                                <td><label for="input-filme-titulopt">Titulo Portugues</label></td>
                                <td><input type="text"id="input-filme-titulopt" value="${filme.titulopt}"></input></td>
                            </tr>
                            <tr>
                                <td><label for="input-filme-ano">Ano</label></td>
                                <td id="div-in-ano"><div><input type="text" id="input-filme-ano" value="${filme.ano}"></input></div><div id="div-lbl-ano"></div></td>
                            </tr>
                            <tr>
                                <td><label for="input-filme-etaria">Faixa Etaria</label></td>
                                <td><select type="text" id="input-filme-etaria">
                                    <option class="sel-etaria" value="M/6">M/6&nbsp;&nbsp;&nbsp;&nbsp;</option>
                                    <option class="sel-etaria" value="M/12">M/12&nbsp;&nbsp;&nbsp;&nbsp;</option>
                                    <option class="sel-etaria" value="M/16">M/16&nbsp;&nbsp;&nbsp;&nbsp;</option>
                                    <option class="sel-etaria" value="M/18">M/18&nbsp;&nbsp;&nbsp;&nbsp;</option>
                                </select></td>
                            </tr>
                        </table>
                    </div>
                    <div class="filmes-form-genero">
                        <div>
                            <label for="input-filme-titulo">Genero</label>
                        </div>
                        <table>
                            <tr>
                                <td><input type="checkbox" class="chk-genero" name="Accao" value="Accao" tabindex="1">  Accao</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Animacao" value="Animacao" tabindex="2">  Animacao</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Aventura" value="Aventura" tabindex="3">  Aventura</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Biografia" value="Biografia" tabindex="4">  Biografia</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Comedia" value="Comedia" tabindex="5">  Comedia</input></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" class="chk-genero" name="Crime" value="Crime" tabindex="6">  Crime</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Documentario" value="Documentario" tabindex="7">  Documentario</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Drama" value="Drama" tabindex="8">  Drama</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Familia" value="Familia" tabindex="9">  Familia</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Fantasia" value="Fantasia" tabindex="10">  Fantasia</input></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" class="chk-genero" name="Ficcao Cientifica" value="Ficcao Cientifica" tabindex="11">  Ficcao Cientifica</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Guerra" value="Guerra" tabindex="12">  Guerra</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Historia" value="Historia" tabindex="13">  Historia</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Misterio" value="Misterio" tabindex="14">  Misterio</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Musical" value="Musical" tabindex="15">  Musical</input></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" class="chk-genero" name="Romance" value="Romance" tabindex="16">  Romance</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Suspense" value="Suspense" tabindex="17">  Suspense</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Terror" value="Terror" tabindex="18">  Terror</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Thriller" value="Thriller" tabindex="19">  Thriller</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Western" value="Western" tabindex="20">  Western</input></td>
                            </tr>
                        </table>
                    </div>       
                    <div class="form-filmes-section2">
                        <table>
                        <tr>
                            <td><label for="input-filme-duracao">Duracao (min)</label></td>
                            <td id="div-in-duracao"><div id=""><input type="text" id="input-filme-duracao" value="${filme.duracao}"></input></div><span>&nbsp;&nbsp;</span><div id="div-lbl-duracao"><label id="lbl-duracao">${duracaoFilme(filme.duracao)}</label></div></td>
                        </tr>
                        <tr>
                            <td class="td-vertical-top"><label for="input-filme-realizador">Realizador</label></td>
                            <td class="in-a-float"><textbox class="in-textbox in-text-area-short txt-low" id="input-filme-realizador" value="">${filme.realizador}</textbox><div><a class="btn-neutral" href="javascript:popInserirRealizador()">Inserir</a></div></td>
                        </tr>
                        <tr>
                            <td class="td-vertical-top"><label for="input-filme-actor">Actores</label></td>
                            <td class="in-a-float"><textbox class="in-textbox in-text-area-short txt-high" id="input-filme-actor" rows="4" >${filme.actor}</textbox><div><a class="btn-neutral" href="javascript:popInserirActor()">Inserir</a></div></td>
                        </tr>
                        <tr>
                            <td class="td-vertical-top"><label for="input-filme-sinopse">Sinopse</label></td>
                            <td><textarea id="input-filme-sinopse" rows="4" >${filme.sinopse}</textarea></td>
                        </tr>
                        </table>
                    </div>
                    <div class="form-filmes-section3">
                        <table>
                        <tr>
                            <td><label for="input-filme-video">Video URL</label></td>
                            <td><input type="text"id="input-filme-video" value="${filme.video}"></input></td>
                        </tr>
                        <tr>
                            <td><label for="input-filme-cover">Capa</label></td>
                            <td><input type="text" id="input-filme-cover" value="${filme.cover}"></input></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td class="td-vertical-top" colspan="2">
                                <div class="td-photo-section">
                                    <img id="img-snippet" src="${filme.cover}">
                                </div>
                            </td>
                        </tr>
                        </table>
                    </div>
                    <div></div>
                    <div class="form-filmes-section4">
                        <a href="javascript:loadFilmesMain()" class="btn-neutral">Voltar</a>
                        <a href="javascript:updateFilmeDetails()" class="btn-bad">Actualizar BD</a>
                    </div>
                </form>
            </div>`
}


async function filmeData(){
    let id = document.getElementById('label-filme-id').textContent;
    const titulo = document.getElementById('input-filme-titulo').value;
    const titulopt = document.getElementById('input-filme-titulopt').value;
    const ano = document.getElementById('input-filme-ano').value;
    const etaria = document.getElementById('input-filme-etaria').value;
    const duracao = document.getElementById('input-filme-duracao').value;
    const realizador = document.getElementById('input-filme-realizador').textContent;
    const actor = document.getElementById('input-filme-actor').textContent;
    const sinopse = document.getElementById('input-filme-sinopse').value;
    const video = document.getElementById('input-filme-video').value;
    const cover = document.getElementById('input-filme-cover').value;
    console.log(sinopse)
    const chk = document.getElementsByClassName('chk-genero');
    let genero = ''; 
    for(let x=0;x<chk.length;x++){
		if(chk[x].checked){
			genero = genero + chk[x].value + ';';
		}
	}

    if(id==0){
        const max = await getMax();
        id = max[0].id + 1
    }
    // const max = await getMax()
    // console.log(max[0].id)
    

    const filmeData = {
        id:parseInt(id),
        titulo:titulo,
        titulopt:titulopt,
        ano:parseInt(ano),
        etaria:etaria,
        genero:genero,
        duracao:parseInt(duracao),
        realizador:realizador,
        actor:actor,
        sinopse:sinopse,
        video:video,
        cover:cover
    }

    return filmeData;
}

async function updateFilm(filme){
    return new Promise((resolve,reject)=>{
        fetch('/filmes/updateFilme', {
            method:'post',
            body: JSON.stringify(filme),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then(res=>res.json())
        .then(data => resolve(data))  
	});
}

async function insertFilme(filme){
    return new Promise((resolve,reject)=>{
        fetch('/filmes/inserirFilme', {
            method:'post',
            body: JSON.stringify(filme),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then(res=>res.json())
        .then(data => resolve(data))  
	});
}

async function getMax(){
    return new Promise((resolve,reject)=>{
        fetch('/filmes/getMax',{method : 'get'})
            .then(res=>res.json())
            .then(data => resolve(data))
            .catch((reject)=>{
                console.log(reject)
            });
	})
}



async function getFilmes(){
    return new Promise((resolve,reject)=>{
        fetch('/filmes/getFilmes',{method : 'get'})
            .then(res=>res.json())
            .then(data => resolve(data))
            .catch((reject)=>{
                console.log(reject)
            });
	})
}

async function getFilmesFilter(fld,str){
    return new Promise((resolve,reject)=>{
        fetch('/filmes/getFilmesFilter', {
            method:'post',
            body: JSON.stringify({
                fld:fld,
                str:str
            }),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then(res=>res.json())
        .then(data => resolve(data))  
	});
}

async function getFilmeById(id){
    return await new Promise((resolve,reject)=>{
        fetch('/filmes/getFilmeById/'+id,{method : 'get'})
            .then(res=>res.json())
            .then(data => resolve(data))
            .catch(reject =>console.log(reject));
	})
}

async function deleteFilme(id){
    return new Promise((resolve,reject)=>{
        fetch('/filmes/deleteFilme', {
            method:'post',
            body: JSON.stringify({
                id:id
            }),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then(res=>res.json())
        .then(data => resolve(data))  
	});
}

async function filmeState(id,state){
    return new Promise((resolve,reject)=>{
        fetch('/filmes/changeFilmeState', {
            method:'post',
            body: JSON.stringify({
                id:id,
                state:state
            }),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then(res=>res.json())
        .then(data => resolve(data))  
	});
}


function duracaoFilme(num){
    let hours = (num / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    if (rminutes < 10){
        rminutes = '0' + rminutes;
    }
    return rhours + "h" + rminutes + "m";
}

function stateImg(state){
    if(state){
        return "./adminimg/true.png"
    }else{
        return "./adminimg/false.png"
    }
}

function stateClass(state){
    if(state){
        return ''
    }else{
        return 'tbl-filme-activo-false'
    }
}

function htmlFormFilmesDetalhesInserir(){
    return `<div id="form-filmes-main">
                <form id="form-filmes-detalhes" action="">
                    <div class="form-filmes-section1">
                        <table >
                            <tr>
                                <td><label for="">Filme ID</label></td>
                                <td><div class="in-textbox txt-large in-locked-blue"><label id="label-filme-id">&nbsp;</label></div></td>
                            </tr>
                            <tr>
                                <td><label for="input-filme-titulo">Titulo Original</label></td>
                                <td><input type="text" id="input-filme-titulo" value=""></input></td>
                            </tr>
                            <tr>
                                <td><label for="input-filme-titulopt">Titulo Portugues</label></td>
                                <td><input type="text"id="input-filme-titulopt" value=""></input></td>
                            </tr>
                            <tr>
                                <td><label for="input-filme-ano">Ano</label></td>
                                <td id="div-in-ano"><div><input type="text" id="input-filme-ano" value=""></input></div><div id="div-lbl-ano"></div></td>
                            </tr>
                            <tr>
                                <td><label for="input-filme-etaria">Faixa Etaria</label></td>
                                <td><select type="text" id="input-filme-etaria">
                                    <option class="sel-etaria" value="M/6">M/6&nbsp;&nbsp;&nbsp;&nbsp;</option>
                                    <option class="sel-etaria" value="M/12">M/12&nbsp;&nbsp;&nbsp;&nbsp;</option>
                                    <option class="sel-etaria" value="M/16">M/16&nbsp;&nbsp;&nbsp;&nbsp;</option>
                                    <option class="sel-etaria" value="M/18">M/18&nbsp;&nbsp;&nbsp;&nbsp;</option>
                                </select></td>
                            </tr>
                        </table>
                    </div>
                    <div class="filmes-form-genero">
                        <div>
                            <label for="input-filme-titulo">Genero</label>
                        </div>
                        <table>
                            <tr>
                                <td><input type="checkbox" class="chk-genero" name="Accao" value="Accao" tabindex="1">  Accao</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Animacao" value="Animacao" tabindex="2">  Animacao</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Aventura" value="Aventura" tabindex="3">  Aventura</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Biografia" value="Biografia" tabindex="4">  Biografia</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Comedia" value="Comedia" tabindex="5">  Comedia</input></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" class="chk-genero" name="Crime" value="Crime" tabindex="6">  Crime</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Documentario" value="Documentario" tabindex="7">  Documentario</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Drama" value="Drama" tabindex="8">  Drama</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Familia" value="Familia" tabindex="9">  Familia</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Fantasia" value="Fantasia" tabindex="10">  Fantasia</input></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" class="chk-genero" name="Ficcao Cientifica" value="Ficcao Cientifica" tabindex="11">  Ficcao Cientifica</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Guerra" value="Guerra" tabindex="12">  Guerra</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Historia" value="Historia" tabindex="13">  Historia</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Misterio" value="Misterio" tabindex="14">  Misterio</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Musical" value="Musical" tabindex="15">  Musical</input></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" class="chk-genero" name="Romance" value="Romance" tabindex="16">  Romance</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Suspense" value="Suspense" tabindex="17">  Suspense</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Terror" value="Terror" tabindex="18">  Terror</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Thriller" value="Thriller" tabindex="19">  Thriller</input></td>
                                <td><input type="checkbox" class="chk-genero" name="Western" value="Western" tabindex="20">  Western</input></td>
                            </tr>
                        </table>
                    </div>       
                    <div class="form-filmes-section2">
                        <table>
                        <tr>
                            <td><label for="input-filme-duracao">Duracao (min)</label></td>
                            <td id="div-in-duracao"><div id=""><input type="text" id="input-filme-duracao" value=""></input></div><span>&nbsp;&nbsp;</span><div id="div-lbl-duracao"><label id="lbl-duracao"></label></div></td>
                        </tr>
                        <tr>
                            <td class="td-vertical-top"><label for="input-filme-realizador">Realizador</label></td>
                            <td class="in-a-float"><textbox class="in-textbox in-text-area-short txt-low in-locked-blue" id="input-filme-realizador" value=""></textbox><div><a class="btn-neutral" href="javascript:popInserirRealizador()">Inserir</a></div></td>
                        </tr>
                        <tr>
                            <td class="td-vertical-top"><label for="input-filme-actor">Actores</label></td>
                            <td class="in-a-float"><textbox class="in-textbox in-text-area-short txt-high in-locked-blue" id="input-filme-actor" rows="4" ></textbox><div><a class="btn-neutral" href="javascript:popInserirActor()">Inserir</a></div></td>
                        </tr>
                        <tr>
                            <td class="td-vertical-top"><label for="input-filme-sinopse">Sinopse</label></td>
                            <td><textarea id="input-filme-sinopse" rows="4" ></textarea></td>
                        </tr>
                        </table>
                    </div>
                    <div class="form-filmes-section3">
                        <table>
                        <tr>
                            <td><label for="input-filme-video">Video URL</label></td>
                            <td><input type="text"id="input-filme-video" value=""></input></td>
                        </tr>
                        <tr>
                            <td><label for="input-filme-cover">Capa</label></td>
                            <td><input type="text"id="input-filme-cover"></input></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td class="td-vertical-top" colspan="2">
                                <div class="td-photo-section">
                                    <img id="img-snippet" src="">
                                </div>
                            </td>
                        </tr>
                        </table>
                    </div>
                    <div></div>
                    <div class="form-filmes-section4">
                        <a href="javascript:loadFilmesMain()" class="btn-bad">Cancelar</a>
                        <a href="javascript:inserirFilme()" class="btn-good">Submeter</a>
                    </div>
                </form>
            </div>`
}

function htmlPopUpdateFilme(){
    var out =   '<div class="modal-header">'+
                    '<div id="modal-title" class="title">Alterar Dados Filme</div>'+
                    '<button data-close-button class="close-button" onclick="javascript:closeModalWindow()">&times;</button>'+
                '</div>'+
                '<div id="modal-body" class="modal-body">'+
                    '<div>'+
                        '<h4>Tem a Certeza que deseja Alterar os dados do filme?</h4>'+
                    '</div>'+
                    '<div>&nbsp;</div>'+
                    '<div>'+
                        '<a class="btn-neutral" href="javascript:runUpdateFilmeDetails()">Continuar</a><a class="btn-neutral" href="javascript:closeModalWindow()">Cancelar</a>'+
                    '</div>'+
                '</div>'
    return out;
}

function htmlPopUpdateFilmeResult(msg){
    var out =   '<div class="modal-header">'+
                    '<div id="modal-title" class="title">Alterar Dados Filme</div>'+
                    '<button data-close-button class="close-button" onclick="javascript:closeModalWindow()">&times;</button>'+
                '</div>'+
                '<div id="modal-body" class="modal-body">'+
                    '<div>'+
                        msg+
                    '</div>'+
                    '<div>&nbsp;</div>'+
                    '<div>'+
                        '<a class="btn-neutral" href="javascript:closeModalWindow()">Fechar</a>'+
                    '</div>'+
                '</div>'
    return out;
}

function htmlPopDeleteFilme(id){
    var out =   '<div class="modal-header">'+
                    '<div id="modal-title" class="title">Apagar Filme</div>'+
                    '<button class="close-button" onclick="javascript:closeModalWindow()">&times;</button>'+
                '</div>'+
                '<div id="modal-body" class="modal-body">'+
                    '<div>'+
                        '<h4>Tem a Certeza que deseja apagar o filme?</h4>'+
                    '</div>'+
                    '<div>&nbsp;</div>'+
                    '<div>'+
                        '<a class="btn-neutral" href="javascript:submitDeleteFilme('+id+')">Continuar</a><a class="btn-neutral" href="javascript:closeModalWindow()">Cancelar</a>'+
                    '</div>'+
                '</div>'
    return out;
}

export {
    htmlPopDeleteFilme,
    deleteFilme,
    tableFilmesMain,
    tableFilmesDetalhes,
    htmlFormFilmesDetalhes,
    getFilmes,
    getFilmeById,
    getFilmesFilter,
    htmlFormFilmesDetalhesInserir,
    filmeData,duracaoFilme,
    updateFilm,
    htmlPopUpdateFilme,
    htmlPopUpdateFilmeResult,
    getMax,
    insertFilme,
    filmeState,
    updateTableFilmesMain
}