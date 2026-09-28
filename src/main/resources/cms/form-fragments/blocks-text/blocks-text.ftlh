[#-- @ftlvariable name="locale" type="String" --]
[#-- @ftlvariable name="id" type="String" --]
[#-- @ftlvariable name="title" type="String" --]
[#-- @ftlvariable name="text" type="String" --]
[#setting locale=locale]

<div
  lang="${.lang}"
  class="blocks-text html-area"
  [#if id??]id="${id}"[/#if]>

  [#if title?has_content]
    <h2 class="ds-heading">${title}</h2>
  [/#if]

  [#if text?has_content]
    ${text?no_esc}
  [/#if]
</div>

