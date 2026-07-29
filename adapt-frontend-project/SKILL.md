---
name: adapt-frontend-project
description: Explicit-only workflow for discovering and adapting unfamiliar frontend repositories before high-uncertainty work. Use via $adapt-frontend-project when taking over an unfamiliar codebase, initializing or standardizing missing frontend foundations, adding a representative feature across state, requests, components, and tests, or validating an engineering approach with a vertical slice. Do not use for routine pages, single-file edits, style tweaks, small scoped bugs, or features with a clear existing pattern.
---

# Adapt Frontend Project

Use only through `$adapt-frontend-project` when the project or engineering approach is genuinely uncertain.

## Explore existing reality

1. Locate the repository, workspace, package, and path in scope.
2. Run `scripts/scan-project-context.sh <path>` when shell access is available.
3. Read applicable native instructions, manifests, lockfiles, scripts, CI, and one or two maintained analogous modules.
4. Record an evidence profile: fixed constraints, observed conventions, unknowns, and genuinely open choices.

Read [instruction-discovery.md](references/instruction-discovery.md) and [brownfield.md](references/brownfield.md) for an existing repository. For a new package, read [greenfield.md](references/greenfield.md). Read [standardize.md](references/standardize.md) only for an explicit governance request.

## Validate with a representative slice

1. Define the smallest user outcome that crosses the uncertain state, request, component, and test boundaries.
2. Implement it by analogy with the discovered conventions; keep other architectural choices open until the slice provides evidence.
3. Run the narrowest relevant checks and inspect the complete user flow.

Read [representative-slice.md](references/representative-slice.md) before choosing or evaluating the slice.

## Complete when

- State the discovered constraints, conventions, open choices, and material conflicts.
- Demonstrate that the representative slice works through its intended boundaries.
- Report checks actually run, assumptions still unverified, and the safe next expansion.
