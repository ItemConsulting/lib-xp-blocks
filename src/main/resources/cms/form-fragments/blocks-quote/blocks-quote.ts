import type { Response } from "@enonic-types/core";
import { render } from "/lib/freemarker";
import { processHtml } from "/lib/xp/portal";
import { getImageParamsById } from "../../../lib/item/blocks/images";
import type { _BlocksIntro as BlocksIntro } from "../_blocks-intro";
import { process as processIntro } from "../_blocks-intro/_blocks-intro";
import type { BlocksIntro as BlocksIntroModel } from "../_blocks-intro/_blocks-intro.freemarker";
import type { BlockProcessorParams } from "../blocks/blocks";
import type { BlocksQuote as RawBlocksQuote } from ".";
import type { BlocksQuote } from "./blocks-quote.freemarker";

type RawBlocksQuoteAndIntro = RawBlocksQuote & BlocksIntro;

const view = resolve("blocks-quote.ftlh");

export function process(block: RawBlocksQuoteAndIntro, { locale }: BlockProcessorParams): Response {
  const model: BlocksQuote & BlocksIntroModel = {
    ...processIntro(block),
    locale,
    quote: processHtml({ value: block.quote }),
    attribution: block.attribution,
    image: getImageParamsById({
      key: block.imageId,
      width: 200,
      height: 200,
      format: "png",
      filter: "rounded(100)",
    }),
  };

  return {
    body: render<BlocksQuote & BlocksIntroModel>(view, model),
  };
}
