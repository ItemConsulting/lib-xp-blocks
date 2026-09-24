# Blocks Library

A library of content blocks for Enonic XP: text, images, highlighted text, accordion, cards, quote, map, and reuse of
the blocks of another content. Editors build a page as a sequence of blocks, and your part renders them with a single
call.

![Build badge](https://github.com/ItemConsulting/lib-xp-blocks/actions/workflows/main.yml/badge.svg)
![Enonic XP8 badge](https://market.enonic.com/badges/xp8.svg)
[![](https://repo.itemtest.no/api/badge/latest/releases/no/item/lib-xp-blocks)](https://repo.itemtest.no/#/releases/no/item/lib-xp-blocks)
[![](https://img.shields.io/npm/types/%40item-enonic-types%2Flib-blocks)](https://www.npmjs.com/package/@item-enonic-types/lib-blocks)

<img src="https://github.com/ItemConsulting/lib-xp-blocks/raw/main/docs/icon.svg?sanitize=true" width="150">

## Versions

| Enonic XP | This library                         |
| --------- | ------------------------------------ |
| 8.x       | `no.item:lib-xp-blocks` 1.x          |
| 7.x       | `no.item:lib-xp-item-blocks` 0.x     |

The jar and the npm types package are released together and always share a version number.

## Installation

### Gradle

```groovy
repositories {
  maven { url = "https://repo.itemtest.no/releases" }
}

dependencies {
  include "no.item:lib-xp-blocks:1.0.0"
}
```

The libraries the blocks use (lib-xp-freemarker, lib-asset, and XP's lib-content and lib-portal) are dependencies of
the jar, so `include` brings them in. The map block ships its own copy of MapLibre GL.

### Site descriptor

The map block links to its scripts with `assetUrl()` from lib-asset, so your site must mount the `asset` API:

_src/main/resources/cms/site.yaml_

```yaml
kind: "Site"
apis:
  - "asset"
```

### TypeScript

```bash
npm i -D @item-enonic-types/lib-blocks
```

Add the package to the `paths` in your _tsconfig.json_, so you can import the functions deployed in the jar:

```json
{
  "compilerOptions": {
    "paths": {
      "/*": [
        "./src/main/resources/*",
        "./.xp-codegen/*",
        "./node_modules/@item-enonic-types/lib-blocks/dist/*"
      ]
    }
  }
}
```

## Usage

### Add the blocks to a form

The blocks are [form fragments](https://developer.enonic.com/docs/xp/stable/cms/schemas/form-fragments). Include
the `blocks` form fragment in a content type (or a part), and the editor gets an option set with every block:

_src/main/resources/cms/content-types/article/article.yaml_

```yaml
kind: "ContentType"
title: "Article"
superType: "base:structured"
form:
  - include: "blocks"
```

### Customise the blocks form

`blocks.yaml` is a default. To change which blocks the editor gets, or what each block asks for, copy it into your
app at _src/main/resources/cms/form-fragments/blocks/blocks.yaml_: the app's copy replaces the library's.

Every block except `blocks-text`, `blocks-text-highlighted` and `blocks-reuse` can take a title and an intro text
above its content. The default form has neither; to add them, include `_blocks-intro` (a title and a text) or
`_blocks-title` (a title only) before the block's own fragment:

```yaml
      - name: "blocks-cards"
        items:
          - include: "_blocks-intro"
          - include: "_blocks-color"
          - include: "blocks-cards"
```

The block's `process` function and template render them whenever they are present, so nothing else changes.

### Render the blocks

Example of how to create a part _blocks-view.ts_ that renders out the blocks.

```typescript
import { process } from "/cms/form-fragments/blocks/blocks";
import { forceArray } from "/lib/item/blocks/utils";
import { type Content, getContent } from "/lib/xp/portal";
import type { Request, Response } from "@enonic-types/core";
import type { Blocks } from "/cms/form-fragments/blocks";
import { process as processMyBlock } from "/cms/form-fragments/my-block/my-block";

export function get(req: Request): Response {
  const content = getContent<Content<Blocks>>();

  return process({
    blocks: forceArray(content?.data.blocks),
    req,
    processors: {
      "my-block": processMyBlock,
    },
  });
}
```

Pass `processors` to render your own block types, or to override how a built-in block type is rendered.

## Styles and scripts

The jar contains the styles of all the blocks in _assets/styles/blocks-all.min.css_, and the web components used by
the blocks in _assets/scripts/blocks.mjs_. Add both to your page.

To bundle the styles yourself, the npm package contains the stylesheet of each block next to its types, e.g.
_dist/cms/form-fragments/blocks-cards/blocks-cards.css_, so you can pick only the blocks you use. They need
_dist/assets/styles/html-area.css_ (the rich text styles shared by several blocks) and
_dist/assets/styles/content-grid.css_ (the layout of the `blocks` container).
_dist/assets/styles/blocks-all.css_ imports all of them.

### Designsystemet

The blocks are built with [Designsystemet](https://designsystemet.no). The markup uses its components (`ds-card`,
`ds-details`, `ds-heading`, `ds-link`), and the styles use its design tokens for spacing (`--ds-size-*`), typography
(`--ds-body-md-*`) and colors (`--ds-color-*`). Your page must load the Designsystemet CSS
([`@digdir/designsystemet-css`](https://www.npmjs.com/package/@digdir/designsystemet-css)) and a theme, e.g. one made
with the [theme builder](https://theme.designsystemet.no).

### CSS custom properties

The widths of the content grid that the blocks are laid out in must be set on your page. An element in the grid can
take a wider column with the classes `content-grid__breakout`, `content-grid__feature` and `content-grid__full`.

```css
:root {
  --blocks-container-sm: 75ch; /* The text column, where blocks go by default */
  --blocks-container-md: 778px; /* .content-grid__breakout, used by highlighted text */
  --blocks-container-lg: 940px; /* .content-grid__feature */
}
```

Everything else has a default that you can override. Among them are `--content-grid--row-gap` (the space between
blocks, `var(--ds-size-10)` by default), `--content-grid--padding-inline` (the space on each side on small screens,
`var(--ds-size-5)`) and `--flow-space` (the space between the elements in rich text, `1lh`).

### Content Security Policy

If you are using the Map Block, you need to open CSP to allow data to be fetched from **OpenFreeMap**.

_com.enonic.xp.admin.cfg_

```ini
site.preview.contentSecurityPolicy = default-src 'self'; base-uri 'self'; form-action 'self'; script-src 'self'; object-src 'none'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:; connect-src 'self' https://tiles.openfreemap.org; worker-src 'self' blob: ; child-src 'self' blob: ;
```

## Deploying

### Building

To build the project, run the following command

```bash
enonic project build
```

You will find the jar-file at _./build/libs/lib-xp-blocks-[version].jar_

The TypeScript types for the form fragments are generated from the YAML descriptors into _.xp-codegen/_ by the
[no.item.xp.codegen](https://github.com/ItemConsulting/xp-codegen-plugin) Gradle plugin.

### Deploying locally

Deploy locally for testing purposes:

```bash
./gradlew publishToMavenLocal
```

## Releasing

Releases are driven by [Changesets](https://github.com/changesets/changesets) and run in GitHub Actions.

1. Describe your change in a changeset and commit it with the change itself:

   ```bash
   npx changeset
   ```

2. When that lands on `main`, the *Publish* workflow opens (or updates) a **Version Packages** pull
   request. It bumps the version in *package.json*, *package-lock.json* and *gradle.properties*, and
   folds the changesets into *CHANGELOG.md*.

3. Merging that pull request makes the same workflow do the release:

   - publish the type definitions to npm as `@item-enonic-types/lib-blocks`, with
     [build provenance](https://docs.npmjs.com/generating-provenance-statements) attached
     automatically
   - tag the commit `v[version]` and create the matching GitHub release
   - publish the jar to <https://repo.itemtest.no/releases>, or to <https://repo.itemtest.no/snapshots> while a
     prerelease is in progress (see below)

### Prereleases

A beta is a Changesets [prerelease](https://github.com/changesets/changesets/blob/main/docs/prereleases.md):

```bash
npx changeset pre enter beta
```

Commit the *.changeset/pre.json* this creates. While it says `"mode": "pre"`, the **Version Packages** pull request produces
versions like `1.0.0-beta.0`, npm publishes them under the `beta` dist-tag, and the jar goes to the *snapshots*
repository instead of *releases*. Consumers of a beta therefore add that repository:

```groovy
repositories {
  maven { url = "https://repo.itemtest.no/snapshots" }
}
```

To leave the beta, run `npx changeset pre exit` and commit. The next **Version Packages** pull request deletes
*pre.json* and bumps to the stable version, and merging it publishes to npm's `latest` tag and to *releases*.

### Release credentials

npm is published with [trusted publishing](https://docs.npmjs.com/trusted-publishers): no token is
stored anywhere, the npm CLI trades the workflow's OIDC token for a short-lived one. It is
configured on npmjs.com under the package's *Settings > Trusted publisher*, pointing at
organization `ItemConsulting`, repository `lib-xp-blocks` and workflow `publish.yml`. All three
are case-sensitive, and renaming the workflow file breaks publishing until it is updated there.

The Maven repository still uses credentials, so the repository needs two secrets:
`REPOSILITE_USERNAME` and `REPOSILITE_PASSWORD`.

### Releasing by hand

Only needed if the automated release fails. The Maven publish reads its credentials from
`itemtestRepositoryUsername` / `itemtestRepositoryPassword` in *~/.gradle/gradle.properties*.

```bash
./gradlew publishAllPublicationsToItemtestRepositoryRepository
npm publish
```
