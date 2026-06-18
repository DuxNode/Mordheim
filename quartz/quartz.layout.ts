import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Left-nav category order: Core 8 → Chaos → Dwarfs → Elves → Greenskins →
// Human → Lustria → Other → Undead → Reference → Campaign → Roster
const NAV_ORDER = [
  "core-8",
  "chaos",
  "dwarfs",
  "elves",
  "greenskins",
  "human",
  "lustria",
  "other",
  "undead",
  "reference",
  "campaign",
  "roster",
]

// Shared layout.
// NOTE: afterBody here is overwritten by the ContentPage/FolderPage/TagPage emitter
// spreads — it must be [] and AccentColor must live in beforeBody instead.
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "Mordheimer.net": "https://mordheimer.net",
      "Broheim.net": "https://www.broheim.net",
      "Built with Quartz": "https://quartz.jzhao.xyz",
    },
  }),
}

const explorerComponent = Component.DesktopOnly(
  Component.Explorer({
    folderClickBehavior: "collapse",
    folderDefaultState: "collapsed",
    useSavedState: true,
    sortFn: (a, b) => {
      const aSlug = a.file?.slug ?? ""
      const bSlug = b.file?.slug ?? ""
      const aTop = aSlug.split("/")[0] || a.name?.toLowerCase().replace(/\s+/g, "-") || ""
      const bTop = bSlug.split("/")[0] || b.name?.toLowerCase().replace(/\s+/g, "-") || ""
      const ai = NAV_ORDER.indexOf(aTop)
      const bi = NAV_ORDER.indexOf(bTop)

      if (a.file == null && b.file != null) return -1
      if (a.file != null && b.file == null) return 1

      if (a.file == null && b.file == null) {
        if (ai !== -1 && bi !== -1) return ai - bi
        if (ai !== -1) return -1
        if (bi !== -1) return 1
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
      }

      return aSlug.localeCompare(bSlug, undefined, { numeric: true, sensitivity: "base" })
    },
    filterFn: (node) => node.name !== "tags",
  })
)

const leftComponents = [
  Component.PageTitle(),
  Component.MobileOnly(Component.Spacer()),
  Component.Search(),
  Component.Darkmode(),
  explorerComponent,
]

const rightComponents = [
  Component.DesktopOnly(Component.TableOfContents()),
  Component.DesktopOnly(Component.Backlinks()),
]

// Default layout for regular content pages.
// AccentColor is first in beforeBody — emits an invisible <style> tag that must
// appear before other content so CSS variable overrides apply correctly.
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.AccentColor(),
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: leftComponents,
  right: rightComponents,
}

// Folder index pages — separate object (not an alias) so the spread in
// FolderPage emitter doesn't inherit an undefined afterBody from a shared ref.
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.AccentColor(),
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: leftComponents,
  right: rightComponents,
}
