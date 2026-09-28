export type BlocksAccordion = {
  id?: string;
  locale: string;
  classes?: string;
  color?: string;
  items: Disclosure[];
};

export type Disclosure = {
  title: string;
  text: string;
};
