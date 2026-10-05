export type BlocksImages = {
  /**
   * Image
   */
  items: Array<{
    /**
     * Image
     */
    imageId: string;

    /**
     * Description of the image (alt text)
     */
    altText: string;

    /**
     * Caption
     */
    caption?: string;
  }>;
};
