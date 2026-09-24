import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function CategoryCard({ title, description, icon: Icon, onClick }: CategoryCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-[rgb(24,24,27)] rounded-lg p-6 cursor-pointer hover:bg-[rgb(24,24,27)]/80 transition-all border border-green-500/10 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5"
    >
      <Icon className="h-8 w-8 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}