#!/usr/bin/env python3
"""
Pre-build script: Scans Projects/ and emits assets/projects.json
with metadata extracted from each subfolder's README.md or metadata.json.
"""

import json
import os
import re
import sys
from pathlib import Path

PROJECTS_DIR = Path(__file__).parent / "Projects"
OUTPUT_FILE = Path(__file__).parent / "assets" / "projects.json"

# Map of regex patterns to technology labels.
# Using word-boundary patterns avoids false positives (e.g. "Go" in prose).
TECH_HINTS: list[tuple[re.Pattern, str]] = [
    (re.compile(r"\bpython\b", re.I),       "Python"),
    (re.compile(r"\bjavascript\b", re.I),   "JavaScript"),
    (re.compile(r"\btypescript\b", re.I),    "TypeScript"),
    (re.compile(r"\breact\b", re.I),         "React"),
    (re.compile(r"\bnode\.?js\b", re.I),     "Node.js"),
    (re.compile(r"\bexpress\.?js?\b", re.I), "Express"),
    (re.compile(r"\bdocker\b", re.I),        "Docker"),
    (re.compile(r"\barduino\b", re.I),       "Arduino"),
    (re.compile(r"\besp32\b", re.I),         "ESP32"),
    (re.compile(r"\bfastapi\b", re.I),       "FastAPI"),
    (re.compile(r"\bpytorch\b", re.I),       "PyTorch"),
    (re.compile(r"\btensorflow\b", re.I),    "TensorFlow"),
    (re.compile(r"\bmongodb\b", re.I),       "MongoDB"),
    (re.compile(r"\btailwind\b", re.I),      "Tailwind CSS"),
    (re.compile(r"\bvite\b", re.I),          "Vite"),
    (re.compile(r"\bnginx\b", re.I),         "Nginx"),
    (re.compile(r"\bjwt\b", re.I),           "JWT"),
    (re.compile(r"\bmern\b", re.I),          "MERN Stack"),
    (re.compile(r"\bflask\b", re.I),         "Flask"),
    (re.compile(r"\.html?\b", re.I),         "HTML"),
    (re.compile(r"\.css\b", re.I),           "CSS"),
    (re.compile(r"\bc\+\+\b", re.I),         "C++"),
    (re.compile(r"\brust\b", re.I),          "Rust"),
    (re.compile(r"\bgolang\b|\bgo\s+module", re.I), "Go"),
    (re.compile(r"\bjava\b(?!script)", re.I), "Java"),
    (re.compile(r"\bspring\s*boot\b", re.I), "Spring Boot"),
    (re.compile(r"\baws\b", re.I),           "AWS"),
    (re.compile(r"\bazure\b", re.I),         "Azure"),
]


def clean_text(text: str) -> str:
    """Strip markdown formatting artefacts from a string."""
    text = re.sub(r"<[^>]+>", "", text)          # HTML tags
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)  # images / badges
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)  # links → text
    text = re.sub(r"[*_`#>]", "", text)           # markdown chars
    text = re.sub(r"\s+", " ", text).strip()
    # strip leading emoji sequences (unicode + variation selectors)
    text = re.sub(r"^[\U0001F300-\U0001FAFF\u2600-\u27BF\uFE0F\u200D\s]+", "", text)
    return text


def extract_title_from_readme(lines: list[str]) -> str | None:
    """Return the first top-level heading stripped of decoration."""
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("# "):
            title = clean_text(stripped[2:])
            # Guard against duplicate titles jammed onto one line
            # e.g. "Online Quiz & Questionnaire Platform 🎓 Online Quiz …"
            if len(title) > 60:
                # Try splitting on emoji boundaries
                parts = re.split(r"[\U0001F300-\U0001FAFF\u2600-\u27BF]", title)
                if parts and len(parts[0].strip()) > 10:
                    title = parts[0].strip()
            return title
    return None


def extract_description_from_readme(lines: list[str]) -> str | None:
    """Grab the first meaningful paragraph after the title."""
    past_title = False
    for line in lines:
        stripped = line.strip()
        if not past_title:
            if stripped.startswith("# "):
                past_title = True
            continue
        # Skip blank lines, badges, HTML divs, block-quotes, sub-headings
        if not stripped:
            continue
        if stripped.startswith(("![", "<", ">", "#", "|", "---", "***")):
            continue
        candidate = clean_text(stripped)
        if len(candidate) > 20:
            # Truncate to ~200 chars at a sentence boundary
            if len(candidate) > 200:
                cut = candidate[:200].rfind(".")
                if cut > 80:
                    candidate = candidate[: cut + 1]
                else:
                    candidate = candidate[:200].rstrip() + "…"
            return candidate
    return None


def detect_technologies(text: str, file_listing: list[str]) -> list[str]:
    """Infer technologies from README text + filenames in the project."""
    found: set[str] = set()
    combined = text + " " + " ".join(file_listing)
    for pattern, label in TECH_HINTS:
        if pattern.search(combined):
            found.add(label)
    return sorted(found)


def find_repo_link(lines: list[str], folder_name: str) -> str | None:
    """Try to extract a project-specific URL from the README."""
    for line in lines:
        urls = re.findall(r'https?://[^\s<>"\)]+', line)
        for url in urls:
            # Prefer links that look like the project's own repo / demo
            if "github.com" in url and folder_name.lower().replace("-", "").replace("_", "") in url.lower().replace("-", "").replace("_", ""):
                return url
    return None


def process_project(folder: Path) -> dict:
    """Build a metadata dict for a single project folder."""
    name = folder.name.replace("-", " ").replace("_", " ")
    description = None
    technologies: list[str] = []
    link = None
    readme_text = ""

    # --- Try metadata.json first (highest priority) ---
    meta_file = folder / "metadata.json"
    if meta_file.is_file():
        try:
            with open(meta_file, encoding="utf-8") as f:
                meta = json.load(f)
            name = meta.get("name", name)
            description = meta.get("description", description)
            technologies = meta.get("technologies", technologies)
            link = meta.get("link", link)
        except (json.JSONDecodeError, KeyError):
            pass  # fall through to README parsing

    # --- Parse README.md as fallback / supplement ---
    readme_file = folder / "README.md"
    if readme_file.is_file():
        try:
            with open(readme_file, encoding="utf-8") as f:
                readme_lines = f.readlines()
            readme_text = "".join(readme_lines)

            if not description or description == name:
                description = extract_description_from_readme(readme_lines)

            title = extract_title_from_readme(readme_lines)
            if title:
                name = title

            if not link:
                link = find_repo_link(readme_lines, folder.name)
        except OSError:
            pass

    # --- Technology detection from content + file listing ---
    file_listing = []
    try:
        file_listing = [p.name for p in folder.rglob("*") if p.is_file()]
    except OSError:
        pass

    if not technologies:
        technologies = detect_technologies(readme_text + " ".join(file_listing), file_listing)

    return {
        "id": folder.name,
        "name": name,
        "description": description or "No description available.",
        "technologies": technologies,
        "link": link,
        "path": f"Projects/{folder.name}",
    }


def main() -> None:
    if not PROJECTS_DIR.is_dir():
        print(f"ERROR: Projects directory not found at {PROJECTS_DIR}", file=sys.stderr)
        sys.exit(1)

    projects = []
    for entry in sorted(PROJECTS_DIR.iterdir()):
        if entry.is_dir() and not entry.name.startswith("."):
            print(f"  → Processing {entry.name}")
            projects.append(process_project(entry))

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Wrote {len(projects)} projects to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
