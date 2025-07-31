export interface IUploadFile {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  uploaded?: boolean;
  loaded: boolean;
}

export interface ISavedGallery {
  name: string;
  createDate: string;
  images: string[];
}

export const GALLERY_STORAGE_KEY = 'savedGalleries';
