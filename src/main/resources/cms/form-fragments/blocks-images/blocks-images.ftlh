[#-- @ftlvariable name="id" type="String" --]
[#-- @ftlvariable name="images" type="java.util.ArrayList" --]
[#-- @ftlvariable name="image.fullSizeSrc" type="String" --]
[#-- @ftlvariable name="image.caption" type="String" --]
[#-- @ftlvariable name="image.srcset" type="String" --]
[#-- @ftlvariable name="image.sizes" type="String" --]
[#-- @ftlvariable name="image.src" type="String" --]
[#-- @ftlvariable name="image.altText" type="String" --]
[#-- @ftlvariable name="image.width" type="Integer" --]
[#-- @ftlvariable name="image.height" type="Integer" --]
[#-- @ftlvariable name="locale" type="String" --]
[#-- @ftlvariable name="title" type="String" --]
[#-- @ftlvariable name="text" type="String" --]

[#setting locale=locale]

<div
  lang="${.lang}"
  class="blocks-images blocks-images-size-${(images![])?size}">

  [#include "../_blocks-intro/_blocks-intro.ftlh"]

  <popover-gallery
    class="blocks-images__gallery"
    data-popover-close-aria-label="${portal.localize("form-fragments.blocks-images.close")}">

    [#list images![] as image]
      <a
        href="${image.fullSizeSrc}"
        id="${id}-image-${image_index}"
        class="blocks-images--expand-link"
        target="_blank">

        [#if image.caption?has_content]
        <figure>
          <picture>
            <img
              src="${image.src}"
              alt="${image.altText!}"
              [#if image.width??]width="${image.width}"[/#if]
              [#if image.height??]height="${image.height}"[/#if]>
          </picture>
          <figcaption>${image.caption}</figcaption>
        </figure>
        [#else]
          <picture>
            <img
              src="${image.src}"
              alt="${image.altText!}"
              [#if image.width??]width="${image.width}"[/#if]
              [#if image.height??]height="${image.height}"[/#if]>
          </picture>
        [/#if]
      </a>
    [/#list]
  </popover-gallery>
</div>
