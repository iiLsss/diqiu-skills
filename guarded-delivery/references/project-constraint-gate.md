# Project Constraint Gate

Make project constraints an explicit deliverable when architecture is new or durable repository guidance is missing. Do not reduce this gate to a verbal recommendation.

## Assess constraint status

Classify the current repository:

- **Absent**: no usable project instructions or architecture boundaries exist.
- **Provisional**: guidance exists but has not been validated by runnable code.
- **Usable**: guidance matches the repository, commands are real, and boundaries are sufficient for the current change.
- **Stale**: commands, directories, dependencies, or architecture contradict the guidance.

State the status and planned action before material implementation.

## Recommended artifact structure

Select only applicable artifacts:

```text
AGENTS.md                         # Required shared repository contract
CLAUDE.md                         # Thin @AGENTS.md adapter when Claude is in scope
PLAN.md                           # Multi-phase state and gates when work is long-running
docs/
├── architecture.md              # Boundaries, ownership, dependency direction, flows
└── decisions/
    └── 0001-technical-stack.md   # Material decision with real alternatives
package/build scripts             # Real lint, type, test, build, and aggregate checks
CI configuration                  # Enforce stable project checks when appropriate
```

Equivalent filenames and existing repository conventions are valid. Do not create parallel documentation systems.

## Artifact selection

| Situation | Required action |
|---|---|
| New non-trivial project | Create `AGENTS.md`, architecture guidance, real checks, and a phased plan when work spans phases |
| New architecture in an existing repository | Update project instructions and architecture; record the material decision |
| Existing Guarded change with missing guidance | Create the smallest durable guidance needed for the affected boundary |
| Existing Gated change | Make constraint repair or creation an explicit phase before scaling |
| Fast local change | Do not create artifacts solely for ceremony |
| Claude compatibility requested or detected | Add a thin `CLAUDE.md` adapter; do not duplicate `AGENTS.md` |

Create an ADR only when alternatives and long-term consequences are meaningful. Create `PLAN.md` only when persistent phase state is useful. Add CI only when the project maturity and delivery environment justify it.

## Execution behavior

During implementation-capable work, create or update the selected artifacts directly. Do not stop at “recommended structure” unless:

- the user requested plan-only or read-only work;
- filesystem access prevents writing;
- an unresolved user decision determines the structure;
- existing project policy forbids the proposed artifact.

In plan-only work, list the exact artifact set and place the Project Constraint Gate before representative implementation.

Use a declaration such as:

```text
Project constraints: absent
Action: create AGENTS.md, docs/architecture.md, technical-stack ADR, PLAN.md,
and real check commands; add CLAUDE.md because cross-agent use is required
Constraint gate: must pass before representative feature implementation
```

## Exit criteria

Pass the gate only when:

- `AGENTS.md` records verified stack, directories, boundaries, dependency policy, real commands, and definition of done;
- architecture documentation places major responsibilities before bulk implementation;
- every recorded command exists and baseline checks run successfully, or any environmental limitation is explicit;
- material decisions are recorded where required;
- the phase plan names its gates when persistent planning is required;
- optional artifacts are either present or explicitly skipped with a reason;
- the agent reports that the representative-feature phase is now allowed.

After the representative slice, review and ratify the provisional constraints before bulk implementation.
