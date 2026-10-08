# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

No single primary audience (confirmed). The site has to work equally well for three groups:

- **Industry people**: recruiters, hiring managers, founders and investors in AI and robotics checking who Chiara is and what has been built.
- **Research peers**: academics, collaborators and students who come for the papers.
- **Organisers and editors**: conference, workshop and journal people deciding whether to invite Chiara to speak, review or chair.

## Product Purpose

The personal site of Chiara Di Vece, PhD: AI Lead and Founding Applied Scientist at morph, PhD in Computer Science from UCL (2026). It replaced an al-folio academic template that the owner described as "extremely sad" with a site that feels personal and current.

A good visit ends in one of these (confirmed):

- **A quick credibility check.** The visitor downloads the CV, or scans roles, numbers and awards, and leaves convinced.
- **Papers read or cited.** The visitor finds the right paper, opens it, or follows the Scholar link.
- **An invitation.** The visitor asks Chiara to give a talk, review or join a committee.

Unsolicited email was not picked as a success measure. The contact section stays, but the page is not built around driving outreach.

## Positioning

Three claims, in this order of weight (confirmed):

1. **The bridge.** Real-time medical-imaging AI (freehand fetal ultrasound navigation, the PhD) carried into soft robotics (morph). Few people have done both. The hero states it: "From computer vision for fetal ultrasound to soft robotics."
2. **An industry lead who still publishes.** Runs AI at a robotics startup and keeps publishing peer-reviewed research.
3. **Real-time perception as the through-line.** Pose estimation and navigation, whatever the body or the robot.

## Operating Context

- A single page at https://chiaradivece.github.io/, built with plain Jekyll 4.3 (no theme). Pushing to `master` deploys through `.github/workflows/deploy.yml` to the `gh-pages` branch.
- All content lives in `_data/*.yml`. The owner updates the site by editing YAML, not HTML.
- Google Scholar citations, h-index and per-paper counts refresh weekly (`.github/workflows/scholar.yml` running `bin/update_scholar.py`). Paper and award counts are computed from the YAML, so they cannot drift.
- Per-paper citation links are matched by title, so publication titles must stay identical to Scholar's.
- News is maintained by hand in `_data/news.yml`.
- Old al-folio URLs keep working through `_redirects/`.

## Capabilities and Constraints

- **Sections, in page order:**
  - hero (role line, headline, photo inside a faint ultrasound sector)
  - About (text, facts, Scholar numbers)
  - News
  - Research (a simulated ultrasound scan, then the research cards)
  - Publications (three selected papers, then the full list filtered by research element, first author, journal)
  - Talks and reviewing (topics and an invitation link, past talks, the review count and reviewer award, the venue marquee)
  - Experience and education (short roles fold their details away)
  - Awards
  - Teaching and mentoring
  - Contact (email, CV, local clocks)
- **Terminology:**
  - "Elements" are the research topics in the periodic-table-style filter (`_data/elements.yml`).
  - "First author" includes co-first authorship.
  - The TMI paper under review counts as a journal paper (it is on arXiv).
- **morph is in stealth.** The site shows the name, the link and Chiara's role only. No product, customer, funding or technical details.
- **Public email:** chiaradivece@gmail.com.
- **Cities:** Seattle (home base) and London (also a work base) appear once, on the contact clocks, and nowhere else.
- **Stack:** no JavaScript framework and no build step beyond Jekyll. Scripts are vanilla JS in `assets/js/`.
- **Publishing guard:** any repository file that is not part of the site must be added to `exclude` in `_config.yml`, or Jekyll will publish it.

## Brand Commitments

- **Name and title:** Chiara Di Vece, PhD. AI Lead (short form); AI Lead and Founding Applied Scientist (full form).
- **Voice:** first person, plain and specific, warm without hype. Copy that sounded generated was rejected in review; a plain statement beats a clever one. Approved lines:
  - "From computer vision for fetal ultrasound to soft robotics."
  - "My PhD taught machines to find their way through fetal ultrasound. Now I build AI for soft robots."
  - "The scan brings the two together: a simulated soft actuator, shown as an ultrasound image."
- **Binding visual constraints set by the owner** (recorded, not expanded):
  - a powder-blue accent
  - Helvetica Neue
  - the owner's real photo
  - the site must not look AI-generated
  - keep the horizontally scrolling reviewing-venues marquee

## Evidence on Hand

- **Portrait:** `assets/img/chiara.jpg`, plus a cutout at `assets/img/chiara-cutout.webp`.
- **CV:** the short CV at `assets/pdf/Chiara_Di_Vece_CV.pdf`. An extended CV exists but is not published.
- **Publications:** 13 papers with links and notes in `_data/publications.yml`. Live Scholar numbers are in `_data/scholar.yml`.
- **Recognition:** awards, reviewing venues, talks, teaching, mentoring and community roles in `_data/recognition.yml`.
- **Research images:** `assets/img/research/fetal-pipeline.jpg` and `assets/img/research/hykey.jpg`.
- **Viva photos:** `assets/img/news/viva-*.webp`.
  - The group photo shows about 25 colleagues; the owner confirmed their consent to publish it (October 2026).
- **Key dates:**
  - PhD viva: 27 February 2026, passed with minor corrections.
  - PhD awarded: 28 September 2026.
- **Absent, never fabricate:**
  - testimonials or quotes
  - morph product details or metrics
  - press coverage
  - a UCL staff profile (the old URL returns 404)

## Product Principles

1. **Three audiences, one page.** Each section should serve the credibility check, the paper hunt or the invitation decision, and no audience should have to wade through another's material to find its own.
2. **Proof over claims.** Numbers, papers, awards and dates come from the data files and Scholar. Add nothing the data cannot back.
3. **The bridge leads.** When space is tight, the fetal-ultrasound-to-soft-robotics story wins over a generic "AI researcher" framing.
4. **A person, not a template.** Real photos, the owner's own voice, specific details. Anything that reads as template or generated output is a regression.
5. **Content stays in YAML.** New features must keep the site editable through `_data/` alone.

## Accessibility & Inclusion

- WCAG 2.2 AA is the bar. The page was audited against it with axe-core at the owner's request in October 2026.
- Moving content (the scan, the marquee) has pause controls, per WCAG 2.2.2.
- Under reduced motion, fades stay and movement goes.
