[#-- @ftlvariable name="title" type="String" --]
[#-- @ftlvariable name="text" type="String" --]

[#if title?has_content || text?has_content]
  <div class="html-area">
    [#if title?has_content]
      <h2 class="ds-heading">${title}</h2>
    [/#if]

    [#if text?has_content]
      ${text?no_esc}
    [/#if]
  </div>
[/#if]
