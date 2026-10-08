# chiaradivece.github.io

Personal site of Chiara Di Vece. Plain Jekyll, no theme, no build tools beyond Jekyll itself.

## Editing content

Everything on the page comes from YAML in `_data/`:

| File | What it holds |
| --- | --- |
| `_data/profile.yml` | Name, role, links, local clocks, education |
| `_data/news.yml` | News items, newest first (the first one is shown large) |
| `_data/scholar.yml` | Citations, h-index and per-paper citation counts. Written automatically, don't edit |
| `_data/experience.yml` | Industry and research roles. `brief: true` folds a role's summary behind a toggle |
| `_data/publications.yml` | Papers, newest first, with links, filter metadata and research elements. `selected: true` puts a paper in the three-paper list at the top |
| `_data/elements.yml` | The research "elements" (periodic-table filter above the publications) |
| `_data/recognition.yml` | Awards, reviewing venues and review count, talks, teaching, mentoring |

The CV lives at `assets/pdf/Chiara_Di_Vece_CV.pdf`. Replace the file to update it.

## Automatic updates

`.github/workflows/scholar.yml` runs every Monday (and on demand from the Actions tab). It runs
`bin/update_scholar.py`, which reads the public Google Scholar profile and rewrites
`_data/scholar.yml` only if a number changed, then commits and redeploys. The paper and award
counts on the page are counted from `publications.yml` and `recognition.yml`, so they never go stale.

If Google blocks the request, the script logs a warning and keeps the previous numbers. You can
also run it locally with `python3 bin/update_scholar.py`.

Per-paper "Cited by" links are matched by title, so keep titles in `publications.yml` the same as
on Scholar (case and punctuation don't matter).

## Running locally

```bash
bundle install
bundle exec jekyll serve --livereload
```

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and publishes `_site` to the `gh-pages` branch that GitHub Pages serves.

## Structure

- `index.html`: the single-page layout
- `_layouts/default.html`: document shell, meta tags, theme bootstrap
- `assets/css/main.css`: all styles (light and dark tokens at the top)
- `assets/fonts/`: TeX Gyre Heros, the free Helvetica clone used only where Helvetica Neue isn't installed
- `assets/js/main.js`: theme toggle, menu, reveals, publication filters, awards rail
- `assets/js/scan.js`: the simulated ultrasound scan in the Research section
- `assets/js/motion.js`: the hero portrait's pointer parallax (tune the feel with `STIFFNESS`, `DAMPING`)
- `assets/img/chiara-cutout.webp`: the hero portrait, cut out of `chiara.jpg` on-device with macOS Vision and cropped above the original frame edges
- `_redirects/`: keeps old al-folio URLs (`/publications/`, `/cv/`, ...) working
- `bin/update_scholar.py`: the Scholar updater used by the weekly workflow
- `bin/build_icon_sprite.py`: rebuilds `_includes/icon-sprite.html` from `_includes/icons/`; run it after adding or removing an icon
