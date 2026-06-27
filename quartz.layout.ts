import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Shared layout components (appear on every page)
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      "Mordheimer.net": "https://mordheimer.net",
      "Built with Quartz v4": "https://quartz.jzhao.xyz",
    },
  }),
}

// Shared Explorer configuration — used in both layout types
// NAV_ORDER controls folder sort. slugSegment is the last path component,
// so "grade-1a" matches both reference/warbands/grade-1a and any other
// folder named grade-1a. The sort is applied at each level independently.
const explorerConfig = Component.Explorer({
  title: "Mordheim Australis",
  folderClickBehavior: "collapse",
  folderDefaultState: "collapsed",
  useSavedState: true,
  sortFn: (a, b) => {
    const NAV_ORDER = [
      // Top level
      "campaign",
      "roster",
      "reference",
      // reference/ children
      "warbands",
      "rules",
      // reference/warbands/ children
      "grade-1a",
      "grade-1b",
      "grade-1c",
      "unofficial",
    ]

    if (a.isFolder && b.isFolder) {
      const aIdx = NAV_ORDER.indexOf(a.slugSegment)
      const bIdx = NAV_ORDER.indexOf(b.slugSegment)
      const aRank = aIdx === -1 ? 999 : aIdx
      const bRank = bIdx === -1 ? 999 : bIdx
      if (aRank !== bRank) return aRank - bRank
    }

    if (a.isFolder !== b.isFolder) {
      return a.isFolder ? 1 : -1
    }

    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  },
  filterFn: (node) => {
    return node.file?.frontmatter?.draft !== true
  },
})

// Default content page layout
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(explorerConfig),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// Folder/list page layout
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(explorerConfig),
  ],
  right: [],
}
