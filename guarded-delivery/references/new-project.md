# New Project Delivery

Build constraints from evidence, then validate them in code before scaling. Do not start with a generic architecture template or bulk-generate business pages.

## 1. Discover

Read available requirements, designs, interface contracts, deployment constraints, environment expectations, and acceptance criteria.

Record only when the work is large enough to benefit:

- confirmed scope and core user flows;
- data entities and external boundaries;
- authoritative sources, contradictions, and unknowns;
- operational, compatibility, security, and deployment constraints.

Do not write business implementation during unresolved foundational discovery.

## 2. Classify and decide

Determine product type, expected lifetime and scale, platforms, business domains, data sensitivity, rendering/runtime model, test depth, and deployment target.

Choose the smallest viable technical solution. For each material dependency, identify the current requirement it solves and the maintenance cost it introduces. Explain major choices and rejected alternatives in a lightweight decision record when the choice is durable or expensive to reverse.

## 3. Design boundaries

Define enough architecture to place code before writing it:

- business modules and dependency direction;
- routes or entry points;
- component and service responsibilities;
- local, URL, server, form, and shared client state ownership;
- transport, endpoint, transformation, and validation boundaries;
- error, loading, empty, permission, and recovery behavior;
- styling and testing strategy.

Prefer an architecture document for detail. Do not overload project instructions with design prose.

## 4. Bootstrap reality

Create the smallest runnable skeleton that proves the selected stack:

- dependency installation and development command;
- production build;
- formatting and linting where appropriate;
- type checking where applicable;
- a real test command and minimal test setup;
- environment example and request/error foundation as required;
- CI or an aggregate check when the project warrants it.

Run baseline commands. Do not document commands that do not exist.

## 5. Create provisional project guidance

After the skeleton and commands are real, create a concise provisional `AGENTS.md` using [project-guardrails.md](project-guardrails.md). Mark uncertain architecture as provisional in the architecture document, not as a false project fact.

## 6. Validate one representative slice

Choose one non-trivial vertical slice that exercises the important boundaries. Include the relevant subset of:

- route or user entry;
- business rule and state transition;
- realistic data source or API boundary;
- loading, empty, failure, success, and recovery states;
- reusable UI or service boundary;
- meaningful automated test;
- UI or runtime verification.

Do not select a static placeholder that cannot challenge the architecture. Do not implement the remaining feature list yet.

## 7. Review and ratify

Review module direction, ownership, coupling, duplication, testability, accessibility where relevant, and development friction.

Answer:

1. Which decisions worked?
2. Which decisions created friction?
3. What must change before scaling?
4. Which project instructions are now verified?
5. Can the structure support the next planned slices?

Correct structural issues, rerun required gates, then ratify `AGENTS.md`. Keep implementation freedom inside the validated boundaries.

## 8. Scale by vertical slice

Implement remaining requirements as independently verifiable slices. After each meaningful slice, inspect the diff and run targeted gates. Record a new decision before silently changing an established architecture boundary.

Complete final verification only after all required behavior and release gates pass.
