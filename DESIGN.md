---
name: Chiara Di Vece
description: Personal site of an AI scientist, from computer vision for fetal ultrasound to soft robotics.
colors:
  accent: "#a8c8e8"
  accent-mark: "#5b8fc2"
  accent-ink: "#2b5f8c"
  on-accent: "#10141a"
  bg: "#f4f6f8"
  surface: "#fcfdfe"
  surface-2: "#e7ecf1"
  ink: "#10141a"
  ink-2: "#3f4852"
  ink-3: "#5c6773"
  line: "#d3dbe3"
  screen: "#0a0d11"
  paper: "#fdfdfd"
  nav-bg: "rgb(244 246 248 / 0.8)"
  bg-dark: "#0c0f13"
  surface-dark: "#141920"
  surface-2-dark: "#1a2028"
  ink-dark: "#e8edf2"
  ink-2-dark: "#b0bac4"
  ink-3-dark: "#8a95a1"
  line-dark: "#26303a"
  accent-mark-dark: "#a8c8e8"
  accent-ink-dark: "#bcd7f0"
  paper-dark: "#eef2f5"
typography:
  display:
    fontFamily: "\"Helvetica Neue\", Helvetica, \"TeX Gyre Heros\", Arial, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "\"Helvetica Neue\", Helvetica, \"TeX Gyre Heros\", Arial, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "\"Helvetica Neue\", Helvetica, \"TeX Gyre Heros\", Arial, sans-serif"
    fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "\"Helvetica Neue\", Helvetica, \"TeX Gyre Heros\", Arial, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body:
    fontFamily: "\"Helvetica Neue\", Helvetica, \"TeX Gyre Heros\", Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"tnum\" 1"
  numeral:
    fontFamily: "\"Helvetica Neue\", Helvetica, \"TeX Gyre Heros\", Arial, sans-serif"
    fontSize: "clamp(2rem, 3vw, 2.6rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.04em"
  label:
    fontFamily: "\"Helvetica Neue\", Helvetica, \"TeX Gyre Heros\", Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  pill: "999px"
  md: "14px"
  sm: "10px"
  inset: "8px"
spacing:
  stage-gap: "40px"
  grid-gap: "16px"
  gutter: "16px"
  gutter-wide: "32px"
  section: "clamp(3.5rem, 6vw, 5.5rem)"
  container: "1240px"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 1.4rem"
  button-solid-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 1.4rem"
  button-small:
    rounded: "{rounded.pill}"
    height: "38px"
    padding: "0 1rem"
  icon-button:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    size: "40px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    height: "38px"
    padding: "0 1rem"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  tag:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 0.6rem"
  tag-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "clamp(1.4rem, 2.5vw, 2rem)"
  news-lead:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: "clamp(1.5rem, 3vw, 2.25rem)"
  pipeline-stage:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "1rem 1.1rem"
  pipeline-stage-picked:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
  nav:
    backgroundColor: "{colors.nav-bg}"
    height: "64px"
---

# Design System: Chiara Di Vece

## Overview

**Creative North Star: "Clean Signal"**

One clear signal on a quiet field. The page is a cool, near-white field of blue-grey neutrals. Across it runs a single powder-blue signal that marks what matters: the selected filter, the current job, the first number, the dot that ends the headline. Helvetica Neue carries everything, set tight and large where it speaks and loose and calm where it informs. The precision is technical. The warmth comes from a real person: the portrait, the live local time, the photos from the viva.

The density is moderate and the rhythm is editorial: big plain section titles that match the nav, hairline rules instead of boxes, and data laid out as lists and grids rather than dashboards. A few hand-made objects carry the personality, so the rest of the page can stay plain:

- a faint ultrasound sector behind the hero portrait;
- the perception pipeline (Perceive → Learn → Simulate → Deploy) that filters the papers;
- a marquee of reviewing venues.

Motion is physical and brief: strong ease-out curves, springs for anything that hangs or follows the pointer, and nothing that moves without a way to pause it.

