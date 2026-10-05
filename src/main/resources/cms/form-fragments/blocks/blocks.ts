import type { Component, Request, Response } from "@enonic-types/core";
import { render } from "/lib/freemarker";
import { type Content, get as getOne } from "/lib/xp/content";
import { getComponent, getContent } from "/lib/xp/portal";
import { render as renderFragment } from "../../../lib/item/blocks/fragments";
import { concat as concatResponse, responseBodyToString } from "../../../lib/item/blocks/responses";
import type { Optional } from "../../../lib/item/blocks/types";
import { forceArray } from "../../../lib/item/blocks/utils";
import { process as processBlocksAccordion } from "../blocks-accordion/blocks-accordion";
import { process as processBlocksCards } from "../blocks-cards/blocks-cards";
import { process as processBlocksImages } from "../blocks-images/blocks-images";
import { process as processBlocksMap } from "../blocks-map/blocks-map";
import { process as processBlocksQuote } from "../blocks-quote/blocks-quote";
import type { BlocksReuse as BlocksReuseRaw } from "../blocks-reuse";
import { process as processBlocksText } from "../blocks-text/blocks-text";
import { process as processBlocksTextHighlighted } from "../blocks-text-highlighted/blocks-text-highlighted";
import type { Blocks as BlocksRaw } from ".";
import type { Blocks } from "./blocks.freemarker";

export { concat as concatResponse, responseBodyToString } from "../../../lib/item/blocks/responses";

export type BlockProcessor<Block> = (block: Block, params: BlockProcessorParams) => Response;

export type BlockProcessorParams = {
  content: Content<unknown>;
  component: Component;
  locale: string;
  req: Request;
  classes: string;
  blockIndex: number;
  processors: BlockProcessorMap;
};

export type ProcessableBlock = {
  _selected: string;
  [name: string]: unknown;
};

type BlockProcessorMap = Record<string, BlockProcessor<unknown>>;

const BLOCK_PROCESSORS_BUILT_IN: BlockProcessorMap = {
  "blocks-accordion": processBlocksAccordion as BlockProcessor<unknown>,
  "blocks-text": processBlocksText as BlockProcessor<unknown>,
  "blocks-images": processBlocksImages as BlockProcessor<unknown>,
  "blocks-text-highlighted": processBlocksTextHighlighted as BlockProcessor<unknown>,
  "blocks-cards": processBlocksCards as BlockProcessor<unknown>,
  "blocks-map": processBlocksMap as BlockProcessor<unknown>,
  "blocks-reuse": processBlocksReuse as BlockProcessor<unknown>,
  "blocks-quote": processBlocksQuote as BlockProcessor<unknown>,
};

const view = resolve("blocks.ftlh");

export type ProcessParams = Optional<
  BlockProcessorParams,
  "content" | "component" | "locale" | "classes" | "blockIndex" | "processors"
> & {
  blocks?: ProcessableBlock[];
  blocksClasses?: string;
};

export function process(params: ProcessParams): Response {
  const component = params.component ?? getComponent();
  const content = params.content ?? getContent();
  const locale = params.locale ?? content?.language ?? "no";

  if (!content) {
    throw new Error("Content not found in scope");
  }
  if (!component) {
    throw new Error("Component not found in scope");
  }

  const { body, ...response } = processBlocks(forceArray(params.blocks), {
    content,
    component,
    locale,
    classes: params.classes ?? "",
    req: params.req,
    processors: {
      ...BLOCK_PROCESSORS_BUILT_IN,
      ...params.processors,
    },
  });

  return {
    ...response,
    body: render<Blocks>(view, {
      classes: params.blocksClasses,
      blocksMarkup: responseBodyToString(body),
    }),
  };
}

function processBlocks(blocks: ProcessableBlock[], params: Optional<BlockProcessorParams, "blockIndex">): Response {
  return forceArray(blocks)
    .map((block, blockIndex) =>
      processBlock(block._selected, block[block._selected], {
        ...params,
        blockIndex,
      }),
    )
    .reduce<Response>(concatResponse, {});
}

export function processBlock(selected: string, block: unknown, params: BlockProcessorParams): Response {
  const processor = params.processors[selected];

  if (processor) {
    return processor(block, params);
  } else {
    throw new Error(`No processor registered for block type "${selected}"`);
  }
}

export function processBlocksReuse(block: BlocksReuseRaw, params: BlockProcessorParams): Response {
  const content = block.contentId ? getOne<Content<BlocksRaw>>({ key: block.contentId }) : undefined;

  /* A fragment has no blocks. It is rendered as it is, which lets a part take a place in the list of blocks */
  if (content?.type === "portal:fragment") {
    return renderFragment(content._id);
  }

  /* Use language of the imported content to add content with different [lang] in block list */
  const localizedParams: BlockProcessorParams = {
    ...params,
    locale: content?.language ?? params.locale,
  };

  return processBlocks(forceArray(content?.data.blocks), localizedParams);
}
