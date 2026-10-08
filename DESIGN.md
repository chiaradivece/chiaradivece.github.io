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
  ghost: "#e2e8ef"
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
  ghost-dark: "#151b23"
  paper-dark: "#eef2f5"
typography:
  display:
    fontFamily: "\"Helvetica Neue\", Helvetica, \"TeX Gyre Heros\", Arial, sans-serif"
    fontSize: "clamp(2.1rem, 4.3vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "\"Helvetica Neue\", Helvetica, \"TeX Gyre Heros\", Arial, sans-serif"
    fontSize: "clamp(2.4rem, 5.4vw, 4.25rem)"
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
  label-caps:
    fontFamily: "\"Helvetica Neue\", Helvetica, \"TeX Gyre Heros\", Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.12em"
rounded:
  pill: "999px"
  md: "14px"
  sm: "10px"
  inset: "8px"
spacing:
  tile-gap: "8px"
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
  award-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "1.25rem"
  news-lead:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: "clamp(1.5rem, 3vw, 2.25rem)"
  element-imaging:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.sm}"
    padding: "8px 9px"
  element-learning:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.sm}"
    padding: "8px 9px"
  element-geometry:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 9px"
  element-practice:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 9px"
  badge-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    width: "248px"
  badge-header:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-caps}"
    height: "34px"
  scan-monitor:
    backgroundColor: "{colors.screen}"
    rounded: "{rounded.md}"
  nav:
    backgroundColor: "{colors.nav-bg}"
    height: "64px"
---

# Design System: Chiara Di Vece

## Overview

**Creative North Star: "Clean Signal"**

One clear signal on a quiet field. The page is a cool, near-white field of blue-grey neutrals. Across it runs a single powder-blue signal that marks what matters: the selected filter, the current job, the first number, the dot that ends the headline. Helvetica Neue carries everything, set tight and large where it speaks and loose and calm where it informs. The precision is technical. The warmth comes from a real person: the portrait, the swinging ID badge, the live local time, the photos from the viva.

The density is moderate and the rhythm is editorial: big section titles with one word in italic, hairline rules instead of boxes, and data laid out as lists and grids rather than dashboards. A few hand-made objects carry the personality, so the rest of the page can stay plain:

- an ultrasound monitor that stays dark in both themes;
- a periodic table of research elements;
- an ID badge on a lanyard;
- a marquee of reviewing venues.

Motion is physical and brief: strong ease-out curves, springs for anything that hangs or follows the pointer, and nothing that moves without a way to pause it.

The mood is crisp, technical and human. The confirmed anti-reference is anything that reads as AI-generated: template typography, purple-blue glow gradients, stock imagery, generic same-size feature cards.

**Key Characteristics:**
- One hue (powder blue) on cool blue-grey neutrals; every neutral leans toward the accent's hue.
- A single family, Helvetica Neue, with a self-hosted TeX Gyre Heros fallback.
- Flat surfaces with 1px hairlines; cards lift onto a soft shadow on hover.
- Pills for things you press, 14px corners for things that hold content.
- Real photography and real research figures only.
- Light and dark themes with the same structure; the scan monitor is always dark.
- Motion uses strong ease-out (`cubic-bezier(0.23, 1, 0.32, 1)`), presses scale to 0.97, and every looping animation can be paused.

## Colors

A cool, nearly monochrome field with one powder-blue signal, used at three strengths for three jobs.

