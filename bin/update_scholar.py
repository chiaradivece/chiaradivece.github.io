#!/usr/bin/env python3
"""Refresh _data/scholar.yml from the public Google Scholar profile.

Run by .github/workflows/scholar.yml once a week, or by hand:

    python3 bin/update_scholar.py

Google Scholar has no API, so this reads the public profile page. If Google
blocks the request or the page layout changes, the script leaves the existing
file untouched and exits cleanly, so the site keeps the last known numbers.
Only the standard library is used, so CI needs no installs.
"""

import datetime
import html
import os
import re
import sys
import urllib.request

USER_ID = "CStrr20AAAAJ"
PROFILE_URL = f"https://scholar.google.com/citations?user={USER_ID}&hl=en"
FETCH_URL = PROFILE_URL + "&cstart=0&pagesize=100"
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "_data", "scholar.yml")
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
)


def warn(msg):
    # Shows up as a yellow annotation in GitHub Actions, plain text locally
    print(f"::warning::{msg}" if os.environ.get("GITHUB_ACTIONS") else f"warning: {msg}")


def slugify(text):
    """Match Jekyll's default `slugify` filter so index.html can look papers up by title."""
    return re.sub(r"[^0-9A-Za-z]+", "-", text).strip("-").lower()


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept-Language": "en"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def parse(page):
    stats = [int(n) for n in re.findall(r'<td class="gsc_rsb_std">(\d+)</td>', page)]
    if len(stats) < 6:
        return None
    # The stats table is [citations all, since-year, h-index all, since, i10 all, since]
    result = {"citations": stats[0], "h_index": stats[2], "i10_index": stats[4], "papers": {}}

    for row in re.findall(r'<tr class="gsc_a_tr">(.*?)</tr>', page, re.S):
        title = re.search(r'class="gsc_a_at">(.*?)</a>', row, re.S)
        cites = re.search(r'<a href="([^"]*)" class="gsc_a_ac[^"]*">(.*?)</a>', row, re.S)
        if not title or not cites:
            continue
        count = re.sub(r"\D", "", html.unescape(re.sub(r"<[^>]+>", "", cites.group(2))))
        if not count:
            continue
        key = slugify(html.unescape(title.group(1)))
        # Keep the higher count if Scholar lists a title twice (thesis versions, merges)
        if int(count) >= result["papers"].get(key, {}).get("cites", 0):
            result["papers"][key] = {"cites": int(count), "url": html.unescape(cites.group(1))}
    return result


def read_previous_citations():
    try:
        with open(OUT_PATH, encoding="utf-8") as f:
            match = re.search(r"^citations: (\d+)$", f.read(), re.M)
            return int(match.group(1)) if match else None
    except FileNotFoundError:
        return None


def to_yaml(data):
    lines = [
        "# Written by bin/update_scholar.py (weekly GitHub Action). Edits by hand get overwritten.",
        f'profile: "{PROFILE_URL}"',
        f"updated: {datetime.date.today().isoformat()}",
        f"citations: {data['citations']}",
        f"h_index: {data['h_index']}",
        f"i10_index: {data['i10_index']}",
        "papers:",
    ]
    for key in sorted(data["papers"]):
        paper = data["papers"][key]
        lines.append(f"  {key}:")
        lines.append(f"    cites: {paper['cites']}")
        lines.append(f'    url: "{paper["url"]}"')
    return "\n".join(lines) + "\n"


def main():
    try:
        page = fetch(FETCH_URL)
    except Exception as exc:  # network error, 429, etc.
        warn(f"Could not reach Google Scholar ({exc}); keeping the existing numbers.")
        return 0

    data = parse(page)
    if data is None:
        warn("Google Scholar returned a page without stats (likely a CAPTCHA); keeping the existing numbers.")
        return 0

    previous = read_previous_citations()
    if previous and data["citations"] < previous * 0.9:
        warn(f"Citations dropped from {previous} to {data['citations']}; looks like a parsing problem, skipping.")
        return 0

    new = to_yaml(data)
    try:
        with open(OUT_PATH, encoding="utf-8") as f:
            old = f.read()
    except FileNotFoundError:
        old = ""
    # Only rewrite when a number changed, so quiet weeks don't create commits
    strip_date = lambda text: re.sub(r"^updated: .*$", "", text, flags=re.M)
    if strip_date(new) == strip_date(old):
        print("No changes on Google Scholar.")
        return 0

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(new)
    print(f"Updated: citations={data['citations']} h_index={data['h_index']} papers={len(data['papers'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
