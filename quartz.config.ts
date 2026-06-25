import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Mordheim Australis 2027 — Quartz v4 site config
 * Fonts: Cinzel (headings) · IBM Plex Mono (code/stat tables) · system-sans (body)
 * Colours: Quartz v4 defaults — clean slate, revisit in Phase 5
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Mordheim Australis 2027",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-GB",
    baseUrl: "wyrdstone.wiki",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "UnifrakturMaguntia",
        body: "Cardo",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#ffffff",
          lightgray: "#e0e0e0",
          gray: "#999999",
          darkgray: "#333333",
          dark: "#000000",
          secondary: "#6B0F0F",
          tertiary: "#9B2020",
          highlight: "rgba(107, 15, 15, 0.10)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#000000",
          lightgray: "#222222",
          gray: "#666666",
          darkgray: "#cccccc",
          dark: "#ffffff",
          secondary: "#C0392B",
          tertiary: "#E74C3C",
          highlight: "rgba(192, 57, 43, 0.15)",
          textHighlight: "#fff23688",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["filesystem", "frontmatter"] }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true }),
    ],
  },
}

export default config