### Primary
- **Powder Blue** (#a8c8e8): the owner's chosen accent and the only hue on the page. Used as a fill:
  - the lead news card;
  - the header strip of the Scientist ID badge;
  - the "Learning" family of element tiles;
  - the solid button's hover state;
  - text selection.

  It is identical in both themes.
- **Signal Blue** (#5b8fc2; Powder Blue in dark): the same hue deepened until small marks reach 3:1 on light backgrounds. Used for:
  - focus rings;
  - the nav underline;
  - link underlines and the timeline fill;
  - the badge lanyard;
  - the marquee's triangle separators;
  - the full stop after the hero headline;
  - the selected element tile's ring.
- **Ink Blue** (#2b5f8c; #bcd7f0 in dark): text-safe blue at 4.5:1 or more. Used for:
  - link hover;
  - the citation count in About;
  - the most recent award year;
  - module codes.

### Neutral
- **Cool Paper** (#f4f6f8 / #0c0f13): the page background.
- **Surface** (#fcfdfe / #141920): research cards, award cards, the badge.
- **Sunk Surface** (#e7ecf1 / #1a2028): the "3D and simulation" element tiles, the simulation card's dot grid, photo placeholders.
- **Ink** (#10141a / #e8edf2): headings, primary text, the solid button, the "Imaging" element tiles.
- **Soft Ink** (#3f4852 / #b0bac4): body copy in paragraphs and lists.
- **Muted Ink** (#5c6773 / #8a95a1): dates, labels, captions, secondary metadata.
- **Hairline** (#d3dbe3 / #26303a): 1px rules, card borders, outlines for chips and ghost buttons.
- **Ghost** (#e2e8ef / #151b23): the giant name behind the hero portrait, a whisper above the background.
- **Monitor Black** (#0a0d11): the scan screen and the lightbox, in both themes.

### Named Rules
**The One Signal Rule.** Powder blue is the only hue. Families and states are told apart by value (ink, blue fill, sunk grey, outline), never by adding a colour. The four element families prove that it works.

**The Three Blues Rule.** Fill blue is for areas, Signal Blue for marks of 1–3px, Ink Blue for text. Never set text in fill blue on a light background.

**The Monitor Rule.** Anything that shows imaging (the scan, the photo lightbox) sits on Monitor Black in both themes, like a real screen.

## Typography

**Display Font:** Helvetica Neue (with Helvetica, then self-hosted TeX Gyre Heros, then Arial)
**Body Font:** the same
**Label/Mono Font:** none; numerals use tabular figures instead of a mono face

**Character:** One Swiss grotesque doing every job. Large sizes are set tight (-0.04em to -0.045em) with solid line-height; body text breathes at 1.6. Emphasis comes from the same family, through italic, weight or size, never from a second face.

### Hierarchy
- **Display** (700, clamp(2.1rem, 4.3vw, 3.75rem), 1): the hero headline, one phrase per line, ending in a Signal Blue full stop. The giant ghost name behind the portrait (700, up to 21rem, -0.06em) is decoration, not text.
- **Headline** (500, clamp(2.4rem, 5.4vw, 4.25rem), 1): section titles. Exactly one word is italic (400, with descender room), as in "Things I've *written*".
- **Title** (600, clamp(1.4rem, 2.2vw, 1.85rem), 1.1): research card headings. Smaller titles step down: job role 1.12rem/600, paper title 1.1rem/600, award title 1.05rem/600.
- **Lead** (400–500, clamp(1.25rem, 2vw, 1.5rem), 1.35): the opening paragraph of About and Research, and the lead news item.
- **Body** (400, 1rem, 1.6): paragraphs in Soft Ink, held to 58–62ch.
- **Numeral** (500, clamp(2rem, 3vw, 2.6rem), 1): Scholar numbers; the first one in Ink Blue.
- **Label** (400, 0.75–0.85rem): dates, captions, metadata in Muted Ink.
- **Label Caps** (700, 0.72rem, 0.12em, uppercase): used only on the ID badge (its header and field labels), where an ID card would use it.

### Named Rules
**The One Family Rule.** Helvetica Neue only. No serif, no monospace, no display face from a template library.

**The One Italic Rule.** A section title gets one italic word, in the same family at a lighter weight. Never two, never a different font.

## Layout

- **Container:** one 1240px column, with 16px side gutters on phones and 32px from 768px up.
- **Section spacing:** sections are separated by `clamp(3.5rem, 6vw, 5.5rem)` of padding. Contact gets more, up to 7.5rem above.
- **Composition:** asymmetric grids carry each section rather than centred stacks:
  - About is 5 : 4 : 3 (text, badge, facts);
  - News is 6 : 5;
  - Research is 5 : 6, then a 6-column grid of research cards;
  - Experience is two equal columns.
- **Grid gaps:** cards and rails sit 16px apart; element tiles 8px apart.
- **Hero:** fills the viewport under the nav. The copy is left-aligned in the lower left; the cut-out portrait is anchored bottom-right and fades out at its lower edge.
- **Responsive changes:**
  - The nav collapses into a menu below 1024px.
  - The hero stacks below 900px.
  - Element tiles go from 4 columns to 8 at 640px.
  - The awards rail shows about 1.3, then 2.4, then 4 cards.
- **Touch:** on coarse pointers every control grows to a 44px target.

## Elevation & Depth

Flat at rest, lifted on hover. Surfaces are separated by tone and 1px hairlines, not by shadow. Cards and tiles that respond to the pointer rise 2px onto a soft, offset shadow when hovered. Only objects that are physical in the metaphor carry a shadow at rest: the ID badge hanging on its lanyard and the scan monitor. Shadows are tinted toward the page's blue-grey in light mode and pure black in dark mode.

### Shadow Vocabulary
- **Soft** (`0 1px 0 rgb(16 20 26 / 0.04), 0 12px 32px -18px rgb(36 52 70 / 0.3)`): hover lift for research cards, award cards and element tiles; the scan monitor at rest.
- **Lift** (`0 1px 0 rgb(16 20 26 / 0.04), 0 28px 48px -26px rgb(36 52 70 / 0.45)`): the ID badge, which hangs in front of the page.
- **Selection ring** (`0 0 0 2px bg, 0 0 0 4px Signal Blue`): a selected element tile; combined with Soft on hover.

### Named Rules
**The Lift-on-Hover Rule.** Cards are flat until a fine pointer reaches them; then they rise 2px onto the Soft shadow over 200ms. Touch never lifts. Reduced motion keeps the shadow and drops the rise.

**The Physical Object Rule.** A shadow at rest means "this is an object": the badge, the monitor. Nothing else casts one until it is hovered.

## Shapes

- **Corner families:**
  - Full pills (999px) for everything pressable: buttons, chips, tags, icon buttons, social links.
  - 14px for containers: cards, the badge, the news lead, the monitor, the lightbox.
  - 10px for things inside them, or small on their own: element tiles, photos in the badge and news.
  - 8px for media inset inside a card.
- **Borders:** always 1px Hairline. A 2px Ink top rule marks teaching modules; a 1px Ink rule marks section sub-heads (Experience columns, the facts list, the talks list).
- **Signature geometry:** the ultrasound sector, a 68° fan drawn from a point at the top. It appears in the nav mark, in the badge header glyph and in the scan itself. The marquee separators are small Signal Blue triangles.

## Components

### Buttons
Tactile and precise.
- **Shape:** full pill (999px), 48px tall, 38px for the small variant.
- **Solid:** Ink fill, background-coloured text, weight 550. On hover it turns Powder Blue with Ink text.
- **Ghost:** transparent with a Hairline border; on hover the border turns Ink.
- **Press:** every button scales to 0.97 on `:active` (160ms, strong ease-out). Colour changes take 200ms with `ease`.
- **Icon button:** a 40px circle with a Hairline border that scales to 0.95 on press. It is used for the theme toggle, the menu, the rail arrows and the pause controls.

### Chips
- **Style:** transparent, a Hairline pill, Soft Ink text, 38px tall.
- **State:** hover turns the border and text Ink. When pressed (`aria-pressed="true"`), the chip fills with Ink and its text takes the background colour. Used for the publication filters, First author and Journal.

### Tags
- **Style:** small 22px pills, 0.75rem/500, Hairline outline. The accent variant is a Powder Blue fill with Ink text, used for paper status and venue.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Surface, with a 1px Hairline border. The lead news item is the exception: a Powder Blue fill with no border.
- **Shadow Strategy:** flat at rest, lifting on hover (see Elevation & Depth).
- **Internal Padding:** `clamp(1.4rem, 2.5vw, 2rem)` for research cards, 1.25rem for award cards.
- **Never nested.** Media inside a card sits on Paper with an 8px radius.

### Navigation
- **Bar:** a sticky 64px bar on 80% Cool Paper with a 14px backdrop blur. A Hairline border appears once the page has scrolled.
- **Mark:** the ultrasound-sector glyph next to the owner's name.
- **Links:** 0.925rem in Soft Ink, turning Ink on hover or when current. A 2px Signal Blue underline follows the current section; it moves by transform alone, over 300ms with strong ease-in-out.
- **Mobile:** below 1024px the links become a full-width sheet that fades and drops 6px. It opens in 200ms and closes in 150ms.

### Scientist ID badge (signature)
- **Card:** a 248px Surface card with the Lift shadow.
- **Header:** a Powder Blue strip with the sector glyph and "SCIENTIST ID" in Label Caps.
- **Contents:** a photo, the name, the role, and two labelled fields.
- **Lanyard:** the badge hangs from a pin by a Signal Blue strap and a metal clip.
- **Motion:** a damped pendulum with stiffness 60, damping 5 and a 28° limit:
  - it drops in when About first scrolls into view;
  - it can be dragged and thrown, with rising friction past the limit;
  - a passing mouse gives it a small nudge.
- **Reduced motion:** the badge hangs still.

### Research elements table (signature)
- **Tiles:** square tiles in a periodic-table grid. Each shows a paper count, a two-letter symbol (700, tight) and a name.
- **Families:** the four families are told apart by value alone (Ink, Powder Blue, Sunk Surface, Hairline outline), never by a new hue. The legend repeats them as 12px swatches.
- **Selection:** a selected tile gets the Selection ring, and unselected tiles dim to 32% opacity.
- **List changes:** filtering the list uses same-document View Transitions over 260ms. It is instant when triggered from the keyboard.

### Scan monitor (signature)
- **Screen:** a Monitor Black screen with a 14px radius, an inner 1px white hairline at 7% and the Soft shadow. A canvas simulation of a soft actuator runs on it, shown as an ultrasound image.
- **Controls:** it pauses offscreen, and a pause button sits in its corner.

### Reviewing marquee
- **Track:** venue names in large weight-500 type, separated by Signal Blue triangles. It runs linearly over 60s, with faded edges.
- **Pausing:** hover pauses it and a pause control sits beside the heading. Under reduced motion it becomes a static wrapped list.

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
- **Do** use real photographs of the owner and real research figures.

### Don't:
- **Don't** add a second hue, a gradient accent or a purple-blue glow.
- **Don't** set text in Powder Blue (#a8c8e8) on a light background.
- **Don't** introduce a second typeface. The earlier Bricolage Grotesque and Geist pairing was rejected for looking AI-generated, and no serif or monospace face belongs here either.
- **Don't** use `transition: all` or animate layout properties. Use transform, opacity, clip-path and box-shadow; `block-size` is allowed only for the details accordion.
- **Don't** lift anything on touch, or move anything under reduced motion.
- **Don't** give a card a shadow at rest unless it is a physical object (the badge, the monitor).
- **Don't** nest cards, or build a section out of same-size icon-and-heading cards.
- **Don't** use stock or generated imagery.
