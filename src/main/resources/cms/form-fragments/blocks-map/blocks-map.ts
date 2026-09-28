import type { Response } from "@enonic-types/core";
import { assetUrl } from "/lib/enonic/asset";
import { render } from "/lib/freemarker";
import { processHtml } from "/lib/xp/portal";
import { forceArray, notNullOrUndefined } from "../../../lib/item/blocks/utils";
import type { _BlocksIntro as BlocksIntro } from "../_blocks-intro";
import { process as processIntro } from "../_blocks-intro/_blocks-intro";
import type { BlocksIntro as BlocksIntroModel } from "../_blocks-intro/_blocks-intro.freemarker";
import type { BlockProcessorParams } from "../blocks/blocks";
import type { BlocksMap as RawBlocksMap } from ".";
import type { BlocksMap, Marker } from "./blocks-map.freemarker";

const view = resolve("blocks-map.ftlh");

type MarkerRaw = NonNullable<RawBlocksMap["markers"]>[number];
type RawBlocksMapAndIntro = RawBlocksMap & BlocksIntro;

export function process(block: RawBlocksMapAndIntro, { locale }: BlockProcessorParams): Response {
  const [lat, lng] = block.center.split(",");
  const assetBaseUrl = assetUrl({ path: "" });
  const mapLibreBaseUrl = `${assetBaseUrl}/maplibre-gl`;

  const model: BlocksMap & BlocksIntroModel = {
    ...processIntro(block),
    locale,
    lng,
    lat,
    zoom: block.zoom,
    markers: forceArray(block.markers).map(getSimpleMarker).filter(notNullOrUndefined),
    styleSrc: `${mapLibreBaseUrl}/maplibre-gl.css`,
  };

  return {
    body: render<BlocksMap & BlocksIntroModel>(view, model),
    pageContributions: {
      headBegin: [
        `<link rel="preload" href="${model.styleSrc}" as="style" />`,
        // Imported by scripts/blocks/maplibre-gl.mjs; the worker (maplibre-gl-worker.mjs) is loaded by maplibre itself
        `<link rel="modulepreload" href="${mapLibreBaseUrl}/maplibre-gl.mjs" />`,
        `<link rel="modulepreload" href="${mapLibreBaseUrl}/maplibre-gl-shared.mjs" />`,
      ],
      headEnd: [`<script type="module" src="${assetBaseUrl}/scripts/blocks/maplibre-gl.mjs"></script>`],
    },
  };
}

function getSimpleMarker(markerRaw: MarkerRaw): Marker | undefined {
  switch (markerRaw._selected) {
    case "popup": {
      const [lat, lng] = markerRaw.popup.lngLat.split(",");

      return {
        type: "popup",
        lng,
        lat,
        text: processHtml({
          value: markerRaw.popup.text ?? "",
        }),
      };
    }
    default:
      return undefined;
  }
}
