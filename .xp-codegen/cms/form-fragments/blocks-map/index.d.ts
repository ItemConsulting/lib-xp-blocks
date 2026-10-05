export type BlocksMap = {
  /**
   * Centre
   */
  center: string;

  /**
   * Zoom
   */
  zoom: number;

  /**
   * Markers
   */
  markers?: Array<
    | {
        /**
         * Selected
         */
        _selected: "popup";

        /**
         * Popup
         */
        popup: {
          /**
           * Position
           */
          lngLat: string;

          /**
           * Text
           */
          text?: string;
        };
      }
  >;
};
