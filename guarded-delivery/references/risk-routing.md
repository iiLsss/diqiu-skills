# Risk Routing

Choose the least restrictive lane that contains the real risk. Classification is evidence-based and can only remain valid while its assumptions remain true.

## Hard triggers

Use the Gated lane when work materially affects any of the following:

- framework, runtime, package manager, core state/data/request system, or deployment topology;
- authentication, authorization, secrets, privacy, payments, or other security-sensitive behavior;
- irreversible data change, database migration, destructive operation, or recovery strategy;
- public API, shared package contract, compatibility guarantee, or external integration contract;
- a new project, a new business domain with no established pattern, or an unproven architecture;
- production behavior that cannot be verified with the repository's current foundation.

A small diff does not reduce these risks.

## Fast lane

Choose Fast only when all material conditions hold:

- the requirement and acceptance condition are clear;
- the change is local, reversible, and low blast radius;
- a recent maintained implementation provides a clear precedent;
- no hard trigger applies;
- no new production dependency or architectural boundary is introduced;
- targeted validation can provide meaningful evidence.

Typical examples include a focused bug fix, copy or styling adjustment, small test change, or a field added through an established flow.

## Guarded lane

Choose Guarded when no hard trigger applies but one or more conditions hold:

- the change crosses files, layers, routes, or modules;
- new business behavior, state ownership, or request flow must be designed;
- multiple reasonable implementations exist;
- no clear maintained precedent exists;
- a non-core production dependency may be justified;
- the change would further mix responsibilities in an already complex file;
- test coverage or local verification is incomplete.

## Decision authority

Act directly when the choice is local, reversible, follows project precedent, and does not change a public or durable boundary.

Explain and record the basis, then proceed when the requirement is clear but the choice changes a durable internal boundary, adds a justified non-core dependency, or creates a stable shared pattern.

Request user direction before proceeding when:

- product behavior requires a business trade-off not resolved by authoritative sources;
- the action is destructive or materially irreversible;
- compatibility, security, cost, or data-retention trade-offs cannot be inferred safely;
- the proposed solution materially expands the requested scope;
- two viable approaches have meaningfully different long-term consequences and the repository establishes neither.

Do not turn explanation into a permission request when authority is already clear.

## Dynamic reclassification

Re-evaluate after discovery, after the first failing validation, and whenever the implementation crosses an assumed boundary.

Upgrade immediately when new evidence reveals a hard trigger or wider blast radius. Pause only the affected implementation work, preserve useful findings, and state the revised gates.

Downgrade only when evidence disproves the risk that caused the higher lane. State the reason; never downgrade to bypass a failing gate.

## Compact declaration

Use a concise declaration such as:

```text
Mode: existing project / Guarded
Evidence: adds shared server state across two routes using the existing query layer
Boundaries: no new dependency, API contract unchanged
Gates: targeted tests, typecheck, lint, build, UI verification
```
