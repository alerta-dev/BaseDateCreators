import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Error no controlado:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
          <div className="max-w-md text-center space-y-3">
            <h1 className="text-xl font-semibold">Algo salió mal</h1>
            <p className="text-gray-400 text-sm">
              La página no pudo cargar correctamente. Probá recargar; si el
              problema sigue, revisá la consola del navegador para más
              detalles.
            </p>
            <p className="text-gray-600 text-xs break-words">
              {this.state.error.message}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
