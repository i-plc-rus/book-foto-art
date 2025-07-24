export interface IUploadFile {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  uploaded?: boolean;
  loaded: boolean;
}
