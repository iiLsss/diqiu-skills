# Frontend Engineering Guidelines

## Source of truth

Executable configuration and package scripts define enforceable behavior. This document defines architectural and maintainability expectations not fully expressible in tooling.

## Components

- Keep entry files focused on providers, routing, and top-level composition.
- Keep page components focused on page-level orchestration.
- Extract components at coherent business, interaction, or reuse boundaries.
- Keep static data, schemas, and nontrivial transformations out of render blocks.
- Treat approximately 300 lines for a page, 200 for a business component, 150 for a hook, and 50 for a function as investigation signals, not mechanical limits.
- Do not compress code or create meaningless wrappers to satisfy metrics.

## State and data

[Document the project's actual local, URL, remote, and shared-state conventions.]

[Document the API client, schemas, error handling, cache, and mutation conventions.]

## Styling and design system

[Document the single primary styling approach, token source, component primitives, responsive behavior, and accessibility expectations.]

## Types and errors

[Document strictness, unsafe escape policy, generated types, validation boundaries, and error handling.]

## Dependencies

- Prefer existing dependencies and platform capabilities.
- Do not introduce a second solution for an existing responsibility.
- Explain the problem, alternatives, runtime or bundle impact, and maintenance implications before adding a production dependency.

## Tests

[Document what requires unit, component, integration, end-to-end, and visual verification.]

## Exceptions

[Document scoped exceptions with an owner or removal condition. Remove this section when none exist.]
