export type BlocksMap = {
  locale: string;
  lng: string;
  lat: string;
  zoom: number;
  markers: Marker[];
  styleSrc: string;
};

export type Marker = {
  type: "popup";
  lng: string;
  lat: string;
  text: string;
};
