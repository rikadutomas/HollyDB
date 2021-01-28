import * as LOGIN from '../adminjs/login.js';
import * as ADMIN from '../adminjs/admin.js';
import * as FILMES from '../adminjs/filmes.js';
import * as USERS from '../adminjs/users.js';
import * as PROF from '../adminjs/prof.js';

const name = document.getElementById('uname')
const password = document.getElementById('psw')
const form = document.getElementById('flogin')
const errorElement = document.getElementById('errmsg')
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');
const currentYear = new Date().getFullYear()
var hsh = '';

var filterState = false;

// =======================FILMES===========================================
window.loadFilmesMain = async () => {
	document.getElementById('container').innerHTML = ADMIN.htmlFilmes();
	const filmes = await FILMES.getFilmes()
	document.getElementById('content-main').innerHTML = FILMES.tableFilmesMain(filmes);

	window.tblFilmesEventListener=()=> {
		var btnContainer = document.getElementById('filmes-tblfilmes');
		var btns = btnContainer.getElementsByClassName('tblfilmes-tr');
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener('click', function () {
				var current = document.getElementsByClassName('active');
				if (current.length > 0) {
					current[0].className = current[0].className.replace(' active', '');
				}
				this.className += ' active';
				updateTableFilmesDetalhes(this.id);
			});
			btns[i].addEventListener('dblclick', function () {
				var current = document.getElementsByClassName('active');
				if (current.length > 0) {
					current[0].className = current[0].className.replace(' active', '');
				}
				this.className += ' active';
				openFilmeDetalhes(this.id);
			});
		}

	}

	tblFilmesEventListener()

	window.updateTableFilmesDetalhes = async (id) => {
		const out = await FILMES.tableFilmesDetalhes(id);
		document.getElementById('aside-filme-detalhes-box').innerHTML = out;
	}

	window.toggleViewActiveFilms = async () => {
		if (!filterState) {
			filterState = true;
			const filmes = await FILMES.getFilmesFilter('active', true);
			console.log(filmes);
			document.getElementById('content-main').innerHTML = FILMES.tableFilmesMain(filmes);
			tblFilmesEventListener()
			document.getElementById('btn-filter-active').classList.remove('active');
		} else {
			filterState = false;
			const filmes = await FILMES.getFilmes()
			document.getElementById('content-main').innerHTML = FILMES.tableFilmesMain(filmes);
			tblFilmesEventListener()
			document.getElementById('btn-filter-active').classList.add('active');
		}
	}
	const btnContainer = document.getElementById('filmes-tblfilmes');
	const btns = btnContainer.getElementsByClassName('tblfilmes-tr');
	const searchBox = document.getElementById('prof-searchbox');
	searchBox.addEventListener('keyup', (e) => {
		const term = e.target.value.toLowerCase();
		Array.from(btns).forEach((real) => {
			const id = localNameFilm(filmes,real.id);
			if (id.toLowerCase().indexOf(term) != -1) {
				real.style.display = 'block';
			} else {
				real.style.display = 'none';
			}
		})
	})
	function localNameFilm(obj,id){
		for(let x=0;x<obj.length;x++){
			if(obj[x].id==id) return obj[x].titulo;
		}
	}
	window.popDeleteFilme = (id)=>{
		document.getElementById('modal').innerHTML = FILMES.htmlPopDeleteFilme(id);
		openModalWindow();
	}

	window.submitDeleteFilme = async (id)=>{
		const out = await FILMES.deleteFilme(id);
		console.log(out);
		if(out.result=='ok'){
			document.getElementById('modal').innerHTML = PROF.htmlPopMsg('Apagar Filme','Operacao com sucesso!');
			openModalWindow();
		}else{
			document.getElementById('modal').innerHTML = PROF.htmlPopMsg('Apagar Filme',out.result);
			openModalWindow();
		}
		loadFilmesMain();
	}
}


window.openFilmeDetalhes = async (id) => {
	document.getElementById('container').innerHTML = ADMIN.htmlFilmes();
	const filme = await FILMES.getFilmeById(id);
	document.getElementById('title-nav-bar-label').textContent = 'Filmes > Editar > ' + filme.titulopt
	document.getElementById('content-main').innerHTML = FILMES.htmlFormFilmesDetalhes(filme);
	const gen = filme.genero.split(';');
	const chk = document.getElementsByClassName('chk-genero');
	for (let x = 0; x < chk.length; x++) {
		if (gen.includes(chk[x].value)) {
			chk[x].checked = true;
		}
	}
	const etar = document.getElementsByClassName('sel-etaria');
	for (let x = 0; x < etar.length; x++) {
		if (etar[x].value == filme.etaria) {
			etar[x].selected = true;
		}
	}
	createUpdateFilmeChecks();
}

