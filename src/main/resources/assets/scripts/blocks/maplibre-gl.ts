import { Map as MapLibreMap, Marker, Popup } from "maplibre-gl";

export default class MapLibreGl extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({
      mode: "open",
    });

    const lng = parseFloat(this.getAttribute("lng") ?? "0");
    const lat = parseFloat(this.getAttribute("lat") ?? "0");
    const zoom = parseFloat(this.getAttribute("zoom") ?? "1");
    const styleSrc = this.getAttribute("styleSrc");

    const text = document.createElement("div");
    text.setAttribute("style", "width: 400px; height: 400px;");
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");

    if (styleSrc) {
      styles.setAttribute("href", styleSrc);
    }

    shadow.appendChild(text);
    shadow.appendChild(styles);

    const map = new MapLibreMap({
      container: text,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [lng, lat],
      zoom,
      attributionControl: {
        compact: true,
      },
    });

    const markerEls = this.querySelectorAll(".marker");

    markerEls.forEach((el) => {
      const lng = el.getAttribute("data-lng");
      const lat = el.getAttribute("data-lat");

      if (lng !== null && lat !== null) {
        new Marker()
          .setLngLat([parseFloat(lng), parseFloat(lat)])
          .setPopup(new Popup().setHTML(el.innerHTML))
          .addTo(map);
      }
    });
  }
}

window.customElements.define("maplibre-gl", MapLibreGl);
