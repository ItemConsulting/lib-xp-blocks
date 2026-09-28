import { localize } from "/lib/xp/i18n";
import { pageUrl } from "/lib/xp/portal";
import type { BlockProcessorParams } from "../blocks/blocks";
import type { _BlocksLinkToMore } from ".";
import type { BlocksLinkToMore } from "./_blocks-link-to-more.freemarker";

export function process(block: _BlocksLinkToMore, params: BlockProcessorParams): BlocksLinkToMore {
  return {
    linkToMoreUrl: block.linkToMoreContentId
      ? pageUrl({
          id: block.linkToMoreContentId,
        })
      : undefined,
    linkToMoreText:
      block.linkToMoreText ??
      localize({
        key: "form-fragments._blocks-link-to-more.readMoreText",
        locale: params.locale,
        fallbackMessage: "Read more",
      }),
  };
}
