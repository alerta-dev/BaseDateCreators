import React from 'react';
import { LogOut, Plus, Pencil, Trash2, ScrollText, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useContainers } from '../hooks/useContainers';
import { supabase } from '../lib/supabase';
import type { AdminLog, Category, Container } from '../types';

const CATEGORY_LABELS: Record<Category, string> = {
  programas: 'Programas',
  plugins: 'Plugins',
  renders: 'Renders',
  fondos: 'Fondos',
  sonidos: 'Sonidos',
  materiales: 'Materiales',
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

type Tab = Category | 'logs';

interface FormState {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  download_url: string;
  web_url: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  image_url: '',
  download_url: '',
  web_url: '',
};

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = React.useState<Tab>('programas');

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-[rgb(24,24,27)] border-b border-green-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-white font-semibold">Panel de administración</h1>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all border ${
                tab === c
                  ? 'text-green-500 bg-green-500/10 border-green-500/20'
                  : 'text-gray-300 hover:text-green-500 border-transparent hover:bg-green-500/5'
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
          <button
            onClick={() => setTab('logs')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all border flex items-center gap-2 ${
              tab === 'logs'
                ? 'text-green-500 bg-green-500/10 border-green-500/20'
                : 'text-gray-300 hover:text-green-500 border-transparent hover:bg-green-500/5'
            }`}
          >
            <ScrollText className="h-4 w-4" />
            Logs
          </button>
        </nav>

        {tab === 'logs' ? <LogsPanel /> : <CategoryPanel category={tab} />}
      </div>
    </div>
  );
}

function CategoryPanel({ category }: { category: Category }) {
  const { user } = useAuth();
  const { items, loading, error, reload } = useContainers(category);
  const [formOpen, setFormOpen] = React.useState(false);
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setFormOpen(true);
    setFormError(null);
  };

  const openEdit = (item: Container) => {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      download_url: item.download_url ?? '',
      web_url: item.web_url ?? '',
    });
    setFormOpen(true);
    setFormError(null);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(EMPTY_FORM);
  };

  const logAction = async (
    action: 'crear' | 'editar' | 'eliminar',
    title: string,
    details: Record<string, unknown>
  ) => {
    await supabase.from('admin_logs').insert({
      admin_email: user?.email ?? 'desconocido',
      action,
      category,
      container_title: title,
      details,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.image_url.trim()) {
      setFormError('El nombre y el link de la imagen son obligatorios.');
      return;
    }

    setSaving(true);

    const payload = {
      category,
      title: form.title.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      download_url: form.download_url.trim() || null,
      web_url: form.web_url.trim() || null,
    };

    if (form.id) {
      const { error: updateError } = await supabase
        .from('containers')
        .update(payload)
        .eq('id', form.id);

      setSaving(false);

      if (updateError) {
        setFormError(updateError.message);
        return;
      }

      await logAction('editar', payload.title, { id: form.id, ...payload });
    } else {
      const { error: insertError } = await supabase.from('containers').insert({
        ...payload,
        created_by: user?.email ?? null,
      });

      setSaving(false);

      if (insertError) {
        setFormError(insertError.message);
        return;
      }

      await logAction('crear', payload.title, payload);
    }

    closeForm();
    reload();
  };

  const handleDelete = async (item: Container) => {
    const confirmed = window.confirm(`¿Seguro que querés eliminar "${item.title}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    const { error: deleteError } = await supabase.from('containers').delete().eq('id', item.id);

    if (deleteError) {
      alert(`No se pudo eliminar: ${deleteError.message}`);
      return;
    }

    await logAction('eliminar', item.title, { id: item.id });
    reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">
          {CATEGORY_LABELS[category]}{' '}
          <span className="text-gray-500 font-normal">({items.length})</span>
        </h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-[rgb(24,24,27)] border border-green-500/10 rounded-lg p-6 mb-8 space-y-4"
        >
          <h3 className="text-white font-semibold">
            {form.id ? 'Editar contenedor' : 'Nuevo contenedor'}
          </h3>

          <Field label="Nombre *">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              required
            />
          </Field>

          <Field label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
              rows={2}
            />
          </Field>

          <Field label="Link de la imagen *">
            <input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className={inputClass}
              placeholder="https://..."
              required
            />
          </Field>

          <Field label="Link de descarga">
            <input
              value={form.download_url}
              onChange={(e) => setForm({ ...form, download_url: e.target.value })}
              className={inputClass}
              placeholder="https://drive.google.com/..."
            />
          </Field>

          <Field label="Link web (opcional, botón alternativo)">
            <input
              value={form.web_url}
              onChange={(e) => setForm({ ...form, web_url: e.target.value })}
              className={inputClass}
              placeholder="https://..."
            />
          </Field>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">Todavía no hay nada acá. Agregá el primero.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[rgb(24,24,27)] border border-green-500/10 rounded-lg p-4 flex gap-4"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-md flex-shrink-0 bg-zinc-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '0.2';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold truncate">{item.title}</h4>
                <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                {item.download_url && (
                  <a
                    href={item.download_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-500 text-xs inline-flex items-center gap-1 mt-1 hover:underline"
                  >
                    Ver link <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="text-gray-300 hover:text-green-500 transition-colors"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LogsPanel() {
  const [logs, setLogs] = React.useState<AdminLog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setLogs((data ?? []) as AdminLog[]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-400">Cargando...</p>;
  if (logs.length === 0) return <p className="text-gray-500">Todavía no hay actividad registrada.</p>;

  return (
    <div className="bg-[rgb(24,24,27)] border border-green-500/10 rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-zinc-800">
            <th className="p-3">Fecha</th>
            <th className="p-3">Admin</th>
            <th className="p-3">Acción</th>
            <th className="p-3">Categoría</th>
            <th className="p-3">Contenedor</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-zinc-900 last:border-0">
              <td className="p-3 text-gray-400 whitespace-nowrap">
                {new Date(log.created_at).toLocaleString('es-AR')}
              </td>
              <td className="p-3 text-white">{log.admin_email}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    log.action === 'eliminar'
                      ? 'bg-red-500/10 text-red-400'
                      : log.action === 'crear'
                      ? 'bg-green-500/10 text-green-400'
                      : log.action === 'editar'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-zinc-700/40 text-gray-300'
                  }`}
                >
                  {log.action}
                </span>
              </td>
              <td className="p-3 text-gray-400">{log.category ?? '-'}</td>
              <td className="p-3 text-gray-400">{log.container_title ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inputClass =
  'w-full px-4 py-2 bg-zinc-900 text-white rounded-md border border-zinc-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}
