# Markdown Notes App — Build Plan

## Overview
A lightweight in-browser markdown note-taking app. Notes persist in `localStorage` and are written/stored as plain markdown.

## Features
- **Write** markdown in a text editor
- **Preview** rendered markdown on demand
- **Save & reload** — notes survive page refresh
- **Search** notes by title or content
- **Tag** notes using `#tag` syntax in the note body (no frontmatter)

## Specifications
- Storage: `localStorage` (no backend)
- Format: plain `.md` text per note
- Tags: parsed from `#tag` words in the note body — simpler than frontmatter
- Syntax highlighting: in the editor pane
- Preview: toggled by a button (edit ↔ preview)

## Build Steps

1. **Note editor** — textarea with basic markdown syntax highlighting (CodeMirror or similar)
2. **Preview toggle** — button switches between raw editor and rendered HTML (use `marked` or `remark`)
3. **Save a note** — name + save button, stored as a key in `localStorage`
4. **Note list** — sidebar listing saved notes; click to load one
5. **Delete a note** — remove from list and `localStorage`
6. **Search** — filter the note list by title or content in real time
7. **Tags** — parse `#tag` tokens from note body; display as chips; click to filter by tag

---

**Key simplifications:**
- Removed frontmatter in favor of inline `#tag` syntax — easier to write and parse
- Combined original steps 5–8 into concrete, discrete steps
- Removed AI agent feature as out of scope for the initial build
