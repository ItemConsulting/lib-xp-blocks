import { processHtml } from "/lib/xp/portal";
import type { _BlocksIntro as BlocksIntroRaw } from ".";
import type { BlocksIntro } from "./_blocks-intro.freemarker";

/**
 * Returns the model of `_blocks-intro.ftlh`. A block that includes the intro template spreads this into its own model,
 * since an included template reads the variables of the template that includes it.
 */
export function process(block: BlocksIntroRaw): BlocksIntro {
  return {
    title: block.title,
    text: block.text ? processHtml({ value: block.text }) : undefined,
  };
}
