export type Images = {
  id: string;
  locale: string;
  images: GalleryImage[];
};

export type GalleryImage = {
  src: string;
  fullSizeSrc: string;
  altText?: string;
  caption?: string;
  width: number;
  height: number;
};
