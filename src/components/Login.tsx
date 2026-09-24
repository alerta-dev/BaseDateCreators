import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const from = (location.state as { from?: string })?.from ?? '/admin';

  React.useEffect(() => {
    if (session) {
      navigate(from, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: signInError } = await signIn(email.trim(), password);

    setSubmitting(false);

    if (signInError) {
      setError('Correo o contraseña incorrectos.');
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[rgb(24,24,27)] border border-green-500/10 rounded-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-full p-3 mb-4">
            <Lock className="h-6 w-6 text-green-500" />
          </div>
          <h1 className="text-xl font-semibold text-white">Acceso de administradores</h1>
          <p className="text-gray-400 text-sm mt-1 text-center">
            Esta sección es privada. Si no sos administrador, no hay nada para vos acá.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
              Correo
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 text-white rounded-md border border-zinc-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 text-white rounded-md border border-zinc-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
