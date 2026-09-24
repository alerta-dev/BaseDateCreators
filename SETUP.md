# Guía: login de administradores + base de datos con Supabase

Esta guía te lleva paso a paso desde cero hasta tener:

- Un `/login` secreto donde solo vos (y quien vos autorices) puede entrar.
- Un panel `/admin` para agregar, editar y borrar contenedores (nombre,
  descripción, link, link de imagen) sin tocar código nunca más.
- Un log con todo lo que hace cada administrador.
- Solo vos decidís qué correos pueden entrar, y le asignás la contraseña vos
  mismo (no hay registro público, nadie se puede "crear una cuenta" solo).

No hace falta programar nada de esto de nuevo: ya está hecho. Solo tenés que
configurar tu proyecto de Supabase y subir el código.

---

## 1) Crear el proyecto en Supabase

1. Entrá a https://supabase.com y creá una cuenta (podés usar GitHub).
2. Click en **New project**.
3. Elegí un nombre (ej: `creatozzz`), una contraseña para la base (guardala,
   no es la que van a usar los admins, es la de la base de datos en sí) y una
   región cercana a tus usuarios.
4. Esperá 1-2 minutos a que se termine de crear.

## 2) Crear las tablas (containers y admin_logs)

1. En el menú lateral de tu proyecto, andá a **SQL Editor**.
2. Click en **New query**.
3. Abrí el archivo [`supabase/schema.sql`](./supabase/schema.sql) de este
   repo, copiá **todo** el contenido y pegalo ahí.
4. Click en **Run**. Deberías ver "Success. No rows returned".

Esto crea:
- `containers`: todos los cards que se muestran en la web (programas,
  plugins, renders, fondos, sonidos, materiales).
- `admin_logs`: el registro de actividad de los administradores.
- Reglas de seguridad (RLS) para que cualquiera pueda **ver** los contenedores,
  pero solo un administrador logeado pueda **crear/editar/borrar**.

## 3) Conseguir tus claves de API

1. Andá a **Project Settings** (ícono de tuerca) → **API**.
2. Vas a necesitar dos valores:
   - **Project URL** → va en `VITE_SUPABASE_URL`
   - **anon public** key → va en `VITE_SUPABASE_ANON_KEY`
   - **service_role** key (¡secreta!) → solo la vas a usar una vez, para
     migrar tus datos actuales. Nunca la pongas en el código del sitio.

## 4) Configurar las variables de entorno del proyecto

1. En la raíz del proyecto, copiá `.env.example` a un archivo nuevo llamado
   `.env`.
2. Completá los 3 valores con los que copiaste en el paso anterior.
3. Ese archivo `.env` **no se sube a GitHub** (ya está en `.gitignore`).

## 5) Instalar dependencias

```bash
npm install
```

## 6) Migrar tus datos actuales (los que ya tenías en `downloads.ts`)

Tenés dos formas de hacerlo. Si no usás la terminal en tu PC, andá directo a
la **Opción A**.

### Opción A — sin instalar nada (recomendada)
Ya te dejé generado el archivo [`supabase/migracion-datos.sql`](./supabase/migracion-datos.sql)
con los 430 elementos que ya tenías (programas, plugins, renders, fondos,
sonidos, materiales), listos para insertar.

1. En Supabase, andá a **SQL Editor** → **New query**.
2. Abrí `supabase/migracion-datos.sql`, copiá todo el contenido y pegalo ahí.
3. Click en **Run**.
4. Andá a **Table Editor** → `containers` y confirmá que aparecieron las filas.

### Opción B — con Node instalado en tu PC
Si en algún momento instalás Node, también podés correr:

```bash
node scripts/seed.mjs
```

Esto lee `src/data/downloads.ts` directamente y lo migra igual que la Opción
A (además te permite volver a correrlo si cambiás algo ahí). No hace falta
hacer las dos, con una alcanza.

> `src/data/downloads.ts` ya no se usa para mostrar contenido en la web (eso
> ahora viene de la base de datos), lo dejamos solo como respaldo/origen de
> los datos para esta migración. Podés archivarlo o borrarlo después si
> querés.

## 7) Crear tu primer usuario administrador

Acá es donde **vos decidís quién puede entrar** y le ponés la contraseña vos
mismo (no hay formulario de registro en la web, a propósito):

1. En Supabase, andá a **Authentication** → **Users**.
2. Click en **Add user** → **Create new user**.
3. Completá el email del administrador y una contraseña.
4. Marcá la opción **Auto Confirm User** (así no depende de que confirme un
   mail) y guardá.

Repetí este paso por cada persona a la que quieras dar acceso. Si en algún
momento querés sacarle el acceso a alguien, simplemente borrás su usuario
(o cambiás su contraseña) desde esta misma pantalla.

## 8) Probar en local

```bash
npm run dev
```

- El sitio normal sigue en `/`.
- Entrá a `/login` con el email/contraseña que creaste en el paso 7.
- Te va a redirigir a `/admin`, donde podés agregar/editar/borrar
  contenedores por categoría, y ver el log de actividad en la pestaña "Logs".

## 9) Desplegar (publicar) el sitio

Recomiendo **Vercel** o **Netlify** (gratis, y son mucho más simples que
GitHub Pages para este tipo de sitio, porque manejan bien las rutas como
`/login` y `/admin` y las variables de entorno). Los dos casos ya están
preconfigurados en este repo (`vercel.json` y `public/_redirects`).

### Con Vercel
1. Subí el proyecto a GitHub.
2. Entrá a https://vercel.com → **Add New Project** → elegí tu repo.
3. En **Environment Variables**, agregá `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` (los mismos valores de tu `.env`, **sin** la
   service role key, esa no va acá).
4. Deploy.

### Con Netlify
1. Subí el proyecto a GitHub.
2. **Add new site** → **Import an existing project** → elegí tu repo.
3. Build command: `npm run build`, publish directory: `dist`.
4. En **Site settings → Environment variables** agregá las mismas dos
   variables que en Vercel.
5. Deploy.

> Si preferís seguir usando GitHub Pages, funciona igual para el sitio
> público, pero las rutas `/login` y `/admin` van a dar error 404 al
> recargar la página directamente en esa URL (GitHub Pages no redirige rutas
> desconocidas a `index.html` por defecto). Si te pasa esto y no querés
> migrar de hosting, avisame y lo adaptamos con `HashRouter` para que
> funcione ahí también, aunque las URLs quedarían como `/#/login`.

---

## Preguntas frecuentes

**¿Cómo agrego un segundo administrador más adelante?**
Repetís el paso 7 (Authentication → Users → Add user) con el nuevo correo y
contraseña. No hace falta tocar código.

**¿Los admins pueden crear otros admins desde la web?**
No, a propósito. Crear administradores solo se puede hacer desde el panel de
Supabase, así vos mantenés el control total de quién entra.

**¿Dónde veo qué hizo cada admin?**
En `/admin`, pestaña "Logs". Se registra cada login, y cada vez que se crea,
edita o borra un contenedor (quién, cuándo, y qué).

**¿Puedo cambiarle la contraseña a alguien?**
Sí, desde Authentication → Users → click en el usuario → "Reset password" o
directamente asignarle una nueva.
