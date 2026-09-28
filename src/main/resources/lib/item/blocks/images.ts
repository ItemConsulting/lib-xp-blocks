import { get as getOne } from "/lib/xp/content";
import { imageUrl } from "/lib/xp/portal";
import type { ContentImage, ContentVector } from "./types";

export function getImageParamsById({
  key,
  width,
  height,
  format,
  filter,
}: GetImageParamsByIdParams): ImageParams | undefined {
  const imageContent = key ? getOne<ContentImage | ContentVector>({ key }) : undefined;
  return imageContent
    ? getImageParams({
        imageContent,
        width,
        height,
        format,
        filter,
      })
    : undefined;
}

export type GetImageParamsByIdParams = {
  key?: string;
  width: number;
  height: number;
  format?: string;
  filter?: string;
};

export function getImageParams({ imageContent, width, height, format, filter }: GetImageParamsParams): ImageParams {
  return {
    src: imageUrl({
      path: imageContent._path,
      scale: `block(${width},${height})`,
      format: format ?? (imageContent.type === "media:image" ? "jpg" : undefined),
      quality: 75,
      filter,
    }),
    width,
    height,
    altText: imageContent.type === "media:image" ? imageContent.data.altText : undefined,
    caption: imageContent.data.caption,
    copyright: imageContent.data.copyright,
  };
}

export type GetImageParamsParams = {
  imageContent: ContentImage | ContentVector;
  width: number;
  height: number;
  format?: string;
  filter?: string;
};

export type ImageParams = {
  src: string;
  width: number;
  height: number;
  altText?: string;
  caption?: string;
  copyright?: string;
};
