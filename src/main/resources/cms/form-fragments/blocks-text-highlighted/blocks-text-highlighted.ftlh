[#-- @ftlvariable name="locale" type="String" --]
[#-- @ftlvariable name="title" type="String" --]
[#-- @ftlvariable name="text" type="String" --]
[#-- @ftlvariable name="classes" type="String" --]
[#-- @ftlvariable name="color" type="String" --]

[#setting locale=locale]

<aside
  lang="${.lang}"
  class="blocks-text-highlighted html-area content-grid__breakout"
  data-color="${color!"neutral"}">

  [#if title?has_content]
    <h2 class="ds-heading">${title}</h2>
  [/#if]

  ${text?no_esc}
</aside>