function createUpdateFilmeChecks(){
	const lblDuracao = document.getElementById('div-lbl-duracao')
	const filmeTime = document.getElementById('input-filme-duracao');
	filmeTime.addEventListener('change', () => {
		if (isNaN(parseInt(filmeTime.value))) {
			lblDuracao.innerHTML = '<img src="../adminimg/warning.png" width="15px" title="Tem de ser um numero">';
			filmeTime.style.background = "#ff32465f"

		} else {
			lblDuracao.innerHTML = '<label id="lbl-duracao">' + FILMES.duracaoFilme(filmeTime.value) + '</label>';
			filmeTime.style.background = null;
		}

	})
	const lblAno = document.getElementById('div-lbl-ano')
	const filmeAno = document.getElementById('input-filme-ano');
	filmeAno.addEventListener('change', () => {
		console.log(filmeAno.value)
		if (isNaN(parseInt(filmeAno.value))) {
			lblAno.innerHTML = '<img src="../adminimg/warning.png" width="15px" title="Tem de ser um numero">';
			filmeAno.style.background = "#ff32465f"

		}
		else if (filmeAno.value < 1888 || filmeAno.value > (currentYear + 5)) {
			lblAno.innerHTML = '<img src="../adminimg/warning.png" width="15px" title="Ano Invalido: Tem de ser entre 1888 e mais 5 anos que o currente ano">';
			filmeAno.style.background = "#ff32465f"
		}
		else {
			lblAno.innerHTML = '';
			filmeAno.style.background = null;
		}
	})
	const imgSnippet = document.getElementById('img-snippet')
	const imgLnk = document.getElementById('input-filme-cover')
	imgLnk.addEventListener('change',()=>{
		const uri = String(imgLnk.value)
		imgSnippet.src = uri;
	})
}

window.changeFilmeState = async (id,state)=>{
	const out = await FILMES.filmeState(id,state);
	if(out.result == 'ok'){
		let lbl;
		if(state){
			lbl = 'Activar'
		}else{
			lbl = 'Desactivar'
		}
		document.getElementById('btn-filme-state').textContent = lbl;
		const filmes = await FILMES.getFilmes()
		document.getElementById('tableData').innerHTML = FILMES.updateTableFilmesMain(filmes);
		tblFilmesEventListener();
		updateTableFilmesDetalhes(id);
		
	}
}

window.openCreateFilme = () => {
	document.getElementById('container').innerHTML = ADMIN.htmlFilmes();
	document.getElementById('title-nav-bar-label').textContent = 'Filmes > Adicionar Filme'
	document.getElementById('content-main').innerHTML = FILMES.htmlFormFilmesDetalhesInserir();

	createUpdateFilmeChecks();
	const imgSnippet = document.getElementById('img-snippet')
	const imgLnk = document.getElementById('input-filme-cover')
	imgLnk.addEventListener('change',()=>{
		const uri = String(imgLnk.value)
		imgSnippet.src = uri;
	})
}

window.inserirFilme = async () =>{
	const filme = await FILMES.filmeData();
	const out = await FILMES.insertFilme(filme);
	console.log(out);
	if(out.result=='ok'){
		document.getElementById('modal').innerHTML = PROF.htmlPopMsg('Adicionar Filme','Filme adicionado com sucesso com id ' + filme.id);	
		openModalWindow();
		loadFilmesMain();
	} else{
		let msg = '<h4>Operacao Falhou</h4>';
		const info = out.data;
		info.forEach(ln => {
			msg = msg + '<p> > ' + ln + '</p>'
		})
		document.getElementById('modal').innerHTML = PROF.htmlPopMsg('Adicionar Filme',msg);
		openModalWindow();
	}
}

window.updateFilmeDetails = async () => {
	document.getElementById('modal').innerHTML = FILMES.htmlPopUpdateFilme();
	openModalWindow();
}

