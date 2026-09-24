import React from 'react';

interface SectionHeaderProps {
  title: string;
  description: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-12 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
      <p className="text-gray-400 max-w-2xl mx-auto">{description}</p>
    </div>
  );
}