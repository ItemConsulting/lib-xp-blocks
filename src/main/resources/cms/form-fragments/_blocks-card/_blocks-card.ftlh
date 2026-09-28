[#-- @ftlvariable name="locale" type="String" --]
[#-- @ftlvariable name="classes" type="String" --]
[#-- @ftlvariable name="id" type="String" --]
[#-- @ftlvariable name="variant" type="String" --]
[#-- @ftlvariable name="color" type="String" --]
[#-- @ftlvariable name="url" type="String" --]
[#-- @ftlvariable name="image" type="Object" --]
[#-- @ftlvariable name="image.src" type="String" --]
[#-- @ftlvariable name="image.altText" type="String" --]
[#-- @ftlvariable name="image.width" type="String" --]
[#-- @ftlvariable name="image.height" type="String" --]
[#-- @ftlvariable name="kicker" type="String" --]
[#-- @ftlvariable name="title" type="String" --]
[#-- @ftlvariable name="text" type="String" --]

[#setting locale=locale]

<div lang="${.lang}" class="blocks-card ${classes!}">
  <div
    class="ds-card"
    data-variant="${variant!"default"}"
    data-color="${color!"neutral"}"
    data-clickdelegatefor="${id}-link">

    [#if image??]
      <figure class="ds-card__block blocks-card__image">
        <img
          src="${image.src}"
          alt="${image.altText!}"
          [#if image.width??]width="${image.width}"[/#if]
          [#if image.height??]height="${image.height}"[/#if]
        />
      </figure>
    [/#if]

    [#if kicker?has_content || title?has_content || text?has_content]
      <div class="ds-card__block html-area">
        [#if kicker?has_content]
          <small>${kicker}</small>
        [/#if]

        <h3 class="ds-heading">
          <a
            id="${id}-link"
            href="${url!}"
            class="ds-link">

            ${title!}
          </a>
        </h3>

        ${text!?no_esc}
      </div>
    [/#if]
  </div>
</div>
