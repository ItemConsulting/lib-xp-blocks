package no.item.blocks;

import com.enonic.xp.content.Content;
import com.enonic.xp.content.ContentId;
import com.enonic.xp.page.Page;
import com.enonic.xp.portal.PortalRequest;
import com.enonic.xp.portal.PortalResponse;
import com.enonic.xp.portal.RenderMode;
import com.enonic.xp.portal.postprocess.PostProcessor;
import com.enonic.xp.region.Component;
import com.enonic.xp.region.FragmentComponent;
import com.enonic.xp.region.LayoutComponent;
import com.enonic.xp.region.Region;
import com.enonic.xp.region.Regions;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.google.common.net.MediaType;

import java.util.function.Supplier;
import java.util.regex.Pattern;

/**
 * Renders a fragment content the way the portal renders a fragment that an editor has placed on the page.
 *
 * <p>XP has no API for rendering a component. The fragment is instead put in a region of the page being rendered, and
 * the portal is asked to evaluate the component instruction of that region, which is how every region is rendered.
 * The fragment's controller therefore sees the current content and its own component, and its page contributions are
 * collected.</p>
 */
public class FragmentScriptBean implements ScriptBean {
  private static final String REGION_NAME = "blocks-reuse";

  /** What makes Content Studio's page editor treat an element as a component or a region of the page */
  private static final Pattern LIVE_EDIT_ATTRIBUTES =
    Pattern.compile("\\sdata-portal-(?:component-type|region)=\"[^\"]*\"");

  private Supplier<PortalRequest> requestSupplier;
  private Supplier<PostProcessor> postProcessorSupplier;

  @Override
  public void initialize(BeanContext context) {
    requestSupplier = context.getBinding(PortalRequest.class);
    postProcessorSupplier = context.getService(PostProcessor.class);
  }

  /**
   * @param fragmentId The id of a content of the type "portal:fragment"
   * @return The rendered fragment, or {@code null} when the portal has not rendered it: no content is being rendered,
   *         or the request has a method that the portal leaves instructions untouched for (anything but GET and POST)
   */
  public FragmentResponse render(String fragmentId) {
    PortalRequest request = requestSupplier.get();
    Content content = request == null ? null : request.getContent();

    if (content == null) {
      return null;
    }

    Component fragment = FragmentComponent.create().fragment(ContentId.from(fragmentId)).build();
    Regions regions = Regions.create().add(Region.create().name(REGION_NAME).add(fragment).build()).build();
    Page.Builder page = content.getPage() == null ? Page.create() : Page.create(content.getPage());

    // The component paths of a fragment content are looked up in its layout, so that is where the region has to be.
    // The portal can then render any fragment but a layout, as a layout can not be inside a layout.
    if (content.getType().isFragment()) {
      page.fragment(LayoutComponent.create().regions(regions).build());
    } else {
      page.regions(regions);
    }

    RenderMode mode = request.getMode();
    PortalResponse instruction = PortalResponse.create()
      .contentType(MediaType.HTML_UTF_8)
      .body("<!--#COMPONENT " + fragment.getPath() + " -->")
      .build();

    try {
      request.setContent(Content.create(content).page(page.build()).build());

      // The fragment can not be edited from this page, and in edit mode the portal wraps it in an element of its own
      if (mode == RenderMode.EDIT) {
        request.setMode(RenderMode.PREVIEW);
      }

      PortalResponse response = postProcessorSupplier.get().processResponseInstructions(request, instruction);

      if (response == instruction) {
        return null;
      }

      return new FragmentResponse(mode == RenderMode.EDIT ? withoutLiveEditAttributes(response) : response);
    } finally {
      request.setContent(content);
      request.setMode(mode);
    }
  }

  /**
   * The page editor would let the editor select and drag the fragment's components, as if they were placed on the page.
   */
  private static PortalResponse withoutLiveEditAttributes(PortalResponse response) {
    return response.getBody() instanceof String body
      ? PortalResponse.create(response).body(LIVE_EDIT_ATTRIBUTES.matcher(body).replaceAll("")).build()
      : response;
  }
}
