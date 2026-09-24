import React from 'react';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageLoader({ src, alt, className = '' }: ImageLoaderProps) {
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    // Limpiar estado cuando cambia la URL
    setIsLoading(true);
    setError(false);
    setImageSrc('');

    // Añadir timestamp para evitar caché
    const imageUrl = `${src}${src.includes('?') ? '&' : '?'}t=${Date.now()}`;
    
    // Precargar imagen
    const img = new Image();
    img.onload = () => {
      setImageSrc(imageUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
    img.src = imageUrl;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (isLoading) {
    return (
      <div className={`${className} bg-zinc-800 animate-pulse flex items-center justify-center`}>
        <svg className="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-zinc-800 flex items-center justify-center`}>
        <div className="text-center text-zinc-500">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-sm">Error al cargar</p>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      loading="eager"
    />
  );
}
