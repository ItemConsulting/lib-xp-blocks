import type { Response } from "@enonic-types/core";
import { render } from "/lib/freemarker";
import { processHtml } from "/lib/xp/portal";
import { forceArray, toSnakeCase } from "../../../lib/item/blocks/utils";
import type { _BlocksColor as BlocksColor } from "../_blocks-color";
import type { _BlocksIntro as BlocksIntro } from "../_blocks-intro";
import { process as processIntro } from "../_blocks-intro/_blocks-intro";
import type { BlocksIntro as BlocksIntroModel } from "../_blocks-intro/_blocks-intro.freemarker";
import type { BlockProcessorParams } from "../blocks/blocks";
import type { BlocksAccordion as RawBlocksAccordion } from ".";
import type { BlocksAccordion } from "./blocks-accordion.freemarker";

type RawBlocksAccordionAndColor = RawBlocksAccordion & BlocksIntro & BlocksColor;

const view = resolve("blocks-accordion.ftlh");

export function process(block: RawBlocksAccordionAndColor, { locale }: BlockProcessorParams): Response {
  const model: BlocksAccordion & BlocksIntroModel = {
    ...processIntro(block),
    id: toSnakeCase(block.title),
    locale,
    color: block.color,
    items: forceArray(block.items).map((item) => ({
      title: item.title,
      text: processHtml({
        value: item.text ?? "",
      }),
    })),
  };

  return {
    body: render<BlocksAccordion & BlocksIntroModel>(view, model),
  };
}
