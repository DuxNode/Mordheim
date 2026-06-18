// AccentColor.tsx — Quartz v4 custom component
// Reads `accent` and `accentDark` from page frontmatter and injects them as
// CSS custom properties directly onto the <html> element via an inline script.
// This works because <style> tags inside <article> cannot override :root in <head>,
// but JS setting style properties on documentElement can.

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const HEX_RE = /^#[0-9A-Fa-f]{6}$/

function sanitize(val: unknown): string | null {
  if (typeof val !== "string") return null
  const s = val.trim()
  return HEX_RE.test(s) ? s : null
}

function darken(hex: string, ratio: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const d = (c: number) => Math.max(0, Math.floor(c * (1 - ratio)))
  return `#${d(r).toString(16).padStart(2, "0")}${d(g).toString(16).padStart(2, "0")}${d(b).toString(16).padStart(2, "0")}`
}

const AccentColor: QuartzComponent = (props: QuartzComponentProps) => {
  if (!props?.fileData) return null
  const frontmatter = props.fileData.frontmatter ?? {}
  const light = sanitize(frontmatter.accent as unknown)
  if (!light) return null

  const dark = sanitize(frontmatter.accentDark as unknown) ?? darken(light, 0.15)
  const lightTertiary = darken(light, 0.25)
  const darkTertiary = darken(dark, 0.2)

  // Set CSS custom properties directly on documentElement (the <html> element).
  // Quartz's dark mode uses saved-theme attribute on <html>, so we listen for
  // theme changes and update accordingly.
  const script = `
(function() {
  var light = "${light}";
  var dark = "${dark}";
  var lightTertiary = "${lightTertiary}";
  var darkTertiary = "${darkTertiary}";
  function applyAccent() {
    var isDark = document.documentElement.getAttribute("saved-theme") === "dark";
    var s = isDark ? dark : light;
    var t = isDark ? darkTertiary : lightTertiary;
    var h = isDark ? dark + "26" : light + "1e";
    document.documentElement.style.setProperty("--secondary", s);
    document.documentElement.style.setProperty("--tertiary", t);
    document.documentElement.style.setProperty("--highlight", h);
  }
  applyAccent();
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      if (m.attributeName === "saved-theme") applyAccent();
    });
  });
  observer.observe(document.documentElement, { attributes: true });
})();
`.trim()

  return <script dangerouslySetInnerHTML={{ __html: script }} data-accent="1" />
}

AccentColor.displayName = "AccentColor"
AccentColor.css = ""
AccentColor.beforeDOMLoaded = ""
AccentColor.afterDOMLoaded = ""

export default (() => AccentColor) satisfies QuartzComponentConstructor
