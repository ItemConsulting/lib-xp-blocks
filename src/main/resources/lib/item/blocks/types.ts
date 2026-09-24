import type { Content } from "/lib/xp/content";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type PickSelected<OPTION_SET extends { _selected: string }, SELECTED extends string> = Extract<
  OPTION_SET,
  { _selected: SELECTED }
>;

export type PickSelectedValue<
  OPTION_SET extends { _selected: string },
  SELECTED extends string,
> = SELECTED extends keyof PickSelected<OPTION_SET, SELECTED> ? PickSelected<OPTION_SET, SELECTED>[SELECTED] : never;

// Built in
export type BaseMedia<Media extends object = BaseMediaConfig> = {
  media: Media;
  caption?: string;
  artist?: string | string[];
  copyright?: string;
  tags?: string | string[];
};

export interface BaseMediaConfig {
  attachment: string;
}

export type Image = BaseMedia<ImageConfig> & {
  altText?: string;
};

export type ImageConfig = {
  attachment: string;
  focalPoint: {
    x: number;
    y: number;
  };
  zoomPosition: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  cropPosition: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    zoom: number;
  };
};

export type ContentImage = Content<Image, "media:image">;
export type ContentVector = Content<BaseMedia, "media:vector">;
export type ContentMedia = Content<BaseMedia, `media:${string}`>;

export type Color = {
  light: string;
  dark: string;
};

export type ColorPalette = Record<string, string | Color>;
