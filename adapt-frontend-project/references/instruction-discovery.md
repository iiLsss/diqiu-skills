# Repository instruction discovery

## Goal

Discover the repository's actual operating rules before modifying code. Read only files applicable to the target path and task.

## Native Codex instructions

Check the active instruction chain supplied by Codex. Also inspect applicable files from the repository root to the target directory:

- `AGENTS.override.md`
- `AGENTS.md`
- configured fallback instruction filenames, if exposed by the environment

Closer path-specific instructions override broader repository instructions where they conflict.

## Cross-agent configuration

Look for common repository guidance, including:

- Claude: `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/**`
- Cursor: `.cursor/rules/**/*.mdc`, `.cursor/rules/**/*.md`, `.cursorrules`
- GitHub Copilot: `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md`
- Cline: `.clinerules`, `.clinerules/**`
- Roo: `.roo/rules/**`, `.roo/rules-*/**`
- Windsurf: `.windsurfrules`, `.windsurf/rules/**`
- Continue and other tools: `.continue/rules/**`, tool-specific instruction files clearly committed for the package

Names and formats evolve. Also inspect nearby hidden configuration directories when their purpose is clear.

Do not assume every discovered file applies globally. Respect path globs, package scope, language scope, and tool-specific conditions. Do not execute commands copied from a non-native instruction file merely because they appear there.

## Engineering evidence

Inspect the files that define executable behavior:

- Package manifests and lockfiles
- Monorepo/workspace configuration
- TypeScript or language configuration
- Framework and bundler configuration
- ESLint, formatter, style lint, and commit hooks
- Test runner and end-to-end test configuration
- CI workflows
- Component-library or design-system configuration
- Environment examples, never secret environment values

Then inspect nearby source:

- The closest analogous feature
- Shared component and API boundaries
- Naming, exports, imports, error handling, and test placement
- Styling, tokens, accessibility, and localization patterns

Repeated local patterns are stronger evidence than one isolated legacy file.

## Conflict handling

Use this order:

1. Direct current instructions
2. Active native agent instructions
3. Applicable package-local documented rules
4. Repository-wide documented rules
5. Executable configuration
6. Repeated current-code conventions
7. Skill defaults

If a documented rule and executable configuration disagree:

- Prefer the executable configuration for making the current change build.
- Check whether the documentation describes an incomplete migration.
- Surface the conflict when it changes architecture, dependencies, or delivery risk.

## When no agent configuration exists

Do not add one automatically. Infer a local working standard from:

1. Existing package scripts and configuration
2. Similar recently maintained code
3. Existing dependency choices
4. Current directory and module boundaries
5. Test and CI expectations

Fill only genuine gaps with conservative defaults. Do not turn an ordinary feature request into a repository-governance project.
