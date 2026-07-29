#!/usr/bin/env bash
set -euo pipefail

input_path="${1:-.}"

if [[ ! -e "$input_path" ]]; then
  echo "Path does not exist: $input_path" >&2
  exit 2
fi

if [[ -f "$input_path" ]]; then
  input_path="$(dirname "$input_path")"
fi

if repo_root="$(git -C "$input_path" rev-parse --show-toplevel 2>/dev/null)"; then
  :
else
  repo_root="$(cd "$input_path" && pwd -P)"
fi

echo "root: $repo_root"

print_matches() {
  local heading="$1"
  shift
  echo
  echo "[$heading]"
  find "$repo_root" \
    \( -name node_modules -o -name vendor -o -name dist -o -name build -o -name coverage -o -name .git -o -name .next -o -name .turbo \) -prune -o \
    \( "$@" \) -type f -print 2>/dev/null |
    while IFS= read -r match; do
      printf '%s\n' "${match#"$repo_root"/}"
    done |
    LC_ALL=C sort
}

print_matches "agent instructions" \
  -name AGENTS.md -o \
  -name AGENTS.override.md -o \
  -name CLAUDE.md -o \
  -path '*/.claude/rules/*' -o \
  -path '*/.cursor/rules/*' -o \
  -name .cursorrules -o \
  -name '*.mdc' -o \
  -name copilot-instructions.md -o \
  -name '*.instructions.md' -o \
  -name .clinerules -o \
  -path '*/.clinerules/*' -o \
  -path '*/.roo/rules/*' -o \
  -path '*/.roo/rules-*/*' -o \
  -name .windsurfrules -o \
  -path '*/.windsurf/rules/*' -o \
  -path '*/.continue/rules/*'

print_matches "toolchain and quality configuration" \
  -name package.json -o \
  -name pnpm-workspace.yaml -o \
  -name pnpm-lock.yaml -o \
  -name yarn.lock -o \
  -name package-lock.json -o \
  -name bun.lock -o \
  -name bun.lockb -o \
  -name turbo.json -o \
  -name nx.json -o \
  -name lerna.json -o \
  -name tsconfig.json -o \
  -name jsconfig.json -o \
  -name 'vite.config.*' -o \
  -name 'next.config.*' -o \
  -name 'nuxt.config.*' -o \
  -name 'angular.json' -o \
  -name 'svelte.config.*' -o \
  -name 'eslint.config.*' -o \
  -name '.eslintrc*' -o \
  -name 'prettier.config.*' -o \
  -name '.prettierrc*' -o \
  -name 'stylelint.config.*' -o \
  -name 'biome.json*' -o \
  -name '.oxlintrc.json' -o \
  -name 'vitest.config.*' -o \
  -name 'jest.config.*' -o \
  -name 'playwright.config.*' -o \
  -name 'cypress.config.*'

print_matches "engineering governance" \
  -path '*/docs/engineering/*' -o \
  -name frontend-guidelines.md -o \
  -name definition-of-done.md -o \
  -name design-system.md -o \
  -path '*/.github/workflows/*.yml' -o \
  -path '*/.github/workflows/*.yaml'
