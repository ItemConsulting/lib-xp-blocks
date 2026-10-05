export type _BlocksCard = {
  /**
   * Title
   */
  title?: string;

  /**
   * Kicker
   */
  kicker?: string;

  /**
   * Text
   */
  text?: string;

  /**
   * Link
   */
  link:
    | {
        /**
         * Selected
         */
        _selected: "internal";

        /**
         * Internal
         */
        internal: {
          /**
           * Internal link
           */
          contentId: string;
        };
      }
    | {
        /**
         * Selected
         */
        _selected: "external";

        /**
         * External
         */
        external: {
          /**
           * External link
           */
          url: string;
        };
      };

  /**
   * Image
   */
  imageId?: string;
};
