# Validation Gate Catalog

Select gates by changed behavior and risk. Existing project commands are authoritative. Never invent a command, silently skip a required gate, or run every possible check without regard to cost and relevance.

## Baseline for every lane

- inspect the final diff or changed files;
- verify the requested behavior with the strongest practical targeted method;
- run the most relevant existing automated check;
- report failures, unavailable tools, and unverified areas honestly.

## Common gates

| Change | Select relevant gates |
|---|---|
| Documentation | formatter, link/example validation, docs build |
| UI or styling | lint, typecheck, component/integration test, responsive and visual interaction check |
| Business logic | unit or integration test, typecheck, regression case |
| API or transport | contract/type validation, success and failure paths, integration test |
| State or data flow | transition tests, concurrency/cache behavior, loading/empty/error recovery |
| Database | migration dry run, compatibility, rollback or forward-recovery plan, data verification |
| Authentication or authorization | positive and negative permission tests, secret/privacy review, audit behavior |
| Build or dependency configuration | clean install when warranted, lint, typecheck, tests, production build |
| Deployment | environment validation, build artifact, rollout and recovery checks |
| Architecture boundary | dependency check, representative slice, full relevant suite, architecture review |
| Project constraint structure | artifact presence, factual command check, boundary consistency, explicit skipped-artifact reasons |

## Lane expectations

### Fast

Require targeted checks and diff review. Run broader checks when the project makes them cheap, mandatory, or necessary to catch integration failure.

### Guarded

Require tests for the changed behavior, relevant static checks, integration or UI validation for crossed boundaries, and a broader build/check when the change affects composition.

### Gated

Require the Project Constraint Gate and baseline foundation checks before the representative slice, all relevant domain gates after it, architecture review, and the project's release-level aggregate check before completion.

## Interface verification

When user-visible behavior changes, verify the rendered or running interface if suitable browser, emulator, preview, or application tooling is available. Check the affected viewport and states rather than relying only on source inspection.

If visual verification is unavailable, report that limitation. Do not describe an unseen interface as verified.

## Failing or missing gates

When a required gate fails:

1. determine whether the implementation or environment caused the failure;
2. fix in-scope implementation defects;
3. rerun the narrowest useful check;
4. upgrade the lane if failure reveals wider architectural risk;
5. stop completion claims while a required gate remains failing.

When a gate is unavailable, use the strongest non-destructive alternative and report the residual risk. Do not add a large new toolchain to a legacy project solely to make the checklist look complete.
