import { getSupabaseClient } from '../supabase.js';

var loginPanel = document.getElementById('login-panel');
var deniedPanel = document.getElementById('denied-panel');
var dashboard = document.getElementById('dashboard');
var loginForm = document.getElementById('login-form');
var loginMessage = document.getElementById('login-message');
var dashboardMessage = document.getElementById('dashboard-message');
var requestList = document.getElementById('request-list');
var requestCount = document.getElementById('request-count');
var searchInput = document.getElementById('search');
var requests = [];
var supabase;

function showMessage(element, message) {
	element.textContent = message;
	element.hidden = !message;
}

function setView(view) {
	loginPanel.hidden = view !== 'login';
	deniedPanel.hidden = view !== 'denied';
	dashboard.hidden = view !== 'dashboard';
}

function formatDate(value, includeTime) {
	if (!value) return 'No especificada';
	var date = new Date(value);
	return new Intl.DateTimeFormat('es-US', includeTime
		? { dateStyle: 'medium', timeStyle: 'short' }
		: { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

function displayBoolean(value) {
	return value === true ? 'Sí' : value === false ? 'No' : 'No especificado';
}

function addDetail(list, label, value) {
	var term = document.createElement('dt');
	term.textContent = label;
	var description = document.createElement('dd');
	description.textContent = value === null || value === undefined || value === ''
		? 'No especificado'
		: String(value);
	list.append(term, description);
}

function renderRequests() {
	var query = searchInput.value.trim().toLocaleLowerCase();
	var filtered = requests.filter(function (request) {
		return Object.values(request).join(' ').toLocaleLowerCase().includes(query);
	});
	requestList.replaceChildren();
	requestCount.textContent = requests.length === 100
		? 'Mostrando hasta 100 solicitudes más recientes. ' + filtered.length + ' coinciden con la búsqueda.'
		: filtered.length + ' de ' + requests.length + ' solicitudes';

	if (!filtered.length) {
		var empty = document.createElement('p');
		empty.className = 'empty-state';
		empty.textContent = query ? 'No hay solicitudes que coincidan con la búsqueda.' : 'Todavía no hay solicitudes recibidas.';
		requestList.appendChild(empty);
		return;
	}

	filtered.forEach(function (request) {
		var card = document.createElement('article');
		card.className = 'request-card';
		var heading = document.createElement('div');
		heading.className = 'card-heading';
		var title = document.createElement('h2');
		title.textContent = request.nombre_completo;
		var received = document.createElement('span');
		received.className = 'received';
		received.textContent = 'Recibida ' + formatDate(request.created_at, true);
		heading.append(title, received);

		var summary = document.createElement('p');
		summary.className = 'summary';
		summary.textContent = request.tipo_ayuda === 'Otro' && request.tipo_ayuda_otro
			? 'Otro: ' + request.tipo_ayuda_otro
			: request.tipo_ayuda;

		var details = document.createElement('details');
		var summaryToggle = document.createElement('summary');
		summaryToggle.textContent = 'Ver detalles completos';
		var detailList = document.createElement('dl');
		[
			['Fecha de nacimiento', formatDate(request.fecha_nacimiento, false)],
			['País de origen', request.pais_origen],
			['Ciudad y estado', request.ciudad_estado],
			['Teléfono', request.telefono],
			['Correo electrónico', request.correo],
			['¿Tiene WhatsApp?', displayBoolean(request.whatsapp)],
			['Tipo de ayuda', request.tipo_ayuda],
			['Otro tipo de ayuda', request.tipo_ayuda_otro],
			['¿Tiene audiencia o cita?', displayBoolean(request.audiencia)],
			['Fecha de audiencia o cita', request.fecha_audiencia],
			['¿Está detenido?', displayBoolean(request.detenido)],
			['¿Tuvo abogado antes?', displayBoolean(request.abogado_previo)],
			['Descripción', request.descripcion],
			['Personas dependientes', request.dependientes],
			['Urgencia', request.urgencia],
			['Confirmó veracidad', displayBoolean(request.confirma_verdad)],
			['Autorizó contacto', displayBoolean(request.autoriza_contacto)],
			['ID de solicitud', request.id]
		].forEach(function (item) {
			addDetail(detailList, item[0], item[1]);
		});
		details.append(summaryToggle, detailList);
		card.append(heading, summary, details);
		requestList.appendChild(card);
	});
}

async function loadRequests() {
	showMessage(dashboardMessage, '');
	var result = await supabase
		.from('solicitudes_ayuda')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(100);

	if (result.error) {
		console.error('No se pudieron cargar las solicitudes.', result.error);
		showMessage(dashboardMessage, 'No se pudieron cargar las solicitudes. Verifique la conexión e inténtelo de nuevo.');
		return;
	}

	requests = result.data;
	renderRequests();
}

async function showAuthorizedDashboard() {
	var access = await supabase.rpc('is_solicitudes_admin');
	if (access.error) {
		console.error('No se pudieron verificar los permisos de administración.', access.error);
		showMessage(loginMessage, 'No se pudieron verificar los permisos. Compruebe su conexión e inténtelo de nuevo.');
		setView('login');
		return;
	}
	if (access.data !== true) {
		var signOutResult = await supabase.auth.signOut();
		if (signOutResult.error) {
			console.error('No se pudo cerrar la sesión de una cuenta no autorizada.', signOutResult.error);
		}
		setView('denied');
		return;
	}
	setView('dashboard');
	await loadRequests();
}

loginForm.addEventListener('submit', async function (event) {
	event.preventDefault();
	showMessage(loginMessage, '');
	var button = loginForm.querySelector('button');
	button.disabled = true;

	try {
		var result = await supabase.auth.signInWithPassword({
			email: loginForm.elements.email.value.trim(),
			password: loginForm.elements.password.value
		});
		if (result.error) throw result.error;
		await showAuthorizedDashboard();
	} catch (error) {
		console.error('No se pudo iniciar sesión en el panel.', error);
		showMessage(loginMessage, 'No se pudo iniciar sesión. Revise sus datos e inténtelo de nuevo.');
	} finally {
		button.disabled = false;
	}
});

async function signOut() {
	var result = await supabase.auth.signOut();
	if (result.error) {
		console.error('No se pudo cerrar la sesión.', result.error);
		showMessage(dashboardMessage, 'No se pudo cerrar la sesión. Inténtelo de nuevo.');
		return;
	}
	setView('login');
}

document.getElementById('logout-button').addEventListener('click', signOut);
document.getElementById('denied-logout').addEventListener('click', signOut);
document.getElementById('refresh-button').addEventListener('click', loadRequests);
searchInput.addEventListener('input', renderRequests);

try {
	supabase = getSupabaseClient();
	supabase.auth.getSession().then(function (result) {
		if (result.error) {
			console.error('No se pudo recuperar la sesión del panel.', result.error);
			showMessage(loginMessage, 'No se pudo verificar la sesión. Recargue la página e inténtelo de nuevo.');
			return;
		}
		if (result.data.session) return showAuthorizedDashboard();
		setView('login');
	}).catch(function (error) {
		console.error('No se pudo iniciar el panel.', error);
		showMessage(loginMessage, 'No se pudo conectar con el servicio de autenticación.');
	});
} catch (error) {
	console.error('La configuración de Supabase no está completa.', error);
	showMessage(loginMessage, 'El panel aún no está configurado. Contacte al administrador del sistema.');
}
