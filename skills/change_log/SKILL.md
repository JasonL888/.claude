---
name: change_log
description: Create, update, format, and maintain `changelog.md` files. Use this skill whenever the user asks to: write a changelog, add a release entry, update a changelog.md, format change notes, document a new version,create release notes in changelog format, organize git commits into a changelog, or asks anything involving "changelog", "CHANGELOG", "release notes", "version history", or "what changed in version X". Also trigger when the user provides a list of changes and wants them documented properly.
---

# Changelog Skill

Produce and maintain **changelog.md** files that strictly follow the
[Keep a Changelog 1.0.0](https://keepachangelog.com/en/1.0.0/) convention.

---

## Core Principles

1. **Changelogs are for humans, not machines** — write in clear prose, not git commit noise.
2. **One entry per version** — every released version must appear.
3. **Group changes by type** — use the standard section labels (see below).
4. **Latest version first** — reverse-chronological order.
5. **ISO 8601 dates** — always `YYYY-MM-DD` (e.g. `2024-03-15`).
6. **Keep an `[Unreleased]` section** at the top to collect upcoming changes before a release.
7. **Link versions** — add comparison links at the bottom so each version heading is clickable.
8. **Semantic Versioning** — note adherence to [SemVer](https://semver.org/spec/v2.0.0.html) in the header.

---

## File Structure

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ...

## [1.2.0] - 2024-03-15

### Added
- ...

### Changed
- ...

### Fixed
- ...

## [1.1.0] - 2024-01-10

### Security
- ...

[Unreleased]: https://github.com/user/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/user/repo/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/user/repo/releases/tag/v1.1.0
```

---

## Change Type Labels

Only include sections that have entries. Omit empty sections entirely.

| Label | Use for |
|---|---|
| `Added` | New features |
| `Changed` | Changes to existing functionality |
| `Deprecated` | Features that will be removed in a future release |
| `Removed` | Features removed in this release |
| `Fixed` | Bug fixes |
| `Security` | Vulnerability fixes |

---

## Writing Good Entries

**Do:**
- Write from the user/consumer perspective ("Users can now export to PDF")
- Be concise but specific ("Fix crash when uploading files larger than 2 GB")
- Group related changes under one bullet when sensible
- Reference issue/PR numbers in parentheses where helpful: `Fix login timeout (#412)`

**Don't:**
- Dump raw git commit messages ("Merge pull request #33", "wip", "fix stuff")
- Include internal refactors or CI changes unless they affect users
- Use vague language ("Various improvements", "Minor fixes")
- Mix change types within a single bullet

---

## Yanked Releases

If a release was pulled due to a serious bug or security issue, mark it:

```markdown
## [0.5.1] - 2024-02-01 [YANKED]
```

Still document why it was yanked in the entry if possible.

---

## Releasing: Promoting `[Unreleased]`

When cutting a release:

1. Rename `## [Unreleased]` → `## [X.Y.Z] - YYYY-MM-DD`
2. Add a new empty `## [Unreleased]` section at the top
3. Update the comparison links at the bottom:
   - Change the `[Unreleased]` link to compare new tag → HEAD
   - Add a new link for the released version comparing previous tag → new tag

---

## Workflow: Creating a Changelog from Scratch

1. Check whether a `docs/` directory exists in the project root. If it does, place the file at `docs/changelog.md`; otherwise place it at `changelog.md` in the project root.
2. Ask the user for:
   - Project name and repo URL (for version comparison links)
   - List of versions with their release dates (if known)
   - Changes per version (accept raw git logs, bullet lists, prose — anything)
3. Classify each change into the correct type label
4. Rewrite raw entries into clear, human-friendly language
5. Output a complete `changelog.md` following the structure above
6. Save to the path determined in step 1.

## Workflow: Updating an Existing Changelog

1. Check for `docs/changelog.md` first, then `changelog.md` in the project root. Edit whichever exists.
2. Read the current file to understand existing format and versions.
3. Identify whether the user wants to:
   - Add to `[Unreleased]`
   - Promote `[Unreleased]` to a new version
   - Add a missing historical version
   - Fix formatting issues
4. Make targeted edits; preserve all existing content.
5. Keep version links in sync at the bottom of the file.

---

## Anti-Patterns to Avoid

- **Commit log dumps**: Never paste raw `git log` output
- **Undated versions**: Every released version must have a date
- **Non-ISO dates**: Use `2024-03-15`, not "March 15, 2024" or "15/03/24"
- **Missing `[Unreleased]` section**: Always maintain it even if empty
- **Broken version links**: Keep comparison URLs accurate after each release
- **Over-long entries**: If a single change needs more than 2 sentences, consider a separate release notes document and link to it

---

## Example: Complete Minimal Changelog

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2024-03-20

### Fixed
- Prevent crash when the config file is missing on first launch (#88).
- Correct timezone handling for users in UTC+12 (#91).

## [1.0.0] - 2024-03-01

### Added
- Initial public release with user authentication and dashboard.
- CSV export for all report types.
- Dark mode support.

### Security
- All passwords hashed with bcrypt (cost factor 12).

[Unreleased]: https://github.com/user/repo/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/user/repo/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```