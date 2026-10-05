package no.item.blocks;

import com.enonic.xp.portal.PortalResponse;
import com.enonic.xp.portal.postprocess.HtmlTag;
import com.enonic.xp.script.serializer.MapGenerator;
import com.enonic.xp.script.serializer.MapSerializable;

/**
 * The parts of a rendered fragment that a block passes on: the markup, and what the fragment contributes to the page
 * and to the headers of the response.
 */
public class FragmentResponse implements MapSerializable {
  private final PortalResponse response;

  public FragmentResponse(PortalResponse response) {
    this.response = response;
  }

  @Override
  public void serialize(MapGenerator gen) {
    gen.value("body", response.getBody() instanceof String body ? body : "");

    if (!response.getHeaders().isEmpty()) {
      gen.map("headers");
      response.getHeaders().forEach(gen::value);
      gen.end();
    }

    if (response.hasContributions()) {
      gen.map("pageContributions");
      for (HtmlTag tag : HtmlTag.values()) {
        gen.array(tag.id());
        response.getContributions(tag).forEach(gen::value);
        gen.end();
      }
      gen.end();
    }
  }
}
