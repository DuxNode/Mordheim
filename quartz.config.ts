import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Mordheim Australis 2027 — Quartz v4 site config
 * Fonts: Cinzel (headings) · IBM Plex Mono (code/stat tables) · system-sans (body)
 * Accent: amber/bronze #B87333 default; per-page override via frontmatter `accent` field
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Mordheim Australis 2027",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-GB",
    baseUrl: "mordheim.pages.dev", // update after Cloudflare gives you the real URL
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Cinzel",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f1",
          lightgray: "#e8e0d0",
          gray: "#b8a898",
          darkgray: "#3a2e28",
          dark: "#1a1008",
          secondary: "#B87333",   // amber/bronze — default accent
          tertiary: "#8B5E1A",
          highlight: "rgba(184, 115, 51, 0.12)",
          textHighlight: "#f5e6d0",
        },
        darkMode: {
          light: "#1a1008",
          lightgray: "#2a1e14",
          gray: "#6a5a4a",
          darkgray: "#d4c4b0",
          dark: "#f0e8d8",
          secondary: "#D29A5C",
          tertiary: "#B87333",
          highlight: "rgba(210, 154, 92, 0.15)",
          textHighlight: "#3a2808",
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
