// ============================================================================
// Script de migración: carga todo lo que ya tenías en src/data/downloads.ts
// dentro de la tabla "containers" de Supabase, para no perder nada.
//
// Cómo usarlo:
//   1) Corré el schema.sql en Supabase (ver SETUP.md) ANTES que esto.
//   2) Creá un archivo .env en la raíz del proyecto (podés copiar .env.example)
//      y completá VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.
//      La "service role key" la encontrás en Supabase -> Project Settings -> API.
//      OJO: esa clave es secreta, no la subas a GitHub ni la compartas.
//   3) node scripts/seed.mjs
//
// Es seguro correrlo más de una vez: si ya migraste antes, te va a preguntar
// si querés borrar lo existente para volver a cargar todo, para evitar duplicados.
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import readline from 'node:readline/promises';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// --- Cargar variables de entorno desde .env manualmente (sin dependencias extra) ---
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!existsSync(envPath)) {
    console.error('No encontré el archivo .env en la raíz del proyecto. Copiá .env.example a .env y completalo.');
    process.exit(1);
  }
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Faltan VITE_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en tu .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const { programs, plugins, renders, backgrounds, sounds, materials } = await import('./downloads-data.mjs');

const DATASET = [
  { category: 'programas', items: programs },
  { category: 'plugins', items: plugins },
  { category: 'renders', items: renders },
  { category: 'fondos', items: backgrounds },
  { category: 'sonidos', items: sounds },
  { category: 'materiales', items: materials },
];

const totalItems = DATASET.reduce((sum, d) => sum + d.items.length, 0);
console.log(`Se encontraron ${totalItems} elementos para migrar.`);

const { count: existingCount } = await supabase
  .from('containers')
  .select('*', { count: 'exact', head: true });

if (existingCount && existingCount > 0) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(
    `Ya hay ${existingCount} contenedores cargados en la base. ¿Querés BORRARLOS y volver a migrar todo? (escribí "si" para confirmar): `
  );
  rl.close();

  if (answer.trim().toLowerCase() === 'si') {
    const { error: deleteError } = await supabase.from('containers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
      console.error('Error al borrar:', deleteError.message);
      process.exit(1);
    }
    console.log('Contenedores anteriores eliminados.');
  } else {
    console.log('Cancelado. No se modificó nada.');
    process.exit(0);
  }
}

let inserted = 0;
for (const { category, items } of DATASET) {
  const rows = items.map((item) => ({
    category,
    title: item.title,
    description: item.description ?? '',
    image_url: item.imageUrl,
    download_url: item.downloadUrl ?? null,
    web_url: item.webUrl ?? null,
    created_by: 'migracion-inicial',
  }));

  // Insertamos en lotes de 200 para no pasarnos de límites de la API
  const BATCH_SIZE = 200;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('containers').insert(batch);
    if (error) {
      console.error(`Error insertando en "${category}":`, error.message);
      process.exit(1);
    }
    inserted += batch.length;
    console.log(`  ${category}: ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}`);
  }
}

console.log(`\n✅ Migración completa. Se insertaron ${inserted} contenedores.`);
