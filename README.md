# Melad Alsaleh — Portfolio

Static one-page portfolio site (plain HTML/CSS/JS, Bootstrap 4). No build step — open `index.html` directly or serve the folder with any static file server.

Content is sourced from [meladalsaleh.com](https://meladalsaleh.com). Dark theme only.

## Still to do

- **ICRC bullets**: the ICT Specialist @ ICRC bullets in the Experience section are a professional-sounding draft (flagged with a `TODO` comment in `index.html`) — review and edit them to match your actual responsibilities.

## Investigated but not done

- **Purging unused Bootstrap CSS** (`bootstrap.min.css` is 178KB; the page only uses a fraction of it — grid, a handful of utilities, form controls): doing this safely needs a real tool (PurgeCSS/PostCSS) that parses every selector against the actual markup. Hand-trimming a single 178KB stylesheet by eye is exactly the kind of edit that silently breaks something — left as-is.
- **Combining the 5 remaining render-blocking `<link>` stylesheets into one file**: would save a few requests, but on any modern host (HTTP/2+, which is the default on GitHub Pages/Netlify/Vercel/Cloudflare Pages) parallel small requests over one connection are cheap — not worth the risk of a manual merge (relative `url()` paths inside `owl.carousel.min.css`/`bootstrap.min.css` would need rewriting).

## Done — this pass (visual fix)

- **Removed the red/black "cover wipe" reveal effect** (`.gsap-reveal`, `.gsap-reveal-hero`, `.gsap-reveal-img`): headings, the hero text, and the About Me photo were wrapped in a colored block (`#d63447` red for the hero/photo, black elsewhere) that was supposed to slide away via a ScrollMagic-triggered GSAP animation shortly after load. In practice that trigger doesn't fire reliably, so content could be left sitting behind a solid color block indefinitely — which is what showed up as a red flash/overlay on the hero text when the site opened. Removed the JS that built and animated it (`animateReveal()`, and the About-photo equivalent that had been folded into `revealImages()`) and the CSS that hid content by default waiting for it — text and the photo now render immediately, no animation, no dependency on a scroll-triggered library that wasn't firing predictably. Also let `ScrollMagic.min.js` + `scrollmagic.animation.gsap.min.js` drop out of `js/scripts-dist.js` entirely (nothing uses them anymore) — another 18KB off the bundle (367KB now, down from the original 549KB).

## Done — this pass (page-weight / load speed)

- **Icon font replaced with 4 inline SVGs**: `css/vendor/icomoon/` shipped **1,631** icon glyphs (`.eot`/`.ttf`/`.woff`/`.svg`, ~1.86MB across formats) for a page that uses exactly 4 icons (briefcase, graduation-cap, and the two carousel chevrons). Every visitor's browser was downloading a 300KB+ font file for that. Replaced all 13 usages with tiny inline `<svg>` icons (sized via `1em` so they inherit each context's existing `font-size`/`color`, matching the old look exactly) and deleted the icomoon folder entirely — including ~2.9MB of files (`demo.html`, `selection.json`) that were never even linked from the page. This was the single biggest win in this pass.
- **Hero photo + About Me photo re-encoded PNG → JPEG**: both were large, already-palette-quantized PNGs (`Cover_Melad.png` 357KB, `Melad_Profile.png` 209KB). Tested several JPEG quality levels and visually verified each before choosing: hero → q75 (287KB, 19% smaller), profile → q82 (154KB, 26% smaller). Note: a naive PNG→JPEG conversion at high quality actually came out *larger* than the original for this content (huge flat-black regions compress unusually well as an indexed PNG) — only worth doing once quality was tuned down to where JPEG's DCT compression actually wins, confirmed by comparing byte sizes, not assumption.
- **`js/scripts-dist.js` trimmed from 18 vendor files to 10** (549KB → 386KB, 30% smaller): rebuilt the bundle from the pristine individual files in `js/vendor/` (the exact sources it was originally built from, per its own `@prepros-append` header) rather than hand-editing the minified blob. Dropped: `popper.min.js` (no tooltips/dropdowns/popovers on this page), `isotope.pkgd.min.js` + `imagesloaded.pkgd.min.js` (drove a `#posts` masonry grid that no longer exists), `jquery.waypoints.min.js` + `jquery.animateNumber.min.js` (drove a number count-up with no matching elements), `jarallax-video.min.js` (no video elements), `jquery.fancybox.min.js` (no lightbox triggers), `stickyfill.min.js` (no sticky elements). Matching dead code removed from `js/main.js` (the isotope/imagesLoaded-driven photo-reveal effect was rewritten to run directly, same visual result, no longer needs either library; the vestigial ajax-portfolio-single-page feature — `.ajax-load-page`, `#portfolio-single-holder` — was deleted outright since nothing on the page ever pointed at it).
- **Other dead files removed** (repo hygiene, not fetched by visitors either way since nothing linked them, but no reason to ship them): `css/css/` (a stray 368KB duplicate build-output folder), `css/vendor/animate.min.css`, `css/vendor/jquery.fancybox.min.css`, `css/vendor/bootstrap.css` + its source map (unminified, unused — `bootstrap.min.css` is what's actually linked).
- **Lazy-loading + explicit dimensions added** to every below-the-fold `<img>` (About Me photo, the 6 divider icons, the 3 client logos) — `loading="lazy" decoding="async"`, plus `width`/`height` where nothing already reserved that space, to avoid layout shift.
- **Verified with a real headless-browser pass** (Chrome, local static server, console + DOM inspection) rather than assuming the above was safe: caught and fixed a real bug introduced while rebuilding `scripts-dist.js` — naive `cat`-concatenation let one file's trailing `//# sourceMappingURL=...` comment swallow the next file's opening `/**` comment, corrupting the syntax and breaking every script on the page. Fixed by concatenating with explicit blank-line + `;` separators between every file; re-verified zero console errors and confirmed (via DOM dump) that the carousel, contact-form validation, jarallax, and icon SVGs all initialize correctly end-to-end.

## Done — earlier pass

- **Fixed a real page-load bottleneck**: `css/style.css` had a `@import` pulling fonts from Google's servers (`fonts.googleapis.com`) — `@import` is render-blocking, so the whole page waited on that external request before it could finish painting. If Google's font servers are slow or unreliable to reach from your network, this alone could easily cause multi-second (or worse) load times. Fonts are now self-hosted (`css/fonts/*.woff2`, ~84KB total) — confirmed via a full network-request audit that the page now makes **zero external requests** on load; everything comes from the same host.
- **UNRWA logo optimized**: was a 427KB SVG (auto-traced from a scanned document) displayed at ~27×54px — converted to WebP at a realistic display resolution, now 27KB (94% smaller), no visible quality loss.
- **Two unused stylesheets removed**: `animate.min.css` (58KB) and `jquery.fancybox.min.css` (12.8KB) were still linked in `<head>` but nothing on the page uses them anymore (no `animate__` classes, no `data-fancybox` triggers) — that's ~70KB and two fewer render-blocking requests before first paint, for free.
- **Hero image preload added**: `<link rel="preload">` for the hero image so the browser starts fetching it immediately instead of waiting to discover it via the CSS `background-image` rule — shaves time off how soon the biggest above-the-fold element appears.

- **Contact form** wired to a live Formspree endpoint (`melad1999@gmail.com`).
- **CV download** links to `files/Melad_Alsaleh_CV.pdf`.
- **Client logos**: ICRC, UK-Med, and UNRWA are all real logo images (`images/logos/`), uniform-sized white badges in an auto-sliding carousel (capped at 3 items so it never shows a repeated logo at once). UK-Med is CC BY-SA 4.0 (credit: David Albrio, Wikimedia Commons); UNRWA is a public-domain UN document excerpt (Wikimedia Commons); ICRC is the file you supplied directly.
- **Testimonials** section now shows a real recommendation (Matthew Newport, from LinkedIn) instead of the "coming soon" placeholder.
- **Education & Certifications** redesigned — icon-badge cards for Education, a compact 2-column badge grid for Certifications.
- **Light/dark theme toggle removed** — the site is dark-themed only now (no toggle button, no `js/theme-toggle.js`, no `prefers-color-scheme`/`localStorage` logic).
- **Decorative vertical divider lines removed** — the template's `.lines-wrap` background overlay (thin lines splitting the page into thirds) is gone.
- **Contact form textarea** shortened (`rows="7"` → `rows="4"`) so it doesn't leave a big empty gap under the "Message" field.
- **Sticky nav fixed** — previously it would hide itself again while scrolling down (a "sleep" state left over from the template's hide-then-reveal-on-scroll-up pattern); now it just stays fixed and visible once you scroll past the hero, styled as a dark translucent bar. Nav-link clicks now also offset for the bar's height so a section's heading doesn't end up scrolled underneath it.
- **Responsive audit**: checked 320/375/768px widths — no horizontal overflow at 375/768; a sub-pixel (~5px) overflow at the extreme 320px edge case traced to the template's own text-reveal wrapper, imperceptible in practice.

## Structure

- `index.html` — the whole site
- `css/style.css` — base template styles; `css/theme.css` — custom component styles (project cards, skill tags, experience/education items, logo badges)
- `js/main.js` — template behavior (nav, carousels, contact form)
- `images/` — photos and site graphics
