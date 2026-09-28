[#-- @ftlvariable name="locale" type="String" --]
[#-- @ftlvariable name="id" type="String" --]
[#-- @ftlvariable name="title" type="String" --]
[#-- @ftlvariable name="text" type="String" --]
[#-- @ftlvariable name="color" type="String" --]
[#-- @ftlvariable name="items" type="java.util.ArrayList" --]
[#-- @ftlvariable name="item.title" type="String" --]
[#-- @ftlvariable name="item.text" type="String" --]

[#setting locale=locale]

<div
  class="blocks-accordion"
  lang="${.lang}"
  [#if id??]id="${id}"[/#if]
>
  [#include "../_blocks-intro/_blocks-intro.ftlh"]

  <div class="blocks-accordion__items">
    [#list items as item]
      <details
        class="ds-details"
        data-color="${color!"neutral"}">

        <summary>${item.title!}</summary>

        <div class="html-area">
          ${item.text?no_esc}
        </div>
      </details>
    [/#list]
  </div>
</div>
