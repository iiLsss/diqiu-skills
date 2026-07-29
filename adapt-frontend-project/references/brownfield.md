# Brownfield frontend workflow

## Preserve before improving

Treat the repository as an existing contract. A business iteration does not authorize modernization, dependency upgrades, framework migration, styling replacement, directory reorganization, or broad cleanup.

## Build an evidence-based project profile

Record internally:

- Framework, runtime, package manager, and locked versions
- Workspace/package boundary in scope
- Build, lint, typecheck, test, and development commands
- Routing and application composition
- Component and design-system sources
- Styling and token strategy
- Local, URL, server, and shared-state patterns
- API client, error handling, schemas, and generated types
- Test placement, mocking, and CI expectations
- Applicable agent or repository instructions

Infer from configuration and representative code. Do not infer the entire architecture from `package.json` alone.

## Implement by analogy

Find the closest current feature and follow its:

- Folder placement and naming
- Import and export style
- Component composition
- State and data ownership
- API and error handling
- Styling and design tokens
- Localization and accessibility
- Tests and fixtures

Prefer a recently maintained, clearly working example over an old or exceptional module.

## Handle weak or inconsistent legacy patterns

Do not reproduce a clearly unsafe defect solely for consistency. Make the smallest safe adaptation:

- Preserve public interfaces and visible behavior.
- Contain improved code inside the changed module when possible.
- Avoid creating a second architecture across the repository.
- Explain a material inconsistency or migration boundary.

Examples of safety exceptions include exposed secrets, injection risks, broken authentication assumptions, inaccessible critical interactions, and provable data corruption.

## Dependencies and tooling

- Use installed libraries before adding another.
- Match the existing package manager and lockfile.
- Do not change major versions during feature work.
- Do not replace a working lint, test, state, request, form, or styling solution.
- Request or obtain explicit authorization before adding a production dependency when the task does not already imply it.

## No agent configuration

If no Cursor, Claude, Codex, or other agent configuration exists:

1. Use package scripts and executable configuration as the primary standard.
2. Follow the closest analogous implementation.
3. Preserve naming and module boundaries.
4. Apply general quality rules only where the repository is silent.

In adapt mode, do not add agent configuration as a side effect of business work.

In standardize mode, derive a canonical contract from the evidence above and add only the agent adapters explicitly in scope. Do not describe inferred preferences as established rules without labeling them.

## Scope refactoring

Refactor only when required to implement safely, when explicitly requested, or when a local structural obstacle blocks the change. Keep refactoring behavior-preserving and separately reviewable where practical.

If a file is large but the requested change is localized and safe, do not automatically decompose the entire file. If the change would worsen a concentrated responsibility, extract the smallest coherent unit needed.

## Verification

Run relevant existing checks. Start with the affected package and targeted tests, then expand according to risk. In a monorepo, do not run an expensive repository-wide suite unless required by repository policy, the change's impact, or the user.
