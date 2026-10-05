import type { Response } from "@enonic-types/core";

declare class FragmentScriptBean {
  render(fragmentId: string): Response | null;
}

const bean = __.newBean<FragmentScriptBean>("no.item.blocks.FragmentScriptBean");

/**
 * Renders a content of the type "portal:fragment" the way the portal renders a fragment that is placed on the page.
 * Returns an empty response when the portal has not rendered it, which is when no content is being rendered, or the
 * request is neither a GET nor a POST.
 */
export function render(fragmentId: string): Response {
  return __.toNativeObject(bean.render(fragmentId)) ?? {};
}
