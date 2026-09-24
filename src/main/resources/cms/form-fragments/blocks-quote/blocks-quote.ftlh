[#-- @ftlvariable name="locale" type="String" --]
[#-- @ftlvariable name="title" type="String" --]
[#-- @ftlvariable name="text" type="String" --]
[#-- @ftlvariable name="quote" type="String" --]
[#-- @ftlvariable name="attribution" type="String" --]
[#-- @ftlvariable name="image" type="java.util.HashMap" --]

[#setting locale=locale]

<div
  lang="${.lang}"
  class="blocks-quote">

  [#include "../_blocks-intro/_blocks-intro.ftlh"]

  <div class="blocks-quote__body">
    <figure class="blocks-quote__quote">
      <blockquote class="blocks-quote__text html-area">
        ${quote?no_esc}
      </blockquote>

      [#if attribution?has_content]
        <figcaption class="blocks-quote__attribution">
          ${attribution}
        </figcaption>
      [/#if]
    </figure>

    [#if image??]
      <figure>
        <img
          src="${image.src}"
          class="blocks-quote__image"
          alt="${image.altText!""}"
          [#if image.width??]width="${image.width}"[/#if]
          [#if image.height??]height="${image.height}"[/#if]
        >
      </figure>
    [/#if]
  </div>
</div>