window.runUpdateFilmeDetails = async () => {
	const filme = await FILMES.filmeData();
	const out = await FILMES.updateFilm(filme);
	console.log(out);
	if (out.result == 'ok') {
		document.getElementById('modal').innerHTML = FILMES.htmlPopUpdateFilmeResult('<h4>Operacao com sucesso</h4>')
	} else {
		let msg = '<h4>Operacao Falhou</h4>';
		const info = out.data;
		info.forEach(ln => {
			msg = msg + '<p> > ' + ln + '</p>'
		})
		document.getElementById('modal').innerHTML = FILMES.htmlPopUpdateFilmeResult(msg)
	}
}

window.popInserirProfissional = async (app) => {
	const profs = await PROF.getProfByName();
	document.getElementById('modal').innerHTML = PROF.htmlPopMsg('Selecionar Profissionais', '');
	document.getElementById('modal-body').innerHTML = PROF.tableProfMainChkbox(profs,app);
	const btnContainer = document.getElementById('profs-tblprofs');
	const btns = btnContainer.getElementsByClassName('tblprofs-tr');
	let realizador;
	switch(app){
		case "realizador":
			if(document.getElementById('input-filme-realizador').textContent==''){
				realizador=[]
			}else{
				realizador = document.getElementById('input-filme-realizador').textContent.split(';');
			}
			break;
		case "actor":
			if(document.getElementById('input-filme-actor').textContent==''){
				realizador=[]
			}else{
				realizador = document.getElementById('input-filme-actor').textContent.split(';');
			}
			break;
	}
	realizador.forEach((real) => {
		console.log(real);
		for (var btn in btns) {
			if (btns[btn].id == real) {
				btns[btn].classList.add('active');
			}
		}
	})
	const txtBox = document.getElementById('tb-prof-out')
	txtBox.textContent = arrayToString(realizador);
	function tblProfsEventListener() {
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener('click', function () {
				if (this.classList.contains('active')) {
					this.classList.remove('active');
					removeFromArray(realizador, this.id);
					txtBox.textContent = arrayToString(realizador);
				} else {
					this.classList.add('active');
					realizador.push(this.id);
					txtBox.textContent = arrayToString(realizador);
				}
			});
		}
	}
	const searchBox = document.getElementById('prof-searchbox');
	searchBox.addEventListener('keyup', (e) => {
		const term = e.target.value.toLowerCase();
		Array.from(btns).forEach((real) => {
			const id = real.id;
			if (id.toLowerCase().indexOf(term) != -1) {
				real.style.display = 'block';
			} else {
				real.style.display = 'none';
			}
		})
	})

	window.closeInserirRealizador = ()=>{
		document.getElementById('input-filme-realizador').textContent = txtBox.textContent;
		closeModalWindow();
	}
	
	window.closeInserirActor = ()=>{
		document.getElementById('input-filme-actor').textContent = txtBox.textContent;
		closeModalWindow();
	}

	tblProfsEventListener();
	openModalWindow();
}

window.popInserirRealizador=()=>{
	popInserirProfissional('realizador');
}

window.popInserirActor=()=>{
	popInserirProfissional('actor');
}






// =======================Popup Windows===========================================


window.openModalWindow = () => {
	const modal = document.getElementById('modal');
	if (modal == null) {
		return;
	}
	modal.classList.add('active');
	overlay.classList.add('active');
}

window.closeModalWindow = () => {
	const modals = document.querySelectorAll('.modal.active');
	modals.forEach(modal => {
		closeModal(modal);
	})
}

overlay.addEventListener('click', () => {
	const modals = document.querySelectorAll('.modal.active');
	modals.forEach(modal => {
		closeModal(modal);
	})
})

function closeModal(modal) {
	if (modal == null) return;
	modal.classList.remove('active');
	overlay.classList.remove('active');
}

// =======================UTILIZADORES===========================================

window.loadUtilizadoresMain = async () => {
	document.getElementById('container').innerHTML = ADMIN.htmlUsers();
	const users = await USERS.getUsers()
	document.getElementById('content-main').innerHTML = USERS.tableUsersMain(users);

	function tblUsersEventListener() {
		var btnContainer = document.getElementById('filmes-tblfilmes');
		var btns = btnContainer.getElementsByClassName('tblfilmes-tr');
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener('click', function () {
				var current = document.getElementsByClassName('active');
				if (current.length > 0) {
					current[0].className = current[0].className.replace(' active', '');
				}
				this.className += ' active';
				updateTableUserDetalhes(this.id);
			});
		}
	}
	tblUsersEventListener();
	const btnContainer = document.getElementById('filmes-tblfilmes');
	const btns = btnContainer.getElementsByClassName('tblfilmes-tr');
	const searchBox = document.getElementById('prof-searchbox');
	searchBox.addEventListener('keyup', (e) => {
		const term = e.target.value.toLowerCase();
		Array.from(btns).forEach((real) => {
			const id = localNameFilm(users,real.id);
			if (id.toLowerCase().indexOf(term) != -1) {
				real.style.display = 'block';
			} else {
				real.style.display = 'none';
			}
		})
	})

	function localNameFilm(obj,id){
		for(let x=0;x<obj.length;x++){
			if(obj[x].id==id) return obj[x].email;
		}
	}
}

