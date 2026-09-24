export type Category =
  | 'programas'
  | 'plugins'
  | 'renders'
  | 'fondos'
  | 'sonidos'
  | 'materiales';

export interface Container {
  id: string;
  category: Category;
  title: string;
  description: string;
  image_url: string;
  download_url: string | null;
  web_url: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Forma que usan los componentes visuales existentes (DownloadCard, etc.)
export interface DownloadItem {
  title: string;
  description: string;
  imageUrl: string;
  downloadUrl?: string;
  webUrl?: string;
}

export function containerToDownloadItem(c: Container): DownloadItem {
  return {
    title: c.title,
    description: c.description,
    imageUrl: c.image_url,
    downloadUrl: c.download_url ?? undefined,
    webUrl: c.web_url ?? undefined,
  };
}

export interface AdminLog {
  id: string;
  admin_email: string;
  action: 'crear' | 'editar' | 'eliminar' | 'login';
  category: Category | null;
  container_title: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}
