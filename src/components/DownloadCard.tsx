import React from 'react';
import { Download } from 'lucide-react';
import { ImageLoader } from './ImageLoader';

interface DownloadCardProps {
  title: string;
  description: string;
  imageUrl: string;
  downloadUrl?: string;
  webUrl?: string;
}

export function DownloadCard({ title, description, imageUrl, downloadUrl, webUrl }: DownloadCardProps) {
  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const handleWebUrl = () => {
    if (webUrl) {
      window.open(webUrl, '_blank');
    }
  };

  return (
    <div className="bg-[rgb(24,24,27)] rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/10 transition-shadow border border-green-500/10 hover:border-green-500/30">
      <ImageLoader 
        src={imageUrl} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="flex gap-2">
          {downloadUrl && (
            <button 
              onClick={handleDownload}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Descargar
            </button>
          )}
          {webUrl && (
            <button 
              onClick={handleWebUrl}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              URL
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
