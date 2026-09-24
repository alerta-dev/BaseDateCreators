import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Esto avisa en consola si te olvidaste de crear el archivo .env
  // (ver SETUP.md para más detalles)
  console.error(
    'Faltan las variables VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. ' +
    'Copiá .env.example a .env y completá los valores de tu proyecto de Supabase.'
  );
}

// createClient valida el formato de la URL y tira una excepción si está vacía,
// lo que rompía el render de toda la app (pantalla en blanco) cuando faltaban
// las variables de entorno. Usamos un valor de relleno con formato válido para
// evitar ese crash; isSupabaseConfigured indica si hay que mostrar un aviso.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
