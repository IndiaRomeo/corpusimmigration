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
var totalCount = document.getElementById('total-count');
var detainedCount = document.getElementById('detained-count');
var urgentCount = document.getElementById('urgent-count');
var refreshButton = document.getElementById('refresh-button');
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

function getLoginErrorMessage(error) {
	var code = error && error.code ? error.code : '';
	var message = error && error.message ? error.message.toLowerCase() : '';

	if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
		return 'El correo aún no está confirmado. Pida al administrador que confirme la cuenta en Supabase Authentication → Users o reenvíe la invitación.';
	}
	if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
		return 'El correo o la contraseña no son correctos. Verifique sus datos e inténtelo de nuevo.';
	}
	if (code === 'user_banned' || message.includes('user is banned')) {
		return 'Esta cuenta está deshabilitada. Contacte al administrador de Supabase para restablecer el acceso.';
	}
	if (code === 'too_many_requests' || message.includes('too many requests')) {
		return 'Se realizaron demasiados intentos. Espere unos minutos antes de volver a intentarlo.';
	}
	if (error && (error.name === 'TypeError' || message.includes('fetch'))) {
		return 'No fue posible conectar con Supabase. Compruebe su conexión e inténtelo de nuevo.';
	}
	return 'No se pudo iniciar sesión. Revise sus datos o contacte al administrador del sistema.';
}

function isUrgent(request) {
	return typeof request.urgencia === 'string' && request.urgencia.trim().length > 0;
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
		return [request.nombre_completo, request.correo, request.telefono]
			.some(function (value) { return String(value || '').toLocaleLowerCase().includes(query); });
	});
	requestList.replaceChildren();
	requestCount.textContent = requests.length === 100
		? 'Mostrando hasta 100 solicitudes más recientes. ' + filtered.length + ' coinciden con la búsqueda.'
		: filtered.length + ' de ' + requests.length + ' solicitudes';
	totalCount.textContent = requests.length === 100 ? '100+' : String(requests.length);
	detainedCount.textContent = String(requests.filter(function (request) { return request.detenido === true; }).length);
	urgentCount.textContent = String(requests.filter(isUrgent).length);

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
		var identity = document.createElement('div');
		identity.className = 'card-identity';
		var avatar = document.createElement('span');
		avatar.className = 'avatar';
		avatar.setAttribute('aria-hidden', 'true');
		avatar.textContent = (request.nombre_completo || '?').trim().charAt(0).toLocaleUpperCase();
		var identityText = document.createElement('div');
		var title = document.createElement('h3');
		title.textContent = request.nombre_completo;
		var received = document.createElement('span');
		received.className = 'received';
		received.textContent = 'Recibida ' + formatDate(request.created_at, true);
		identityText.append(title, received);
		identity.append(avatar, identityText);

		var tags = document.createElement('div');
		tags.className = 'card-tags';
		function addBadge(text, className) {
			var badge = document.createElement('span');
			badge.className = 'badge ' + className;
			badge.textContent = text;
			tags.appendChild(badge);
		}
		var caseType = request.tipo_ayuda === 'Otro' && request.tipo_ayuda_otro
			? 'Otro: ' + request.tipo_ayuda_otro
			: request.tipo_ayuda;
		addBadge(caseType || 'Tipo sin especificar', 'badge-case');
		addBadge(request.detenido ? 'Detención reportada' : 'Sin detención reportada', request.detenido ? 'badge-alert' : 'badge-neutral');
		if (isUrgent(request)) addBadge('Urgencia indicada', 'badge-urgent');
		heading.append(identity, tags);

		var subline = document.createElement('p');
		subline.className = 'card-subline';
		var contact = document.createElement('span');
		contact.textContent = [request.correo, request.telefono].filter(Boolean).join(' · ') || 'Sin datos de contacto';
		subline.appendChild(contact);

		var details = document.createElement('details');
		details.className = 'card-details';
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
		card.append(heading, subline, details);
		requestList.appendChild(card);
	});
}

