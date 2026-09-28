import type { Response } from "@enonic-types/core";
import { render } from "/lib/freemarker";
import { processHtml } from "/lib/xp/portal";
import type { _BlocksColor as BlocksColor } from "../_blocks-color";
import type { BlockProcessorParams } from "../blocks/blocks";
import type { BlocksTextHighlighted as RawBlocksTextHighlighted } from ".";
import type { BlocksTextHighlighted } from "./blocks-text-highlighted.freemarker";

type RawBlocksTextHighlightedAndColor = RawBlocksTextHighlighted & BlocksColor;

const view = resolve("blocks-text-highlighted.ftlh");

export function process(block: RawBlocksTextHighlightedAndColor, { locale }: BlockProcessorParams): Response {
  const model: BlocksTextHighlighted = {
    locale,
    title: block.title,
    text: processHtml({ value: block.text ?? "" }),
    color: block.color,
  };

  return {
    body: render<BlocksTextHighlighted>(view, model),
  };
}
