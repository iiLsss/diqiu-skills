---
name: guarded-delivery
description: Apply risk-adaptive engineering delivery to new software projects and changes in existing repositories. Use for project creation, feature implementation, bug fixes, refactors, architecture changes, or other coding work that must balance agent autonomy with project-specific guardrails, staged delivery, and real verification. Classify work into Fast, Guarded, or Gated execution; establish or refine AGENTS.md when appropriate; validate a representative feature before scaling new architecture; and preserve existing conventions during maintenance.
---

# Guarded Delivery

Deliver software with the least process that safely fits the change. Constrain project boundaries, irreversible decisions, and completion claims; leave implementation choices inside validated boundaries to the agent.

## Load the relevant guidance

1. Read [risk-routing.md](references/risk-routing.md) completely for every task.
2. Read exactly one project-mode guide:
   - [new-project.md](references/new-project.md) for a new repository, an unestablished application, or a genuinely new architecture.
   - [existing-project.md](references/existing-project.md) for changes within an established repository.
3. Read [project-guardrails.md](references/project-guardrails.md) before creating or changing `AGENTS.md`, `CLAUDE.md`, architecture documentation, or nested project instructions.
4. Read [gate-catalog.md](references/gate-catalog.md) when selecting or executing validation.

Do not load irrelevant references merely because they are available.

## Establish the execution contract

Before material edits:

1. Read applicable agent instructions, requirements, designs, interfaces, deployment constraints, manifests, build configuration, tests, and the nearest maintained implementation.
2. Determine:
   - project mode: new or existing;
   - delivery lane: Fast, Guarded, or Gated;
   - authoritative sources and unresolved contradictions;
   - required validation gates;
   - whether a durable project constraint must be created or changed.
3. State the classification and evidence compactly. For Fast work, one sentence is enough. For Guarded or Gated work, state the boundaries and gates before implementation.

Do not ask for confirmation merely to restate an obvious, reversible choice. Follow the escalation rules in `risk-routing.md`.

## Preserve a minimum baseline

Apply these rules in every lane:

- Preserve user changes and avoid unrelated refactors.
- Prefer established, maintained repository patterns over generic preferences.
- Add complexity and production dependencies only for confirmed requirements.
- Keep business rules, data access, state, and presentation in defensible ownership boundaries.
- Treat file length as a review signal, not a mechanical decomposition rule.
- Never hide failures with disabled checks, weakened tests, broad suppressions, empty error handling, or unjustified assertions.
- Never claim a command, test, build, migration, or visual check passed unless it actually ran and passed.
- Reclassify the task immediately when new evidence expands risk or blast radius.

## Execute by lane

### Fast

Make the smallest coherent change using an established pattern. Run targeted validation, inspect the diff, and report any unverified behavior. Do not create planning or architecture artifacts solely to satisfy ceremony.

### Guarded

Define the change boundary, state ownership, data flow, and verification approach before implementation. Deliver a complete vertical slice, run relevant gates, and review the result for duplication, coupling, and unintended scope.

### Gated

Complete discovery and record the material decision before scaling implementation. Establish a runnable foundation when missing, validate new architecture with one representative vertical slice, review the architecture, and only then expand to remaining work. Obtain user direction only for the decision classes that require it.

## Maintain durable project guidance

Keep workflow policy in this skill and repository facts in project instructions.

- Generate project guidance from verified repository reality, never by blindly copying a framework template.
- Keep `AGENTS.md` concise and factual.
- Record detailed architecture or major decisions outside `AGENTS.md`.
- Update durable guidance only when commands, boundaries, stable patterns, or recurring corrections change.
- Do not rewrite existing project guidance wholesale during ordinary feature work.

## Close the task

Report:

- selected project mode and delivery lane;
- material files or artifacts changed;
- validation that ran and its result;
- skipped or unavailable validation;
- unresolved risks and decisions;
- whether the evidence permits the next phase.

Do not declare project completion before all required gates for the selected lane pass.
