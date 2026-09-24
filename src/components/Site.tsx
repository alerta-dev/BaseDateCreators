import React from 'react';
import { Navbar } from './Navbar';
import { DownloadCard } from './DownloadCard';
import { SectionHeader } from './SectionHeader';
import { HomePage } from './HomePage';
import { useContainers } from '../hooks/useContainers';
import { containerToDownloadItem, type Category } from '../types';

const SECTION_INFO: Record<Category, { title: string; description: string }> = {
  programas: {
    title: 'Programas',
    description: 'Software profesional para creativos y desarrolladores',
  },
  plugins: {
    title: 'Plugins',
    description: 'Complementos y extensiones para mejorar tu flujo de trabajo',
  },
  renders: {
    title: 'Renders',
    description: 'Recursos visuales de alta calidad para tus proyectos',
  },
  fondos: {
    title: 'Fondos',
    description: 'Fondos y texturas en alta resolución',
  },
  sonidos: {
    title: 'Sonidos',
    description: 'Efectos de sonido y recursos de audio',
  },
  materiales: {
    title: 'Materiales',
    description: 'Materiales y texturas para modelado 3D',
  },
};

function isCategory(value: string): value is Category {
  return value in SECTION_INFO;
}

export function Site() {
  const [currentSection, setCurrentSection] = React.useState('inicio');
  const [searchQuery, setSearchQuery] = React.useState('');

  const activeCategory = isCategory(currentSection) ? currentSection : null;
  const { items, loading } = useContainers(activeCategory);

  const sectionContent = activeCategory ? SECTION_INFO[activeCategory] : null;
  const downloadItems = React.useMemo(() => items.map(containerToDownloadItem), [items]);

  // Filtrar items basado en la búsqueda
  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return downloadItems;
    }

    const query = searchQuery.toLowerCase().trim();
    return downloadItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [downloadItems, searchQuery]);

  // Limpiar búsqueda al cambiar de sección
  React.useEffect(() => {
    setSearchQuery('');
  }, [currentSection]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar onNavigate={setCurrentSection} currentSection={currentSection} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentSection === 'inicio' ? (
          <HomePage onNavigate={setCurrentSection} />
        ) : sectionContent && (
          <>
            <SectionHeader title={sectionContent.title} description={sectionContent.description} />

            {/* Buscador */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o descripción..."
                  className="w-full px-6 py-4 bg-zinc-900 text-white rounded-xl border border-zinc-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all placeholder-zinc-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Contador de resultados */}
              {searchQuery && (
                <p className="text-center mt-3 text-zinc-400">
                  {filteredItems.length === 0 ? (
                    'No se encontraron resultados'
                  ) : (
                    `${filteredItems.length} resultado${filteredItems.length !== 1 ? 's' : ''} encontrado${filteredItems.length !== 1 ? 's' : ''}`
                  )}
                </p>
              )}
            </div>

            {/* Grid de resultados */}
            {loading ? (
              <p className="text-center text-zinc-400">Cargando...</p>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, index) => (
                  <DownloadCard
                    key={`${currentSection}-${index}`}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.imageUrl}
                    downloadUrl={item.downloadUrl}
                    webUrl={item.webUrl}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl text-zinc-400 mb-2">
                  {searchQuery ? 'No se encontraron resultados' : 'Todavía no hay nada acá'}
                </h3>
                <p className="text-zinc-500">
                  {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Vuelve pronto por más contenido'}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
