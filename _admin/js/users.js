import * as FILMES from '../adminjs/filmes.js';
async function getUsers(){
    return new Promise((resolve,reject)=>{
        fetch('/users/getUsers',{method : 'get'})
            .then(res=>res.json())
            .then(data => resolve(data))
            .catch((reject)=>{
                console.log(reject)
            });
	})
}

function tableUsersMain(users){
    let out = '<table id="filmes-tblfilmes" class="content-table-users">'+
                    '<thead>'+
                    '<tr>'+
                        '<th width="125px">&nbsp;&nbsp;ID</th>'+
                        '<th width="145px">Nome</th>'+
                        '<th width="200px">Email</th>'+
                        '<th width="85px">Role</th>'+
                        '<th width="85px">Registration</th>'+
                        '<th width="70px">Valid</th>'+
                        // '<th width="100px"></th>'+
                    '</tr>'+
                    '</thead>'+
                '<tbody id="tableData">'
    users.forEach(user=>{
        let userId = user._id;
        out = out + 
            ('<tr id="'+user.id+'" class="tblfilmes-tr '+stateClass(user.active)+'">'+
            '<td width="130px">&nbsp;&nbsp;'+user.id+
            '</td><td width="150px">'+user.nome+
            '</td><td width="200px">'+user.email+
            '</td><td width="90px">'+user.role+
            '</td><td width="90px">'+formatDate(user.regdate)+
            '</td><td width="50px">'+user.validation+
            '</tr>');
    });
    out = out + '</tbody></table>'+
        '<div class="aside-filme">'+
        '<div><input id="prof-searchbox" type="text" placeholder="Filtrar Email..."></input>'+
        '<button class="table-buttons" onclick="javascript:inserirAdminUser()">ADICIONAR ADMIN</button></div>'+
        // '<div id="user-btn-spacer">&nbsp;</div>'+
        '<div id="aside-filme-detalhes-box" class="aside-filme-detalhes">'+
        '</div>'


    return out;
}

async function tableUserDetalhes(id){
    console.log(id);
    const user = await getUserById(id);
    const favoritos = user.favoritos;
    var out = '<table>'+
            '<tr>'+
                '<td><label>User ID</label></td>'+
                '<td><label>'+user.id+'</label></td>'+
                // '<td><label>'+user.active+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Nome</label></td>'+
                '<td><label>'+user.nome+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Email</label></td>'+
                '<td><label>'+user.email+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Role</label></td>'+
                '<td><label>'+user.role+'</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Validacao</label></td>'+
                '<td><label>'+user.validation+'</label></td>'+
            '</tr>'+
            '<tr><td>&nbsp;</td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Favoritos</label></td>';
    if(favoritos.length<1){
        out = out + '<td><label>Nao tem Favoritos Associados</label></td>'+
        '</tr></table>'+
        '<div id="user-fav-spacer">&nbsp;</div>';
    }else{
        out = out + '<td><label>'+favoritos.length+'</label></td></tr></table>'+
                    '<div id="tbl-user-detalhes-favoritos-hd"><table><thead>'+
                    '<tr>'+
                    '<th width="37px">ID</th><th width="195px">Titulo</th><th width="40px"></th></tr></thead></table></div>'+
                    '<div id="tbl-user-detalhes-favoritos-bd"><table><tbody>'

        for (let i=0;i<favoritos.length;i++){
            let filme = await FILMES.getFilmeById(favoritos[i]);
            out = out + '<tr><td width="45px"><label>'+filme.id+'</label></td><td width="235px"><label>'+filme.titulopt+'</label></td><td class="tbl-del-container"width="25px"><a href=""><img src="../adminimg/trash.png" width="15px"></a></td></tr>';
        }
        out = out + '</tbody></table></div>'
        
    }

    out = out + '<div>&nbsp;</div>'+
    '<div><a href="javascript:terminarUser('+id+')" class="btn-bad">Terminar User</a></div>'
    
    return out;
}

async function getUserById(id){
    return await new Promise((resolve,reject)=>{
        fetch('/users/getUserById', {
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

async function inserirAdmin(nome,email){
    return await new Promise((resolve,reject)=>{
        fetch('/users/addAdmin', {
            method:'post',
            body: JSON.stringify({
                nome:nome,
                email:email
            }),
            headers: {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then(res=>res.json())
        .then(data => resolve(data))  
	});
}

async function terminarUser(id){
    return await new Promise((resolve,reject)=>{
        fetch('/users/adminTerminarUser', {
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

function htmlPopDeleteUser(id){
    var out =   '<div class="modal-header">'+
                    '<div id="modal-title" class="title">Apagar Profissional</div>'+
                    '<button class="close-button" onclick="closeModalWindow()">&times;</button>'+
                '</div>'+
                '<div id="modal-body" class="modal-body">'+
                    '<div>'+
                        '<h4>Tem a Certeza que deseja apagar o ID '+id+'?</h4>'+
                    '</div>'+
                    '<div>&nbsp;</div>'+
                    '<div>'+
                        '<a class="btn-neutral" href="javascript:submeterTerminarUser('+id+')">Continuar</a><a class="btn-neutral" href="javascript:closeModalWindow()">Cancelar</a>'+
                    '</div>'+
                '</div>'
    return out;
}

function htmlInserirAdmin(msg){
    var out =   '<div class="modal-header">'+
                    '<div id="modal-title" class="title">Adicionar Utilizador Admin</div>'+
                    '<button data-close-button class="close-button" onclick="closeModalWindow()">&times;</button>'+
                '</div>'+
                '<div id="modal-body" class="modal-body">'+
                    '<div>'+
                        msg+
                    '</div>'+
                    '<div>&nbsp;</div>'+
                    '<div>'+
                        '<a class="btn-neutral" href="javascript:closeModalWindow()">Sair</a>'+
                    '</div>'+
                '</div>'
    return out;
}



function tableInserirUserAdmin(){
    var out = '<table>'+
            '<tr>'+
                '<td><label>Nome</label></td>'+
                '<td><input id="admin-nome"></input></td>'+
            '</tr>'+
            '<tr>'+
                '<td><label>Email</label></td>'+
                '<td><input id="admin-email"></input></td>'+
            '</tr>'+
            '<tr>'+
                '<td><div>&nbsp;</div></td>'+
            '</tr>'+
            '<tr>'+
                '<td><a href="javascript:submitInserirAdminUser()" class="btn-good">Adicionar Admin</a></td>'+
            '</tr>'

    out = out + '</table></div>'
    
    return out;
};

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

function formatDate(str){
    return str.substring(0,10);
}
export {getUsers,tableUsersMain,tableUserDetalhes,inserirAdmin,tableInserirUserAdmin,htmlInserirAdmin,terminarUser,htmlPopDeleteUser}