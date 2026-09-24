import React from 'react';
import { Monitor, Puzzle, Image, Palette, Music, Box } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import heroImage from '../assets/hero.png';

interface HomePageProps {
  onNavigate: (section: string) => void;
}

// TODO: reemplazá este link por la invitación real de tu servidor de Discord
const DISCORD_URL = 'https://discord.com/invite/Y2VUgTE';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 127.14 96.36"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.93,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.93,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}

export function HomePage({ onNavigate }: HomePageProps) {
  const categories = [
    {
      title: 'Programas',
      description: 'Explora nuestra colección de programas disponibles para descarga.',
      icon: Monitor,
      href: 'programas'
    },
    {
      title: 'Plugins',
      description: 'Explora nuestra colección de plugins disponibles para descarga.',
      icon: Puzzle,
      href: 'plugins'
    },
    {
      title: 'Renders',
      description: 'Explora nuestra colección de renders disponibles para descarga.',
      icon: Image,
      href: 'renders'
    },
    {
      title: 'Fondos',
      description: 'Explora nuestra colección de fondos disponibles para descarga.',
      icon: Palette,
      href: 'fondos'
    },
    {
      title: 'Sonidos',
      description: 'Explora nuestra colección de sonidos disponibles para descarga.',
      icon: Music,
      href: 'sonidos'
    },
    {
      title: 'Materiales',
      description: 'Explora nuestra colección de materiales disponibles para descarga.',
      icon: Box,
      href: 'materiales'
    }
  ];

  return (
    <>
      {/* Hero */}
      <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Imagen / ilustración */}
        <div className="order-2 lg:order-1 flex justify-center">
          <div className="relative w-full max-w-md aspect-video rounded-2xl bg-[rgb(24,24,27)] border border-green-500/10 flex items-center justify-center overflow-hidden">
          <img src={heroImage} alt="LoquendoAlertCreators" className="w-full h-full object-cover" /> 
          </div>
        </div>

        {/* Título, descripción y botón de Discord */}
        <div className="order-1 lg:order-2 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bienvenido a LoquendoAlertCreators
          </h1>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto lg:mx-0">
            Tu portal de descargas para recursos digitales. Encuentra programas, plugins, renders y mucho más. Todo lo que necesitas en un solo lugar.
          </p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <DiscordIcon className="h-5 w-5" />
            Únete a nuestro Discord
          </a>
        </div>
      </div>

      {/* Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <CategoryCard
            key={category.href}
            title={category.title}
            description={category.description}
            icon={category.icon}
            onClick={() => onNavigate(category.href)}
          />
        ))}
      </div>
    </>
  );
}