The mood is crisp, technical and human. The confirmed anti-reference is anything that reads as AI-generated: template typography, purple-blue glow gradients, stock imagery, generic same-size feature cards.

**Key Characteristics:**
- One hue (powder blue) on cool blue-grey neutrals; every neutral leans toward the accent's hue.
- A single family, Helvetica Neue, with a self-hosted TeX Gyre Heros fallback.
- Flat surfaces with 1px hairlines; cards lift onto a soft shadow on hover.
- Pills for things you press, 14px corners for things that hold content.
- Real photography and real research figures only.
- Light and dark themes with the same structure; the photo viewer is always dark.
- Motion uses strong ease-out (`cubic-bezier(0.23, 1, 0.32, 1)`), presses scale to 0.97, and every looping animation can be paused.

## Colors

A cool, nearly monochrome field with one powder-blue signal, used at three strengths for three jobs.

### Primary
- **Powder Blue** (#a8c8e8): the owner's chosen accent and the only hue on the page. Used as a fill:
  - the lead news card;
  - the solid button's hover state;
  - text selection.

  It is identical in both themes.
- **Signal Blue** (#5b8fc2; Powder Blue in dark): the same hue deepened until small marks reach 3:1 on light backgrounds. Used for:
  - focus rings;
  - the nav underline;
  - link underlines and the timeline fill;
  - the marquee's triangle separators;
  - the full stop after the hero headline;
  - the arrows between pipeline stages.
- **Ink Blue** (#2b5f8c; #bcd7f0 in dark): text-safe blue at 4.5:1 or more. Used for:
  - link hover;
  - the citation count in About;
  - module codes.

### Neutral
- **Cool Paper** (#f4f6f8 / #0c0f13): the page background.
- **Surface** (#fcfdfe / #141920): research cards.
- **Sunk Surface** (#e7ecf1 / #1a2028): photo placeholders.
- **Ink** (#10141a / #e8edf2): headings, primary text, the solid button, pressed chips and the picked pipeline stage.
- **Soft Ink** (#3f4852 / #b0bac4): body copy in paragraphs and lists.
- **Muted Ink** (#5c6773 / #8a95a1): dates, labels, captions, secondary metadata.
- **Hairline** (#d3dbe3 / #26303a): 1px rules, card borders, outlines for chips and ghost buttons.
- **Monitor Black** (#0a0d11): the photo viewer, in both themes.

### Named Rules
**The One Signal Rule.** Powder blue is the only hue. States are told apart by value (ink fill, blue fill, outline, dashed outline), never by adding a colour.

**The Three Blues Rule.** Fill blue is for areas, Signal Blue for marks of 1–3px, Ink Blue for text. Never set text in fill blue on a light background.

**The Monitor Rule.** Anything that shows imagery full-screen (the photo viewer) sits on Monitor Black in both themes, like a real screen.

## Typography

**Display Font:** Helvetica Neue (with Helvetica, then self-hosted TeX Gyre Heros, then Arial)
**Body Font:** the same
**Label/Mono Font:** none; numerals use tabular figures instead of a mono face

**Character:** One Swiss grotesque doing every job. Large sizes are set tight (-0.04em to -0.045em) with solid line-height; body text breathes at 1.6. Emphasis comes from the same family, through italic, weight or size, never from a second face.

### Hierarchy
- **Display** (700, clamp(2.1rem, 4.6vw, 3.75rem), 1): the hero headline, one phrase per line, ending in a Signal Blue full stop. Above it sits the role line ("AI Lead at morph · PhD, UCL", 1.05rem/500, Soft Ink).
- **Headline** (500, clamp(1.6rem, 3vw, 2.5rem), 1): section titles. The hero headline stays about 1.5× this on wide screens (59 vs 38px at 1280), so the thesis line clearly leads. Plain words that match the nav label ("Publications", "Talks and reviewing", "Awards"). Sub-heads inside a section (Industry, Education, the review count) are 1.35rem/600 over a 1px Ink rule.
- **Title** (600, clamp(1.4rem, 2.2vw, 1.85rem), 1.1): research card headings. Smaller titles step down: the current role 1.45rem/600, selected-paper titles 1.3rem/600, other job roles 1.12rem/600, paper titles 1.15–1.2rem/600, talk titles 1.1rem/600 (never above paper titles), award titles 1.05rem/600.
- **Lead** (400–500, clamp(1.25rem, 2vw, 1.5rem), 1.35): the opening paragraph of About and Research, and the lead news item. Under the Research lead, one plain line in Soft Ink (1.05rem) says what links the cards.
- **Body** (400, 1rem, 1.6): paragraphs in Soft Ink, held to 58–62ch.
- **Numeral** (500, clamp(2rem, 3vw, 2.6rem), 1): Scholar numbers; the first one in Ink Blue. Each About number links to its proof (citations and h-index to Scholar, papers and awards to their lists) and keeps its look; a Signal Blue underline grows on hover.
- **Label** (400, 0.75–0.875rem): dates, captions, metadata in Muted Ink. Links that are actions (paper links, "Read more", research card links) are never below 0.875rem.

### Named Rules
**The One Family Rule.** Helvetica Neue only. No serif, no monospace, no display face from a template library.

**The One Personal Heading Rule.** Section titles are plain and say what the nav says. Only About's title, "Hi, I'm *Chiara*.", carries an italic word (same family, 400, with descender room). Never add a second.

**The Proof Outranks Outreach Rule.** Paper titles are never smaller than talk titles, and the contact email (at most 2.25rem) sits below the section titles, never the largest type on the page.

## Layout

- **Container:** one 1240px column, with 16px side gutters on phones and 32px from 768px up.
- **Section spacing:** sections are separated by `clamp(3.5rem, 6vw, 5.5rem)` of padding. Contact gets more, up to 7.5rem above.
- **Composition:** asymmetric grids carry each section rather than centred stacks:
  - About is 7 : 5 (text, then facts and numbers);
  - News is 6 : 5;
  - Research is a two-line intro (up to 40rem wide, no second column), then a 6-column grid of research cards; beside the fetal card sits the simulation card, led by a figure from its paper (the segmented brain and its particle model, Segato, Di Vece et al., RA-L 2021, CC BY 4.0, credited under the figure) with its links at the foot; under the grid a hairline "Now" row gives the current role (the accent "Now" tag, role, morph link and start date only, from `_data/experience.yml`);
  - Experience is two equal columns.
- **Page order:** About, News, Research, Publications (three selected papers before the filtered list), Talks and reviewing (invitation, past talks, speaker kit, then the review record and venue marquee), Experience, Awards, Teaching and mentoring, Contact. Papers and speaking come before career history; short roles fold their details away.
- **Grid gaps:** cards sit 16px apart; pipeline stages 40px apart (22px stacked on phones), with the arrow in the gap.
- **Hero:** fills the viewport under the nav. The copy is left-aligned in the lower left; the cut-out portrait is anchored bottom-right and fades out at its lower edge.
- **Responsive changes:**
  - The nav collapses into a menu below 1024px.
  - Below 640px, the Community list and the longer Experience summaries (two or more sentences; never the current role or the PhD, marked `keep_open`) fold behind a small toggle ("4 roles", "What I did"); from 640px every summary shows in full; they are open without JavaScript and from 640px, where the toggle is hidden. Teaching modules become one row each (code, then name and place).
  - From 900px, past talks (7 columns) and the speaker kit (5 columns, sticky under the nav) sit side by side, so the evidence and the kit are read together.
  - Below 640px, Education shows compact rows (degree, school, dates) and its honours and notes sit behind one "Show honours and notes" toggle (always shown without JavaScript and from 640px).
  - On touch, every small link outside running prose (paper titles and links, "Cited by", card, news and "Now" links, the About numbers and reviewer link, employer links, the Scholar footnotes, the contact email, the award-row link) has an invisible hit area of at least 44px.
  - The hero stacks below 900px.
  - The pipeline runs in a row from 900px and stacks top to bottom below it, the arrows turning to point down.
  - Awards is a full list: one column on phones, two from 900px.
- **Touch:** on coarse pointers every control grows to a 44px target.

## Elevation & Depth

Flat at rest, lifted on hover. Surfaces are separated by tone and 1px hairlines, not by shadow. Cards and pipeline stages that respond to the pointer rise 2px onto a soft, offset shadow when hovered. Nothing carries a shadow at rest. Shadows are tinted toward the page's blue-grey in light mode and pure black in dark mode.

### Shadow Vocabulary
- **Soft** (`0 1px 0 rgb(16 20 26 / 0.04), 0 12px 32px -18px rgb(36 52 70 / 0.3)`): hover lift for research cards and pipeline stages.

### Named Rules
**The Lift-on-Hover Rule.** Cards are flat until a fine pointer reaches them; then they rise 2px onto the Soft shadow over 200ms. Touch never lifts. Reduced motion keeps the shadow and drops the rise.

**The Physical Object Rule.** A shadow means "this responds to you": cards and pipeline stages get one only while a fine pointer hovers them. Nothing casts a shadow at rest.

## Shapes

- **Corner families:**
  - Full pills (999px) for everything pressable: buttons, chips, tags, icon buttons, social links.
  - 14px for containers: cards, the news lead, the photo viewer, pipeline stages.
  - 10px for things inside them, or small on their own: news photos, the speaker-kit photo.
  - 8px for media inset inside a card.
- **Borders:** always 1px Hairline. A 2px Ink top rule marks teaching modules and the three selected papers; a 1px Ink rule marks section sub-heads (Experience columns, the facts list, the talks list).
- **Signature geometry:** the ultrasound sector, a 68° fan drawn from a point at the top. It appears in the nav mark and behind the hero portrait. The marquee separators are small Signal Blue triangles, and the same triangle marks the two ends of the bridge on the Experience timeline (the PhD, `bridge: true`, and the current role), keyed by one line under the Experience title ("Where the work began, and where it is now.") and read to screen readers on each role ("Where the work began." on the PhD, "Where the work is now." on the current role).

## Components

### Buttons
Tactile and precise.
- **Shape:** full pill (999px), 48px tall, 38px for the small variant.
- **Solid:** Ink fill, background-coloured text, weight 550. On hover it turns Powder Blue with Ink text. The hero pairs "Download CV" (solid) with "Read the papers" (ghost): proof before outreach.
- **Ghost:** transparent with a Hairline border; on hover the border turns Ink.
- **Press:** every button scales to 0.97 on `:active` (160ms, strong ease-out). Colour changes take 200ms with `ease`.
- **Icon button:** a 40px circle with a Hairline border that scales to 0.95 on press. It is used for the theme toggle, the menu, the photo viewer and the pause controls (all 40px).
- **Copy button:** a small ghost button with a visible label ("Copy email", "Copy bio"); its copy icon cross-fades to a check (160ms, blurred and scaled). The status line under it ("Copied") never moves the page: under the Talks invite it hangs below the buttons; in the speaker kit success is announced only (the check shows it). If the browser refuses the clipboard, the text is selected and the line says how to copy it. The footer keeps the 40px icon-only version beside the address.

### Chips
- **Style:** transparent, a Hairline pill, Soft Ink text, 38px tall.
- **State:** hover turns the border and text Ink. When pressed (`aria-pressed="true"`), the chip fills with Ink and its text takes the background colour. Used for the publication filters, First author and Journal.

### Tags
- **Style:** small 22px pills, 0.75rem/500, Hairline outline. The accent variant is a Powder Blue fill with Ink text, used for paper status and venue.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Surface, with a 1px Hairline border. The lead news item is the exception: a Powder Blue fill with no border.
- **Shadow Strategy:** flat at rest, lifting on hover (see Elevation & Depth).
- **Internal Padding:** `clamp(1.4rem, 2.5vw, 2rem)` for research cards.
- **Never nested.** Media inside a card sits on Paper with an 8px radius.

### Navigation
- **Bar:** a sticky 64px bar on 80% Cool Paper with a 14px backdrop blur. A Hairline border appears once the page has scrolled.
- **Mark:** the ultrasound-sector glyph next to the owner's name.
- **Links:** 0.925rem in Soft Ink, turning Ink on hover or when current. A 2px Signal Blue underline follows the current section; it moves by transform alone, over 300ms with strong ease-in-out.
- **Mobile:** below 1024px the links become a full-width sheet that fades and drops 6px. It opens in 200ms and closes in 150ms. The sheet adds Contact and Download CV under a hairline, and marks the current section in Ink Blue. Opening it moves focus to the first link; Tab cycles between the menu button and the sheet's links; Escape closes it and returns focus to the button; a tap outside closes it.

### Perception pipeline (signature filter)
- **Shape:** the papers are filtered by where they sit in a perception pipeline, drawn like a model diagram: four stages, Perceive → Learn → Simulate → Deploy (`_data/pipeline.yml`), joined by Signal Blue arrows. Each stage is a 14px card-shaped button on Surface with a Hairline border: the name at 1.05rem/600, the paper count as an Ink Blue numeral (1.6rem/500, tabular) and, in Muted Ink at 0.8rem, what its papers share and what its chips narrow by ("Every paper: deep learning, pose estimation. Narrow by ultrasound."), or, when neither applies, what it includes ("Includes laparoscopy, infrared, wearable sensing."). The line always matches the chips on offer. Screen readers hear that line as the stage's description. Every paper has one primary stage (`stage:` in `_data/publications.yml`), so the four counts add up to the total and each stage really splits the list. From 900px the stages sit in one row 40px apart with the arrows in the gaps; below that they stack 22px apart and the arrows point down.
- **Picking:** a picked stage fills with Ink, like a pressed chip, and the topics its papers share appear under the row as chips with counts, from any stage's topic list ("Narrow to: Ultrasound 4" under Learn). Only a stage with 4 or more papers offers chips, and a topic appears only when 2 or more of its papers use it and not all of them; under First author or Journals a chip that would no longer narrow anything steps aside, and an empty row hides. Picking a topic narrows the stage; picking the stage again clears both. On screens below 900px the unpicked stages then shrink to one line (name and count), so the topics land on screen. First author and Journals sit under the pipeline and preview their counts too ("First author 4"), turning dashed at 0.
- **Panel:** stages, topics and chips sit in one panel that folds behind a 44px "Filter papers" toggle on phones (open on wide screens) and names the current filter ("Pose estimation · journals"). On phones a stage pick keeps the panel open (its topics just appeared); a topic or chip pick folds it, so the result line sits right under the toggle, and if the folded control had focus, focus moves to the toggle. Change reopens the panel and, once it has rendered, focuses the picked topic or stage. Its toggle ends in a chevron that flips (never a ×, which read as "remove filter"), set apart from the filter label; every disclosure on the page (Older news, What I did, Community, Education notes) uses the same chevron. Opened low on a phone screen, the panel scrolls up under the nav. The panel never clips (it fades rather than growing), so focus outlines and the hover lift show in full.
- **Focus and hover:** keyboard focus is a 2px Ink outline 3px outside the stage. Stages follow the Lift-on-Hover rule (fine pointers only); a picked or empty stage does not lift.
- **Counts:** every stage and topic shows how many papers it would leave under the current chips. One that would leave none turns to a dashed outline in Muted Ink.
- **Empty result:** names the combination ("No first-author papers on Hyperspectral yet.") and offers the one change that helps, as a chip ("Show the Hyperspectral paper").
- **Status bar:** directly under the filters, so a pick shows its result at once. The status names what is showing, always with the stage and one separator, the middle dot ("5 of 13 papers in Learn", "4 of 13 papers in Learn · ultrasound · journals"); the toggle reads "Learn · Ultrasound" and the empty state "No first-author papers in Learn on ultrasound yet.", so a topic count is never mistaken for the whole record.
- **Address:** the filter lives in the URL (`?stage=learn&topic=ultrasound&first=1&journal=1`). A shared link opens that view and lands on the status line under the nav. The first change from the unfiltered list adds a history entry and later tweaks replace it, so one Back returns to the unfiltered list. While a filter is on, it pins under the nav for the length of the list, over a Hairline, with Ink Blue text actions that adapt: Show (while the list is still below), Change (whenever the pipeline is out of view or under the nav, or the phone panel is folded; it opens the panel, brings it into view, and focuses the picked topic or stage) and Clear (the only Clear). On touch the actions are 44px tall.
- **List changes:** filtering the list uses same-document View Transitions over 260ms. It is instant when triggered from the keyboard, and a new click finishes a running transition at once (the transition overlay never takes pointer events), so no click is lost.

### News
- **Layout:** two columns from 900px. The left column holds the lead card (Powder Blue) and, under it, the newest photo set among the visible items as a larger strip (140–180px tall) with a short label; that column stays in view while the list scrolls past. The photos open in the photo viewer and are not repeated in the list.

### Awards
- **Style:** one fully visible list under a 1px Ink rule, newest year first and, within a year, first places first; it fills column by column (two columns from 900px), so years read top to bottom. A count line above it says what the About number counts ("15 competitive awards, plus 3 degree honours.", both computed from the data). Each row: the year as a Label, the title at 1rem/600 with its placing as an accent tag ("1st place") and honours as a plain "Honour" tag, the detail in Muted Ink.

### Paper list
- **Style:** compact rows under small inline year headings (0.875rem/600, Muted Ink), each row three lines over a Hairline: the title (1.15–1.2rem/600, Signal Blue underline grows on hover, fine pointers only); then venue, status/award tags, links and "Cited by" (Ink Blue) on one line; then every author on one smaller line (0.8rem, Muted Ink) with the owner's name bold.

### Selected papers
- **Style:** three papers in a row above the filters, each under a 2px Ink rule: year and venue as a Label, the title at 1.3rem/600 with the Signal Blue underline that grows on hover, then status, award and "Cited by" in Ink Blue. From 900px the three share rows through subgrid, so the titles start on one line even when a venue wraps. Chosen with `selected: true` in the data.

### Hero sector (signature)
- **Shape:** the 68° ultrasound fan, drawn as an SVG behind the cut-out portrait and outlined in 1px Signal Blue. On wide screens it ends 12% above the hero's bottom edge, so its arc wraps the shoulders; on stacked layouts the portrait gets room above it, so the tip shows above the head and never reaches the buttons.
- **Fill:** Powder Blue fading with depth, like a real B-mode field: 50% at the tip to 4% at the arc in light, 30% to 2% in dark. Three depth arcs and three edge ticks in Signal Blue at about 30%, 1px.
- **Motion:** fades in with the portrait; drifts slightly against the portrait's parallax (depth -5); lifts with the hero on scroll.

### Speaker kit
- **Place:** in "Talks and reviewing", first in the markup, so phones and screen readers get it right after the invitation and before the past talks; from 900px grid placement puts it in the right-hand column beside the talks (sticky under the nav), with no visual reordering. Each talk can carry optional Slides and Video links (`slides`, `video` in `recognition.yml`), shown only when present, and photos (`photos`, as in news), shown as 112px-tall thumbnails under the event line that open in the photo viewer.
- **Style:** a Hairline-bordered 14px box, flat (no shadow, no fill), the photo as it will download (64px beside the title on phones, 112px beside the text on tablets, 80px beside the title in the column beside the talks; 8px radius), "Speaker kit" at 1.05rem/600, the third-person bio in Soft Ink (up to 62ch), then "Copy bio" and "Download photo" ("JPG, 1024 px" in Muted Ink inside the button) as small ghost buttons directly under the bio. A successful copy shows only the check on the button and is announced; a refused copy shows its instruction in a line under the buttons. The photo is the hero portrait, `assets/img/chiara.jpg`, downloaded as `chiara-di-vece.jpg`.

### Reviewing marquee
- **Place:** inside "Talks and reviewing", under its own sub-head; the track still runs edge to edge (it is clipped by the marquee, never by the page).
- **Track:** venue names at 1rem/500 in Soft Ink, below the count and the award, separated by Signal Blue triangles. It runs linearly over 60s, with faded edges.
- **Heading:** the count leads as a Numeral ("15+", 2–2.6rem/500, Ink Blue) followed by "peer reviews" at 1.35rem/600, over an Ink rule. The Outstanding Reviewer award follows at 1.05rem/600 in Ink. The Awards list also carries it, as a row that links back here, so the About and Awards counts can be checked.
- **Pausing:** hover pauses it and a pause control sits beside the heading. Under reduced motion it becomes a static wrapped list.

### Photo viewer
- **Style:** a native `<dialog>` on Monitor Black with a 14px radius, one fixed frame (up to 1200×800) in which every photo is pinned and fitted (`object-fit: contain`), so the arrows never move between portrait and landscape shots, then a caption line ("2 of 3" in Ink-on-dark 600, then the caption at 85%).
- **Moving through a set:** the photos of one news item form a set. Round arrow buttons sit over the photo's edges (same dark translucent style as the close button); the arrow keys and a sideways swipe also work, wrapping round. With a pointer the next photo fades in from the side it comes from (16px, 220ms, strong ease-out), after it has decoded; keyboard steps and reduced motion swap it without movement.
- **Opening and closing:** opens in 220ms from 96% scale, closes in 150ms; Escape or a click on the backdrop closes it, and focus returns to the thumbnail of the photo last viewed.

### Reveals
- **Entrance:** blocks rise 16px and fade in over 600ms on first view. Groups stagger by 50ms. Figures are uncovered from the top with `clip-path` over 800ms.
- **Reduced motion:** the fade stays and the movement goes.

## Do's and Don'ts

### Do:
- **Do** use Ink Blue (#2b5f8c) for any blue text, and Signal Blue (#5b8fc2) for focus rings, underlines and marks of 1–3px.
- **Do** tell states and categories apart by value (Ink, Powder Blue fill, Sunk Surface, outline) before reaching for anything else.
- **Do** give every pressable element `transform: scale(0.97)` on `:active` at 160ms with `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Do** gate hover motion behind `(hover: hover) and (pointer: fine)`, and give every animation a reduced-motion variant that keeps the fade and drops the movement.
- **Do** put a pause control on anything that moves continuously (WCAG 2.2.2).
- **Do** keep tap targets at 44px on coarse pointers.
- **Do** theme browser surfaces from the palette:
  - text selection in Powder Blue;
  - a 2px Signal Blue focus ring with a 3px offset;
  - scrollbars tinted from Ink;
  - tabular numerals.
- **Do** keep paper titles at least as large as talk titles, and the contact email at most 2.25rem (below the section titles).
- **Do** use real photographs of the owner and real research figures.

### Don't:
- **Don't** add a second hue, a gradient accent or a purple-blue glow.
- **Don't** set text in Powder Blue (#a8c8e8) on a light background.
- **Don't** introduce a second typeface. The earlier Bricolage Grotesque and Geist pairing was rejected for looking AI-generated, and no serif or monospace face belongs here either.
- **Don't** use `transition: all` or animate layout properties. Use transform, opacity, clip-path and box-shadow; `block-size` is allowed only for the details accordion.
- **Don't** lift anything on touch, or move anything under reduced motion.
- **Don't** give anything a shadow at rest.
- **Don't** dim an active control with opacity; switch it to an outline so its text stays at 4.5:1 or more.
- **Don't** nest cards, or build a section out of same-size icon-and-heading cards.
- **Don't** use stock or generated imagery. The one exception is the owner's own portrait, made with AI SuitUp, which the owner chose and keeps.
