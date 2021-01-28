async function getProf(){
    return new Promise((resolve,reject)=>{
        fetch('/prof/getProf',{method : 'get'})
            .then(res=>res.json())
            .then(data => resolve(data))
            .catch((reject)=>{
                console.log(reject)
            });
	})
}

async function getProfByName(){
    return new Promise((resolve,reject)=>{
        fetch('/prof/getProf/name',{method : 'get'})
            .then(res=>res.json())
            .then(data => resolve(data))
            .catch((reject)=>{
                console.log(reject)
            });
	})
}

async function getProfById(id){
    return await new Promise((resolve,reject)=>{
        fetch('/prof/getProfById/'+id,{method : 'get'})
            .then(res=>res.json())
            .then(data => resolve(data))
            .catch((reject)=>{
                console.log(reject)
            });
	})
}

async function inserirProf(nome){
    return await new Promise((resolve,reject)=>{
        fetch('/prof/addProf', {
            method:'post',
            body: JSON.stringify({
                nome:nome
            }),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then(res=>res.json())
        .then(data => resolve(data))  
	});
}

async function updateProf(id,nome){
    return await new Promise((resolve,reject)=>{
        fetch('/prof/updateProf', {
            method:'post',
            body: JSON.stringify({
                id:id,
                nome:nome
            }),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then(res=>res.json())
        .then(data => resolve(data))  
	});
}

async function deleteProf(id){
    return await new Promise((resolve,reject)=>{
        fetch('/prof/apagarProf', {
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

function tableProfMain(profs){
    let out = '<table id="profs-tblprofs" class="content-table-profs">'+
                    '<thead>'+
                    '<tr>'+
                        '<th width="125px">&nbsp;&nbsp;ID</th>'+
                        '<th width="145px">Nome</th>'+
                        '<th width="30px"></th>'+
                    '</tr>'+
                    '</thead>'+
                '<tbody id="tableData">'
    profs.forEach(prof=>{
        out = out + 
            '<tr id="'+prof.id+'" class="tblprofs-tr">'+
                '<td width="130px">&nbsp;&nbsp;'+prof.id+'</td>'+
                '<td width="150px">'+prof.nome+'</td>'+
                '<td class="btn-tbl-delete" width="30px"><a href="javascript:openDeleteProf('+prof.id+')"><img src="./adminimg/trash.png" width="15px"></a></td>'
            '</tr>';
    });
    out = out + '</tbody></table>'+
        '<div class="aside-filme">'+
        '<div><input id="prof-searchbox" type="text" placeholder="Filtrar Titulo Original..."></input>'+
        '<button class="table-buttons" onclick="javascript:openInserirProf()"><img src="./adminimg/add.png" width="15px"></button></div>'+
        // '<div id="user-btn-spacer">&nbsp;</div>'+
        '<div id="aside-prof-detalhes-box" class="aside-prof-detalhes">'+
        '</div>'
    return out;
}

function tableProfMainChkbox(profs,app){
    let lnk;
    switch (app){
		case "realizador":
            lnk ="closeInserirRealizador";
            break;
        case "actor":
            lnk ="closeInserirActor";
            break;   
	}
    let out = '<div class="tbl-prof-modal"><table id="profs-tblprofs" class="content-table-profs">'+
                    '<thead>'+
                    '<tr>'+
                        '<th width="125px">&nbsp;&nbsp;ID</th>'+
                        '<th width="145px">Nome</th>'+
                        '<th width="30px"></th>'+
                    '</tr>'+
                    '</thead>'+
                '<tbody id="tableData">'
    profs.forEach(prof=>{
        out = out + 
            '<tr id="'+prof.nome+'" class="tblprofs-tr">'+
                '<td width="130px">&nbsp;&nbsp;'+prof.id+'</td>'+
                '<td width="150px">'+prof.nome+'</td>'+
                '<td class="" width="30px"></td>'
            '</tr>';
    });
    out = out + '</tbody></table>'+
        '<div class="aside-filme">'+
        '<div class="tbl-side-functions"><input id="prof-searchbox" type="text" placeholder="Procurar..."></input></div>'+
        '<div id="aside-prof-detalhes-box" class="aside-prof-detalhes"><textbox id="tb-prof-out"></textbox></div>'+
        '<div class="tbl-prof-div-inserir"><a href="javascript:'+lnk+'()" class="btn-neutral">Inserir</a></div>'+
        '</div>'
    return out;
}

function updateTableProfMain(profs){
    let out = '<tbody id="tableData">'
    profs.forEach(prof=>{
        out = out + 
        '<tr id="'+prof.id+'" class="tblprofs-tr">'+
            '<td width="130px">&nbsp;&nbsp;'+prof.id+'</td>'+
            '<td width="150px">'+prof.nome+'</td>'+
            '<td class="btn-tbl-delete" width="30px"><a href="javascript:openDeleteProf('+prof.id+')"><img src="./adminimg/trash.png" width="15px"></a></td>'
        '</tr>';
    });
    return out;
}

async function tableProfDetalhes(id){
    const prof = await getProfById(id);
    var out = '<table class="tbl-prof">'+
            '<tr>'+
                '<td><label>ID</label></td>'+
                '<td><label id="lbl-prof-id">'+prof.id+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Nome</label></td>'+
                '<td><input type="text" id="in-prof-nome" value="'+prof.nome+'"></input></td>'+
            '</tr>'+
            '<tr><td>&nbsp;</td></tr></table>'

    out = out + '<div>&nbsp;</div>'+'<script>const out = document.getElementById("in-pro-nome").value</script>'+
    '<div><a href="javascript:updateProf()" class="btn-bad">Update Profissional</a><label id="lbl-prof-out"></label></div>'
    return out;
}

function tableProfDetalhesInserir(){
    var out = '<table class="tbl-prof">'+
            '<tr>'+
                '<td><label>ID</label></td>'+
                '<td><label id="lbl-prof-id"></label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Nome</label></td>'+
                '<td><input type="text" id="in-prof-nome" value=""></input></td>'+
            '</tr>'+
            '<tr><td>&nbsp;</td></tr></table>'

    out = out + '<div>&nbsp;</div>'+'<script>const out = document.getElementById("in-pro-nome").value</script>'+
    '<div><a href="javascript:inserirProf()" class="btn-bad">Inserir Profissional</a><label id="lbl-prof-out"></label></div>'
    return out;
}


function htmlPopDeleteProf(id){
    var out =   '<div class="modal-header">'+
                    '<div id="modal-title" class="title">Apagar Utilizador</div>'+
                    '<button class="close-button" onclick="closeModalWindow()">&times;</button>'+
                '</div>'+
                '<div id="modal-body" class="modal-body">'+
                    '<div>'+
                        '<h4>Tem a Certeza que deseja apagar o ID '+id+'?</h4>'+
                    '</div>'+
                    '<div>&nbsp;</div>'+
                    '<div>'+
                        '<a class="btn-neutral" href="javascript:runDeleteProf('+id+')">Continuar</a><a class="btn-neutral" href="javascript:closeModalWindow()">Cancelar</a>'+
                    '</div>'+
                '</div>'
    return out;
}

function htmlPopMsg(title,msg){
    var out =   '<div class="modal-header">'+
                    '<div id="modal-title" class="title">'+title+'</div>'+
                    '<button data-close-button class="close-button" onclick="closeModalWindow()">&times;</button>'+
                '</div>'+
                '<div id="modal-body" class="modal-body">'+
                    '<div>'+
                        '<h4>'+msg+'</h4>'+
                    '</div>'+
                    '<div>&nbsp;</div>'+
                    '<div>'+
                        '<a class="btn-neutral" href="javascript:closeModalWindow()">Sair</a>'+
                    '</div>'+
                '</div>'
    return out;
}

export {getProf,tableProfMain,tableProfDetalhes,updateProf,updateTableProfMain,tableProfDetalhesInserir,inserirProf,htmlPopDeleteProf,htmlPopMsg,deleteProf,tableProfMainChkbox,getProfByName}