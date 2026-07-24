# Existing Project Delivery

Extend the repository without imposing an unrelated ideal architecture. Current maintained code, real configuration, tests, and project instructions outrank generic preferences.

## Inspect before editing

Read applicable agent instructions and identify:

- framework and runtime versions;
- package manager and workspace layout;
- build, test, lint, formatting, type, and UI verification commands;
- component, state, request, styling, error, and test patterns;
- deployment and compatibility constraints;
- the closest recent maintained implementation.

Distinguish an intentional pattern from legacy residue. Prefer a recent stable implementation that is still referenced, tested, and maintained.

## Define the change boundary

Summarize:

- requested behavior and acceptance condition;
- owning module and affected consumers;
- contracts that must remain stable;
- the existing pattern to extend;
- the minimum engineering capability missing for this request;
- selected lane and required gates.

Do not upgrade frameworks, replace libraries, introduce a second equivalent system, or reorganize unrelated directories unless the request and risk classification justify it.

## Implement proportionally

For Fast work, make the smallest coherent change and targeted test.

For Guarded work, implement a complete vertical slice through the existing layers. Define state and data ownership before adding new shared state or abstractions.

For Gated work, preserve current public behavior while discovering constraints, record the material decision, prove the change through a representative path, and scale only after validation.

When a required change would enlarge a mixed-responsibility file, extract only the smallest complete responsibility needed for the request. Do not mechanically decompose the entire legacy area.

## Handle missing project guidance

- Do not create `AGENTS.md` merely as ceremony for a trivial Fast change.
- For Guarded or Gated work, create concise project guidance when it is missing and the discovered facts will materially improve future maintenance.
- Update existing guidance only when it is inaccurate, a stable boundary changed, a real command changed, or repeated correction should persist.
- Preserve valid user-authored rules and resolve conflicts explicitly.

## Verify in the real project

Use repository-defined commands and the relevant entries in [gate-catalog.md](gate-catalog.md). Add only the minimum missing test or check required to validate the change.

If the legacy project cannot run a relevant check, do not initiate a broad tooling migration by default. Report the gap, perform the strongest available targeted validation, and escalate only when the missing foundation makes the requested work unsafe.

Finish by reviewing the diff for accidental modernization, unrelated formatting, dependency churn, and public behavior changes.
