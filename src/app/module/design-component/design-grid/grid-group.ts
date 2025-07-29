export interface GridItem {
  id: string;
  name: string;
  image: string;
}

export interface GridGroup {
  title: string;
  items: GridItem[];
}
