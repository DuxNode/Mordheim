import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

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

// NOTE: sortFn is serialised via .toString() and reconstructed with new Function()
// in the browser — it must be fully self-contained with no closure variables.
const explorerComponent = Component.DesktopOnly(
  Component.Explorer({
    folderClickBehavior: "collapse",
    folderDefaultState: "collapsed",
    useSavedState: true,
    sortFn: (a, b) => {
      const ORDER = ["core-8","chaos","dwarfs","elves","greenskins","human","lustria","other","undead","reference","campaign","roster"]
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1
      if (a.isFolder && b.isFolder) {
        const ai = ORDER.indexOf(a.slugSegment)
        const bi = ORDER.indexOf(b.slugSegment)
        if (ai !== -1 && bi !== -1) return ai - bi
        if (ai !== -1) return -1
        if (bi !== -1) return 1
      }
      return a.displayName.localeCompare(b.displayName, undefined, { numeric: true, sensitivity: "base" })
    },
    filterFn: (node) => node.slugSegment !== "tags",
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
