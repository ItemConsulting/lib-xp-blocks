import type { Response } from "@enonic-types/core";
import { render } from "/lib/freemarker";
import { imageUrl } from "/lib/xp/portal";
import { forceArray, partPathToId } from "../../../lib/item/blocks/utils";
import type { _BlocksIntro as BlocksIntro } from "../_blocks-intro";
import { process as processIntro } from "../_blocks-intro/_blocks-intro";
import type { BlocksIntro as BlocksIntroModel } from "../_blocks-intro/_blocks-intro.freemarker";
import type { BlockProcessorParams } from "../blocks/blocks";
import type { BlocksImages as RawBlocksImages } from ".";
import type { GalleryImage, Images } from "./blocks-images.freemarker";

type BlocksImagesItemRaw = RawBlocksImages["items"][number];
type RawBlocksImagesAndIntro = RawBlocksImages & BlocksIntro;

const view = resolve("blocks-images.ftlh");

export function process(
  block: RawBlocksImagesAndIntro,
  { component, locale, blockIndex }: BlockProcessorParams,
): Response {
  const model: Images & BlocksIntroModel = {
    ...processIntro(block),
    id: `${partPathToId(component.path)}-${blockIndex}`,
    locale,
    images: forceArray(block.items).map(getImage),
  };

  return {
    body: render<Images & BlocksIntroModel>(view, model),
  };
}

function getImage(item: BlocksImagesItemRaw, _: number, arr: BlocksImagesItemRaw[]): GalleryImage {
  const isSingleImage = arr.length === 1;
  const width = isSingleImage ? 640 : 400;
  const height = isSingleImage ? 384 : 240;

  return {
    src: imageUrl({
      id: item.imageId,
      scale: `block(${width}, ${height})`,
    }),
    fullSizeSrc: imageUrl({
      id: item.imageId,
      scale: "full",
    }),
    altText: item.altText,
    caption: item.caption,
    width,
    height,
  };
}
