import type { Response } from "@enonic-types/core";
import { render } from "/lib/freemarker";
import { get as getOne } from "/lib/xp/content";
import { processHtml } from "/lib/xp/portal";
import { getImageParams, type ImageParams } from "../../../lib/item/blocks/images";
import { processLink } from "../../../lib/item/blocks/links";
import type { ContentImage, ContentVector } from "../../../lib/item/blocks/types";
import { isEmptyOrUndefined, partPathToId } from "../../../lib/item/blocks/utils";
import type { _BlocksColor, _BlocksCard as BlocksCardRaw } from "..";
import type { BlockProcessorParams } from "../blocks/blocks";
import type { BlocksCard } from "./_blocks-card.freemarker";

const WIDTH_CONTAINER = 676; // At 620 multi column layouts will become single column
const WIDTH_LARGEST_IN_CARD = 431; // Largest common width in multi column layouts
const IMAGE_PROPORTION_16_9 = 9 / 16;

const view = resolve("_blocks-card.ftlh");

export function process(
  block: BlocksCardRaw & _BlocksColor,
  { locale, component, blockIndex }: BlockProcessorParams,
  cardIndex?: number,
): Response {
  const image = block.imageId
    ? (getOne<ContentImage | ContentVector>({
        key: block.imageId,
      }) ?? undefined)
    : undefined;

  const link = processLink(block.link);
  const imageOnly = block.imageId !== undefined && [block.kicker, block.title, block.text].every(isEmptyOrUndefined);

  const model: BlocksCard = {
    locale,
    id: `${partPathToId(component.path)}-${blockIndex}${cardIndex !== undefined ? `-${cardIndex}` : ""}`,
    url: link.url,
    color: block.color,
    classes: `blocks-card--link-${link.type}`,
    kicker: block.kicker,
    title: block.title,
    text: processHtml({ value: block.text ?? "" }),
    image: image
      ? getImage({
          imageContent: image,
          imageOnly,
        })
      : undefined,
  };

  return {
    body: render<BlocksCard>(view, model),
  };
}

function getImage({ imageContent, imageOnly }: GetImageSrcParams): ImageParams {
  const width = imageOnly ? WIDTH_CONTAINER : getImageMaxWidth();
  const height = Math.round(width * IMAGE_PROPORTION_16_9);

  return getImageParams({
    imageContent,
    width,
    height,
  });
}

function getImageMaxWidth(): number {
  try {
    return app.config.cardImageMaxWidth ? parseInt(app.config.cardImageMaxWidth, 10) : WIDTH_LARGEST_IN_CARD;
  } catch {
    log.error('"cardImageMaxWidth" in configuration does not contain a valid value');
  }

  return WIDTH_LARGEST_IN_CARD;
}

type GetImageSrcParams = {
  imageContent: ContentImage | ContentVector;
  imageOnly: boolean;
};
