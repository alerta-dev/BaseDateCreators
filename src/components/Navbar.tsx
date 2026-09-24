import React from 'react';
import { Monitor, Puzzle, Image, Palette, Music, Box, Home } from 'lucide-react';
import logo from '../assets/logo.png';

const navigation = [
  { name: 'Inicio', href: 'inicio', icon: Home },
  { name: 'Programas', href: 'programas', icon: Monitor },
  { name: 'Plugins', href: 'plugins', icon: Puzzle },
  { name: 'Renders', href: 'renders', icon: Image },
  { name: 'Fondos', href: 'fondos', icon: Palette },
  { name: 'Sonidos', href: 'sonidos', icon: Music },
  { name: 'Materiales', href: 'materiales', icon: Box },
];

interface NavbarProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export function Navbar({ onNavigate, currentSection }: NavbarProps) {
  return (
    <nav className="bg-black border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('inicio')}>
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </div>
          <div className="flex space-x-4">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate(item.href)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2
                  ${currentSection === item.href
                    ? 'text-green-500 bg-green-500/10 border border-green-500/20'
                    : 'text-gray-300 hover:text-green-500 hover:bg-green-500/5 border border-transparent'
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}