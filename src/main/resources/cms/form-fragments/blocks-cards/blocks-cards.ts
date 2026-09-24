import type { Response } from "@enonic-types/core";
import { render } from "/lib/freemarker";
import { concat as concatResponse, responseBodyToString } from "../../../lib/item/blocks/responses";
import { forceArray } from "../../../lib/item/blocks/utils";
import type { _BlocksColor, _BlocksIntro, _BlocksLinkToMore } from "..";
import { process as processCard } from "../_blocks-card/_blocks-card";
import { process as processIntro } from "../_blocks-intro/_blocks-intro";
import type { BlocksIntro as BlocksIntroModel } from "../_blocks-intro/_blocks-intro.freemarker";
import { process as processLinkToMore } from "../_blocks-link-to-more/_blocks-link-to-more";
import type { BlocksLinkToMore } from "../_blocks-link-to-more/_blocks-link-to-more.freemarker";
import type { BlockProcessorParams } from "../blocks/blocks";
import type { BlocksCards as BlocksCardsRaw } from ".";
import type { BlocksCards } from "./blocks-cards.freemarker";

type BlocksCardsRawWithOptionalFields = BlocksCardsRaw & _BlocksIntro & _BlocksColor & _BlocksLinkToMore;

const view = resolve("blocks-cards.ftlh");

export function process(block: BlocksCardsRawWithOptionalFields, params: BlockProcessorParams): Response {
  const renderedCards = forceArray(block.items)
    .map((item, cardIndex) => processCard({ ...item, color: block.color }, params, cardIndex))
    .reduce(concatResponse, {});

  const model: BlocksCards & BlocksIntroModel & BlocksLinkToMore = {
    ...processIntro(block),
    locale: params.locale,
    color: block.color,
    cardsMarkup: responseBodyToString(renderedCards.body),
    ...processLinkToMore(block, params),
  };

  return {
    body: render<BlocksCards & BlocksIntroModel & BlocksLinkToMore>(view, model),
  };
}
