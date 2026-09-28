import type { Response } from "@enonic-types/core";
import type { CustomSelectorServiceResponseBody } from "@item-enonic-types/global";
import { COLORS } from "../../../lib/item/blocks/colors";
import type { Color } from "../../../lib/item/blocks/types";
import { objectKeys } from "../../../lib/item/blocks/utils";

export function get(): Response<{ body: CustomSelectorServiceResponseBody }> {
  const hits = objectKeys(COLORS).map((name) => getHit(name, COLORS[name]));

  return {
    body: {
      total: hits.length,
      count: hits.length,
      hits,
    },
  };
}

function getHit(name: string, color: Color | string): CustomSelectorServiceResponseBody["hits"][number] {
  const [light, dark] = typeof color === "string" ? [color] : [color.light, color.dark];

  return {
    id: name,
    displayName: name,
    description: dark ? `${light} / ${dark}` : light,
    icon: {
      data: getColoredCircle(light, dark ?? light),
      type: "image/svg+xml",
    },
  };
}

function getColoredCircle(light: string, dark: string): string {
  return `<svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <style>@scope { :scope { color-scheme: light dark; } circle { fill: light-dark(${light}, ${dark}); } }</style>
    <circle cx="50" cy="50" r="50" fill="${light}" />
  </svg>`;
}
