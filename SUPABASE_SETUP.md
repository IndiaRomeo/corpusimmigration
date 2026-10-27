# Configuración de Supabase

## 1. Crear la base de datos y proteger los datos

1. Cree un proyecto en [Supabase](https://supabase.com/).
2. Abra **SQL Editor**, pegue y ejecute [`supabase/schema.sql`](./supabase/schema.sql).
3. La política RLS permite enviar solicitudes sin iniciar sesión, pero solo permite leerlas a las cuentas registradas en `admin_users`. La clave `service_role` nunca debe colocarse en el navegador.

El formulario recoge información personal y migratoria sensible. Limite el acceso al proyecto y al panel al personal necesario, active MFA para las cuentas administrativas y establezca una política de retención y eliminación. No solicite documentos ni detalles adicionales que no sean necesarios en el formulario.

## 2. Configurar la conexión del sitio estático

Este repositorio es HTML/JavaScript estático y no tiene un empaquetador; el cliente se carga como módulo ESM desde `supabase.js`. En **Project Settings → API** de Supabase, copie la URL del proyecto y la clave pública `anon`/publishable en [`supabase-config.js`](./supabase-config.js).

La URL y la clave pública se envían al navegador y no son secretos. Las políticas RLS son las que protegen los registros. No use la clave `service_role` en `supabase-config.js`, HTML, JavaScript o `.env` que se publique.

Para un proyecto con Vite, el cliente también se puede instalar con:

```sh
npm install @supabase/supabase-js
```

En ese caso, defina `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env.local` y lea esos valores con `import.meta.env`. Un sitio estático sin proceso de build no puede leer `.env`; por eso esta integración usa el archivo de configuración público anterior. No suba archivos `.env` con secretos al control de versiones.

## 3. Crear cuentas de administración

1. En **Authentication → Users**, cree/invite las cuentas de los empleados autorizados y use contraseñas robustas. Desactive el registro público de usuarios en Authentication.
2. Para cada empleado, ejecute en SQL Editor lo siguiente, sustituyendo el correo por el del usuario ya creado:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'admin@example.com'
on conflict (user_id) do nothing;
```

La tabla de administradores no tiene políticas para autorregistrarse o cambiar roles desde el navegador. Administre sus filas desde el SQL Editor con privilegios del proyecto.

## 4. Probar y publicar

- Sirva el sitio desde un servidor HTTP(S); los módulos ES no funcionan de forma fiable abriendo el HTML como `file://`.
- Envíe una solicitud de prueba y confirme que se almacena en `solicitudes_ayuda`.
- Abra `/admin/`, inicie sesión con una cuenta autorizada y compruebe que puede consultar la solicitud. Una cuenta no incluida en `admin_users` no debe poder leer ningún registro.
- El panel carga las 100 solicitudes más recientes y ofrece búsqueda local y actualización manual.
- Antes de producción, pruebe también el formulario con una sesión anónima y revise **Authentication**, **RLS** y los registros de Supabase.
