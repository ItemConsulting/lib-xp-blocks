import type { ImageParams } from "../../../lib/item/blocks/images";

export type BlocksCard = {
  id: string;
  locale: string;
  url?: string;
  classes?: string;
  color?: string;
  variant?: "default" | "tinted";
  image?: ImageParams;
  kicker?: string;
  title?: string;
  text?: string;
};
