export interface ICollectionInfo {
  cover_thumbnail_url: string;
  cover_url: string;
  created_at: string;
  date: string;
  id: string;
  name: string;
  user_id: string;
  username: string;
}

export interface ICollectionPhoto {
  files: IUploadedPhoto[];
  sort: string;
}

export interface IUploadedPhoto {
  collection_id: string;
  file_ext: string;
  file_name: string;
  hash_name: string;
  id: string;
  original_url: string;
  thumbnail_url: string;
  uploaded_at: string;
  user_id: string;
}

export type PreviewItem = { link: string; isFavorite: boolean };

export interface IPublishResponse {
  link: string; // короткая ссылка
}

export interface SuccessResponse {
  success: boolean;
}

export interface IShortLinkInfo {
  click_count: number;
  collection_id: string;
  created_at: string;
  id: string;
  token: string;
  url: string;
  name: string;
  username: string;
  cover_url: string;
}
