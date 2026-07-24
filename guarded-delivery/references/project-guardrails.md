# Project Guardrails

Store verified repository facts and durable boundaries in project instructions. Store reusable delivery workflow in the skill, detailed architecture in documentation, and objective enforcement in scripts or CI.

## Canonical project instruction

Use root `AGENTS.md` as the canonical cross-agent engineering contract when creating new shared guidance.

If Claude Code compatibility is requested or already used, create a thin `CLAUDE.md` adapter instead of duplicating rules:

```md
@AGENTS.md

## Claude Code

Add only Claude-specific instructions here when required.
```

Do not replace an established project instruction strategy without evidence that migration is in scope.

## Include only verified content

Keep the root guidance concise and cover only relevant sections:

- project purpose and primary user flow;
- actual stack, versions, package manager, and deployment target;
- important source directories and ownership;
- module dependency direction and prohibited cross-boundary imports;
- state, data access, validation, error, and styling rules;
- dependency and architecture-decision policy;
- real validation commands;
- definition of done and prohibited failure-hiding behavior.

Never list intended commands as though they already work. Never paste generic framework advice that the repository does not need.

## Separate detail by purpose

Use:

- `AGENTS.md` for short, always-relevant facts and boundaries;
- `docs/architecture.md` for diagrams, flows, ownership tables, and design rationale;
- `docs/decisions/` for durable choices with meaningful alternatives;
- nested `AGENTS.md` files only when a subtree has genuinely different commands or rules;
- project scripts and CI for deterministic enforcement.

Do not split instructions into extra files merely for appearance. Split when scope or loading relevance differs.

## Write outcome-oriented rules

Prefer:

```text
Server state belongs to the established query layer; do not duplicate it into
global client state without a documented cross-page requirement.
```

Avoid:

```text
Every feature must contain exactly one store, three hooks, and four components.
```

Constrain interfaces and ownership while allowing implementation freedom inside the boundary.

## File responsibility guidance

Use file length only to trigger review. Review when a file mixes independent business responsibilities, transport, state, rules, and complex rendering; when unrelated changes repeatedly collide; or when meaningful testing requires the whole feature.

Split by responsibility and change boundary, not by an arbitrary number.

## Ratify and evolve

For a new architecture, treat guidance as provisional until a representative feature passes its gates. Then remove false assumptions and ratify the working boundaries.

Update guidance when:

- commands, directories, ownership, or architecture boundaries change;
- a new shared pattern becomes stable;
- repeated review feedback reveals a missing rule;
- written guidance conflicts with verified repository behavior.

Do not update it for one-off implementation details. Prefer removing obsolete rules over accumulating exceptions.
