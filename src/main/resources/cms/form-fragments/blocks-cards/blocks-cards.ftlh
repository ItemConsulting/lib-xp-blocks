[#-- @ftlvariable name="locale" type="String" --]
[#-- @ftlvariable name="title" type="String" --]
[#-- @ftlvariable name="text" type="String" --]
[#-- @ftlvariable name="color" type="String" --]
[#-- @ftlvariable name="cardsMarkup" type="String" --]
[#-- @ftlvariable name="link.url" type="String" --]
[#-- @ftlvariable name="link.text" type="String" --]

[#setting locale=locale]

<div
  lang="${.lang}"
  class="blocks-cards"
  [#if color?has_content]data-color="${color}"[/#if]>

  [#include "../_blocks-intro/_blocks-intro.ftlh"]

  <div class="blocks-cards__cards">
    ${cardsMarkup?no_esc}
  </div>

  [#if link?has_content]
    <div class="blocks-cards__actions">
      <a
        href="${link.url}"
        class="ds-link">

        ${link.text}
      </a>
    </div>
  [/#if]

  [#include "../_blocks-link-to-more/_blocks-link-to-more.ftlh"]
</div>
