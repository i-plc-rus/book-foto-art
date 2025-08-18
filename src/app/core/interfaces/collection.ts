export interface CollectionCreateDto {
  name: string;
  date: string | null;
}

export interface CollectionCreateResponse {
  id: string;
  name: string;
  date: string;
}
