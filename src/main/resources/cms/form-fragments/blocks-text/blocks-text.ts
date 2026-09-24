import type { Response } from "@enonic-types/core";
import { render } from "/lib/freemarker";
import { processHtml } from "/lib/xp/portal";
import { toSnakeCase } from "../../../lib/item/blocks/utils";
import type { BlockProcessorParams } from "../blocks/blocks";
import type { BlocksText as RawBlocksText } from ".";
import type { BlocksText } from "./blocks-text.freemarker";

const view = resolve("blocks-text.ftlh");

export function process(block: RawBlocksText, { locale }: BlockProcessorParams): Response {
  const model: BlocksText = {
    locale,
    id: toSnakeCase(block.title),
    title: block.title,
    text: processHtml({
      value: block.text ?? "",
    }),
  };

  return {
    body: render<BlocksText>(view, model),
  };
}
