import { processHtml } from "/lib/xp/portal";
import type { _BlocksIntro as BlocksIntroRaw } from ".";
import type { BlocksIntro } from "./_blocks-intro.freemarker";

export function process(block: BlocksIntroRaw): BlocksIntro {
  return {
    title: block.title,
    text: block.text ? processHtml({ value: block.text }) : undefined,
  };
}
