[#-- @ftlvariable name="linkToMoreUrl" type="String" --]
[#-- @ftlvariable name="linkToMoreText" type="String" --]
[#if linkToMoreUrl?has_content]
  <a href="${linkToMoreUrl}" class="ds-link">
    ${linkToMoreText}
  </a>
[/#if]

