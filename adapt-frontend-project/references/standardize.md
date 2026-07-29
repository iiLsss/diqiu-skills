# Standardize frontend engineering

Use this workflow only after an explicit request to establish, unify, document, or persist project standards.

## Contents

- Establish scope
- Build an evidence ledger
- Create one canonical contract
- Add thin agent adapters
- Make enforceable rules executable
- Apply by repository type
- Validate

## 1. Establish scope

Confirm from the request and repository:

- Repository, workspace, and packages covered
- Frontend technologies actually in use
- Coding agents the team uses
- Existing CI and required delivery checks
- Whether the task covers governance only or governance plus implementation

Do not turn standardization into framework migration, dependency modernization, or full-codebase cleanup.

## 2. Build an evidence ledger

Classify each proposed rule:

- **Enforced**: backed by configuration, CI, scripts, or generated boundaries
- **Observed**: repeated in maintained code
- **Documented**: stated by an applicable project rule
- **Proposed**: fills a genuine gap
- **Conflicting**: sources disagree

For brownfield repositories, do not present a proposed preference as an existing standard. Resolve or report conflicts that affect architecture, dependencies, or delivery.

## 3. Create one canonical contract

Prefer an existing documentation location. Otherwise create:

```text
docs/engineering/
  architecture.md
  frontend-guidelines.md
  definition-of-done.md
```

Use the templates in `assets/governance/docs/engineering/` as starting points. Replace every placeholder and remove irrelevant sections.

Record:

- Actual stack, package manager, and responsibility boundaries
- Directory and dependency direction
- Component, state, data, styling, type, and testing conventions
- Dependency policy
- Exact development and verification commands
- Known legacy exceptions and migration boundaries

Do not duplicate the full contract across agent-specific files.

## 4. Add thin agent adapters

Create or update only adapters for tools the user or repository places in scope. Common examples:

- Codex: `AGENTS.md`
- Claude: `CLAUDE.md`
- Cursor: `.cursor/rules/engineering.mdc`
- Copilot: `.github/copilot-instructions.md`

Start from `assets/governance/` when compatible with the tool's current format. Verify current tool syntax before creating a format that may have changed.

Each adapter should:

- Point to the canonical engineering documents
- State the applicable path or package scope
- Require existing package scripts for verification
- Preserve any tool-specific instructions that cannot live in the canonical contract

Do not overwrite an existing adapter. Integrate minimally, preserve unrelated instructions, and surface contradictions.

An adapter makes the contract discoverable to that tool; it does not guarantee another tool will load a Codex Skill.

## 5. Make enforceable rules executable

Use the repository's existing stack and package manager. Add or align only applicable mechanisms:

- Formatter for deterministic formatting
- Linter for defects and maintainable complexity
- Strict typing appropriate to the current codebase
- Style linting only for styling systems that benefit from it
- Unit, component, and targeted end-to-end tests
- A repeatable `check` command
- CI execution of agreed required checks

Do not add overlapping tools. Do not enable a strict rule that produces uncontrolled historical failures. For legacy debt, choose one:

- Baseline existing violations and enforce new code
- Scope the gate to affected packages or files
- Document a staged migration with measurable exit criteria

Never claim documentation alone enforces a rule.

## 6. Apply by repository type

### Greenfield

Create the smallest useful contract and quality gates before multiple features accumulate. Avoid optional libraries and empty directory scaffolding.

### Brownfield

Derive the contract from current evidence. Preserve working architecture and public behavior. Do not reformat or refactor the entire repository merely to make it match the new documents.

### Hybrid

Keep workspace-wide policy canonical at the workspace level. Add package-specific supplements only where the package genuinely differs.

## 7. Validate

- Confirm every adapter resolves to an existing canonical document.
- Confirm documented commands exist and run as stated.
- Run applicable checks or record existing failures precisely.
- Check that no placeholder remains in generated documents.
- Review the diff for duplicated or contradictory rules.

Report which rules are enforced, observed, proposed, or still blocked by legacy debt.
