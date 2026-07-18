import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // If baseUrl contains a pathname after the domain, use this as the home link
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <h1>404</h1>
      <p>
        <em>
          You have wandered into a part of the city that no longer exists. The comet spared
          nothing here — not even this page.
        </em>
      </p>
      <p>Whatever you were looking for has been buried in the rubble, moved, or renamed.</p>
      <ul>
        <li>
          <a href={baseDir}>Return to the gates</a> (home)
        </li>
        <li>
          <a href={`${baseDir}reference/warbands/`}>Browse all warbands</a>
        </li>
      </ul>
      <p>Or try the search (🔍) — the wyrdstone hunters usually know where things are.</p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
