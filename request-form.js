import { getSupabaseClient } from './supabase.js';

var form = document.getElementById('caridadesForm');
var status = document.getElementById('caridadesStatus');

if (form && status) {
	var submitButton = form.querySelector('[type="submit"]');

	form.addEventListener('submit', async function (event) {
		event.preventDefault();
		status.hidden = true;

		if (!form.reportValidity()) return;

		var values = new FormData(form);
		var birthDate = values.get('fecha_nacimiento');
		if (birthDate && birthDate > new Date().toISOString().slice(0, 10)) {
			status.textContent = 'La fecha de nacimiento no puede ser futura.';
			status.hidden = false;
			return;
		}

		var payload = {
			nombre_completo: values.get('nombre_completo').trim(),
			fecha_nacimiento: birthDate,
			pais_origen: values.get('pais_origen').trim(),
			ciudad_estado: values.get('ciudad_estado').trim(),
			telefono: values.get('telefono').trim(),
			correo: values.get('correo').trim() || null,
			whatsapp: values.get('whatsapp') === 'Sí',
			tipo_ayuda: values.get('tipo_ayuda'),
			tipo_ayuda_otro: values.get('tipo_ayuda') === 'Otro'
				? values.get('tipo_ayuda_otro').trim()
				: null,
			audiencia: values.get('audiencia') === 'Sí',
			fecha_audiencia: values.get('fecha_audiencia') || null,
			detenido: values.get('detenido') === 'Sí',
			abogado_previo: values.get('abogado_previo') === 'Sí',
			descripcion: values.get('descripcion').trim(),
			dependientes: values.get('dependientes') === ''
				? null
				: Number(values.get('dependientes')),
			urgencia: values.get('urgencia').trim() || null,
			confirma_verdad: form.elements.confirma_verdad.checked,
			autoriza_contacto: form.elements.autoriza_contacto.checked
		};

		submitButton.disabled = true;
		submitButton.textContent = 'Enviando...';

		try {
			var client = getSupabaseClient();
			var result = await client
				.from('solicitudes_ayuda')
				.insert(payload);

			if (result.error) throw result.error;

			status.textContent = 'Solicitud enviada. Gracias. Nuestro equipo revisará su información y se comunicará con usted pronto.';
			status.hidden = false;
			form.reset();
			form.dispatchEvent(new Event('change', { bubbles: true }));
		} catch (error) {
			console.error('No se pudo enviar la solicitud de ayuda.', error);
			status.textContent = 'No pudimos enviar su solicitud. Inténtelo de nuevo más tarde o contáctenos por teléfono.';
			status.hidden = false;
		} finally {
			submitButton.disabled = false;
			submitButton.textContent = 'Enviar solicitud';
		}
	});
}
