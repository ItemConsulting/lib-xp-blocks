---
"@item-enonic-types/lib-blocks": major
---

Upgrade to Enonic XP 8, and publish the jar as `no.item:lib-xp-blocks` (was `no.item:lib-xp-item-blocks`).

- The blocks are XP 8 form fragments in `cms/form-fragments/` (XP 7 inline mixins in `site/mixins/`). Import the
  code from `/cms/form-fragments/<block>/<block>` instead of `/site/mixins/<block>/<block>`, and reference the
  fragments with `- include: "blocks"` in your YAML descriptors.
- Requires lib-xp-freemarker 4 and lib-asset 2. The map block needs the `asset` API mounted in your site.
- The npm package also ships the types generated from the descriptors, so `import type { Blocks } from "/cms/form-fragments/blocks"` resolves.
- The Storybook stories are no longer part of the library.