window.updateTableUserDetalhes = async (id) => {
	document.getElementById('aside-filme-detalhes-box').innerHTML = '&nbsp;&nbsp;Loading...';
	const out = await USERS.tableUserDetalhes(id);
	document.getElementById('aside-filme-detalhes-box').innerHTML = out;
}

window.inserirAdminUser = ()=>{
	document.getElementById('aside-filme-detalhes-box').innerHTML = USERS.tableInserirUserAdmin();
}

window.submitInserirAdminUser = async ()=>{
	const nome = document.getElementById('admin-nome').value;
	const email = document.getElementById('admin-email').value;
	const res = await USERS.inserirAdmin(nome,email);
	let msg, out;
	if(res.result == 'ok'){
		msg = '<h4>Utilizador Adicionado com Sucesso</h4>'+
			'<p>Email: '+email+'</p>'+
			'<p>Password: '+res.pass+'</p>'
		out = USERS.htmlInserirAdmin(msg);
		document.getElementById('modal').innerHTML = out;
		openModalWindow();
	}else{
		msg = '<h4>'+res.result+'</h4>'
		out = USERS.htmlInserirAdmin(msg);
		document.getElementById('modal').innerHTML = out;
		openModalWindow();
	}
	loadUtilizadoresMain();
}

window.terminarUser = (id)=>{
	document.getElementById('modal').innerHTML = USERS.htmlPopDeleteUser(id);
	openModalWindow();
}

window.submeterTerminarUser = async(id) =>{
	const res = await USERS.terminarUser(id);
	let msg,out;
	if(res.result == 'ok'){
		msg = '<h4>Utilizador Terminado com Sucesso</h4>'
		out = USERS.htmlInserirAdmin(msg);
		document.getElementById('modal').innerHTML = out;
		openModalWindow();
	}else{
		msg = '<h4>'+res.result+'</h4>'
		out = USERS.htmlInserirAdmin(msg);
		document.getElementById('modal').innerHTML = out;
		openModalWindow();
	}
	loadUtilizadoresMain();
}


// =======================PROFISSIONAIS===========================================
window.loadProfissionaisMain = async () => {
	document.getElementById('container').innerHTML = ADMIN.htmlProf();
	const profs = await PROF.getProf()
	document.getElementById('content-main').innerHTML = PROF.tableProfMain(profs);

	window.tblProfsEventListener = () => {
		var btnContainer = document.getElementById('profs-tblprofs');
		var btns = btnContainer.getElementsByClassName('tblprofs-tr');
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener('click', function () {
				var current = document.getElementsByClassName('active');
				if (current.length > 0) {
					current[0].className = current[0].className.replace(' active', '');
				}
				this.className += ' active';
				updateTableProfDetalhes(this.id);
			});
		}
	}

	tblProfsEventListener()
	const btnContainer = document.getElementById('profs-tblprofs');
	const btns = btnContainer.getElementsByClassName('tblprofs-tr');
	const searchBox = document.getElementById('prof-searchbox');
	searchBox.addEventListener('keyup', (e) => {
		const term = e.target.value.toLowerCase();
		Array.from(btns).forEach((real) => {
			const id = localNameFilm(profs,real.id);
			if (id.toLowerCase().indexOf(term) != -1) {
				real.style.display = 'block';
			} else {
				real.style.display = 'none';
			}
		})
	})

	function localNameFilm(obj,id){
		for(let x=0;x<obj.length;x++){
			if(obj[x].id==id) return obj[x].nome;
		}
	}
}

window.updateTableProfDetalhes = async (id) => {
	document.getElementById('aside-prof-detalhes-box').innerHTML = '&nbsp;&nbsp;Loading...';
	const out = await PROF.tableProfDetalhes(id);
	document.getElementById('aside-prof-detalhes-box').innerHTML = out;
	document.getElementById('in-prof-nome').addEventListener('click', () => {
		document.getElementById('lbl-prof-out').textContent = '';
	})
}

