export interface IUploadFile {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  uploaded?: boolean;
  loaded: boolean;
}

export interface ISavedGallery {
  id: string;
  name: string;
  date: string;
  created_at: string;
  cover_url: string;
  cover_thumbnail_url: string;
  images?: any[];
  imagesCount?: number;
  preview?: string;
  createDate?: string;
}

export const GALLERY_STORAGE_KEY = 'savedGalleries';

export interface UploadFile {
  id: string;
  file: File | ServerFile;
  progress: number;
  previewUrl: string;
  loaded: boolean;
  error?: boolean;
}

export interface ServerFile {
  name: string;
  lastModified: number;
  size: number;
  type: string;
  hash: string;
}

export interface MenuOption {
  id: string;
  name: string;
  iconUrl: string;
  subMenu?: SubMenuOption[];
}

export interface SubMenuOption {
  id: string;
  name: string;
  iconUrl: string;
}
