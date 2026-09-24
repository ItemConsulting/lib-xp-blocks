[#-- @ftlvariable name="locale" type="java.lang.String" --]
[#-- @ftlvariable name="classes" type="java.lang.String" --]
[#-- @ftlvariable name="title" type="java.lang.String" --]
[#-- @ftlvariable name="text" type="java.lang.String" --]
[#-- @ftlvariable name="lng" type="java.lang.String" --]
[#-- @ftlvariable name="lat" type="java.lang.String" --]
[#-- @ftlvariable name="zoom" type="java.lang.String" --]
[#-- @ftlvariable name="markers" type="java.util.List" --]
[#-- @ftlvariable name="styleSrc" type="java.lang.String" --]
[#setting locale=locale]

<div class="blocks-map ${classes!}" lang="${.lang}">
  [#include "../_blocks-intro/_blocks-intro.ftlh"]

  <maplibre-gl
    lng="${lng}"
    lat="${lat}"
    zoom="${zoom}"
    styleSrc="${styleSrc}">

    [#list markers as marker]
      <div
        class="marker"
        data-lng="${marker.lng}"
        data-lat="${marker.lat}">

        ${marker.text?no_esc}
      </div>
    [/#list]
  </maplibre-gl>
</div>