window.updateProf = async (id, nome) => {
	const profid = document.getElementById('lbl-prof-id').textContent;
	const profnome = document.getElementById('in-prof-nome').value;
	const out = await PROF.updateProf(profid, profnome);
	document.getElementById('lbl-prof-out').textContent = out.result;
	reloadTableProf();
}

window.reloadTableProf = async () => {
	const profs = await PROF.getProf()
	document.getElementById('tableData').innerHTML = PROF.updateTableProfMain(profs);
	tblProfsEventListener()
}

window.openInserirProf = () => {
	document.getElementById('aside-prof-detalhes-box').innerHTML = PROF.tableProfDetalhesInserir();
	document.getElementById('in-prof-nome').addEventListener('click', () => {
		document.getElementById('lbl-prof-out').textContent = '';
		document.getElementById('lbl-prof-id').textContent = '';
		document.getElementById('in-prof-nome').value = '';
	})
}

window.inserirProf = async () => {
	const profNome = document.getElementById('in-prof-nome').value;
	const prof = await PROF.inserirProf(profNome);
	if (prof.result == 'ok') {
		document.getElementById('lbl-prof-id').textContent = prof.id;
		document.getElementById('lbl-prof-out').textContent = 'Profissional Inserido';
		reloadTableProf();
	} else {
		document.getElementById('lbl-prof-out').textContent = prof.result;
	}
}

window.openDeleteProf = async (id) => {
	document.getElementById('modal').innerHTML = PROF.htmlPopDeleteProf(id);
	openModalWindow();
}

window.runDeleteProf = async (id) => {
	const out = await PROF.deleteProf(id);
	if (out.result == 'ok') {
		document.getElementById('modal').innerHTML = PROF.htmlPopMsg('Apagar Profissional', 'Profissional Apagado');
	} else {
		document.getElementById('modal').innerHTML = PROF.htmlPopMsg('Apagar Profissional', out.result);
	}
	document.getElementById('aside-prof-detalhes-box').innerHTML = '';
	reloadTableProf();
}
//========================Dashboard===============================================

window.loadDashboard = ()=>{
	document.getElementById('container').innerHTML = LOGIN.htmlDashboard();
}



// =======================MAIN e outros===========================================

function arrayToString(arr) {
	return arr.join(';');
}

function removeFromArray(arr, str) {
	for (let pos = 0; pos < arr.length; pos++) {
		if (arr[pos] == str) {
			arr.splice(pos, 1);
			break;
		}
	}
}

window.loginUser = async ()=>{
	const logEmail = document.getElementById('uname').value;
	const logPass = document.getElementById('psw').value;
	const res = await LOGIN.loginAdminUser(logEmail,logPass)
	console.log(res);
	if(res.result == 'ok'){
		document.getElementById('main-body').innerHTML = ADMIN.htmlMainPage();
		loadDashboard();
	}
	else if(res.result == 'renew'){
		hsh = res.hash;
		document.getElementById('modal').innerHTML = LOGIN.popRenewPass();
		openModalWindow();
	}
	else{
		document.getElementById('errmsg').textContent = res.result;
	}
}

window.submitResetPassword = async ()=>{
	const pass1 = document.getElementById('pass1').value;
	const pass2 = document.getElementById('pass2').value;
	let msg;
	if(pass1==pass2){
		const res = await LOGIN.renewPass(hsh,pass1);
		if (res.result == 'ok'){
			document.getElementById('main-body').innerHTML = ADMIN.htmlMainPage();
			hsh = '';
			closeModalWindow();
			return;
		}else{
			msg = res.result;
		}		
	}else{
		msg = 'Passwords nao sao identicas'
	}
	document.getElementById('modal').innerHTML = PROF.htmlPopMsg('Reset a Password',msg);
}

window.logoutUser = ()=>{
	LOGIN.logoutState()
	document.getElementById('main-body').innerHTML = LOGIN.htmlLogin()
}

async function loadMainPage() {
	const ses = await LOGIN.userSessionState();
	if(ses.result=='ok'){
		document.getElementById('main-body').innerHTML = ADMIN.htmlMainPage();
		loadDashboard();
	}
	else{
		document.getElementById('main-body').innerHTML = LOGIN.htmlLogin()
	}
}



loadMainPage()