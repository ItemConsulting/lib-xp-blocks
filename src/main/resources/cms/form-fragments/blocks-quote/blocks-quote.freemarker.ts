import type { ImageParams } from "../../../lib/item/blocks/images";

export type BlocksQuote = {
  locale: string;
  quote: string;
  attribution?: string;
  image?: ImageParams;
};