async function loadRequests() {
	showMessage(dashboardMessage, '');
	refreshButton.disabled = true;
	refreshButton.textContent = 'Cargando…';
	try {
		var result = await supabase
			.from('solicitudes_ayuda')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(100);

		if (result.error) throw result.error;
		requests = result.data;
		renderRequests();
	} catch (error) {
		console.error('No se pudieron cargar las solicitudes.', error);
		showMessage(dashboardMessage, 'No se pudieron cargar las solicitudes. Verifique su conexión y los permisos RLS de Supabase e inténtelo de nuevo.');
	} finally {
		refreshButton.disabled = false;
		refreshButton.innerHTML = '<span aria-hidden="true">↻</span> Actualizar';
	}
}

async function showAuthorizedDashboard() {
	try {
		var access = await supabase.rpc('is_solicitudes_admin');
		if (access.error) throw access.error;
		if (access.data !== true) {
			var sessionResult = await supabase.auth.getSession();
			var email = sessionResult.data.session && sessionResult.data.session.user.email;
			var deniedMessage = document.getElementById('denied-message');
			deniedMessage.textContent = email && email.toLowerCase() === 'admin@gmail.com'
				? 'admin@gmail.com pudo iniciar sesión, pero aún no tiene autorización para ver solicitudes. Confirme el usuario en Supabase Authentication → Users y agregue su ID de usuario a public.admin_users. El panel no concede permisos solo por coincidir el correo.'
				: 'La autenticación fue correcta, pero esta cuenta no está autorizada para consultar solicitudes. Pida al administrador del sistema que habilite su usuario en public.admin_users.';
			var signOutResult = await supabase.auth.signOut();
			if (signOutResult.error) console.error('No se pudo cerrar la sesión de una cuenta no autorizada.', signOutResult.error);
			setView('denied');
			return;
		}
		setView('dashboard');
		await loadRequests();
	} catch (error) {
		console.error('No se pudieron verificar los permisos de administración.', error);
		setView('login');
		showMessage(loginMessage, 'No se pudieron verificar los permisos con Supabase. Compruebe su conexión y que exista la función is_solicitudes_admin en la base de datos.');
	}
}

loginForm.addEventListener('submit', async function (event) {
	event.preventDefault();
	showMessage(loginMessage, '');
	var button = loginForm.querySelector('button');
	button.disabled = true;
	button.classList.add('is-loading');
	button.setAttribute('aria-busy', 'true');
	button.querySelector('.button-label').textContent = 'Verificando…';

	try {
		var result = await supabase.auth.signInWithPassword({
			email: loginForm.elements.email.value.trim(),
			password: loginForm.elements.password.value
		});
		if (result.error) throw result.error;
		await showAuthorizedDashboard();
	} catch (error) {
		console.error('No se pudo iniciar sesión en el panel.', error);
		showMessage(loginMessage, getLoginErrorMessage(error));
	} finally {
		button.disabled = false;
		button.classList.remove('is-loading');
		button.removeAttribute('aria-busy');
		button.querySelector('.button-label').textContent = 'Iniciar sesión';
	}
});

async function signOut() {
	try {
		var result = await supabase.auth.signOut();
		if (result.error) throw result.error;
		requests = [];
		setView('login');
		showMessage(loginMessage, '');
	} catch (error) {
		console.error('No se pudo cerrar la sesión.', error);
		showMessage(dashboardMessage, 'No se pudo cerrar la sesión. Inténtelo de nuevo.');
	}
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
		if (result.data.session) {
			document.getElementById('account-label').textContent = result.data.session.user.email || 'Personal autorizado';
			return showAuthorizedDashboard();
		}
		setView('login');
	}).catch(function (error) {
		console.error('No se pudo iniciar el panel.', error);
		showMessage(loginMessage, 'No se pudo conectar con el servicio de autenticación.');
	});
	supabase.auth.onAuthStateChange(function (event, session) {
		if (event === 'SIGNED_OUT' || !session) {
			requests = [];
			setView('login');
			return;
		}
		if (event === 'SIGNED_IN') {
			document.getElementById('account-label').textContent = session.user.email || 'Personal autorizado';
		}
	});
} catch (error) {
	console.error('La configuración de Supabase no está completa.', error);
	showMessage(loginMessage, 'El panel aún no está configurado. Contacte al administrador del sistema.');
}
