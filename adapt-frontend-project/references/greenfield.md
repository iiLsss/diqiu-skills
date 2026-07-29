# Greenfield frontend workflow

## Select by product constraints

Honor user, organization, hosting, and team constraints first. If choices remain open, select the smallest maintained solution that meets:

- Rendering and SEO requirements
- Client-only versus server/full-stack responsibilities
- Deployment target
- Authentication and data boundaries
- Offline, desktop, extension, embedded, or mobile-web needs
- Team familiarity and expected project lifetime

Verify current official documentation before choosing versions or relying on newly changed framework behavior.

Typical decisions:

- Use a client-focused build tool and router for an SPA, internal tool, desktop shell, extension, or separately deployed frontend.
- Use an established full-stack framework when server rendering, SEO, server routes, streaming, or integrated deployment materially helps.
- Use the team's established Vue, React, Angular, Svelte, or other ecosystem rather than switching for fashion.

## Keep the initial stack minimal

Do not install optional infrastructure in advance.

- Add routing only when real navigation, URLs, deep links, or history are needed.
- Add server-state tooling when caching, invalidation, mutations, retries, or pagination justify it.
- Add global client state only for durable state shared across independent areas.
- Add form tooling for complex validation, dynamic fields, or substantial form state.
- Add a component library only when its accessibility, consistency, or delivery value exceeds its maintenance cost.
- Use one primary styling system.

Avoid installing competing libraries for the same responsibility.

## Establish structure proportional to size

For a small application, prefer a simple layout with clear names. For a multi-feature product, prefer feature-oriented ownership:

```text
src/
  app/
  components/       # unopinionated UI primitives, when needed
  features/
  shared/           # only proven cross-feature code
  styles/
```

Do not pre-create empty directories. Keep feature-private code inside its feature. Expose deliberate public entry points when the repository size warrants them.

## Establish a baseline

Create only applicable foundations:

- Strict static typing appropriate to the ecosystem
- Formatter and linter without overlapping rules
- Unit/component tests and targeted end-to-end tests
- Design tokens and one styling approach
- Accessible primitives for complex interaction
- A single API boundary and error-handling approach
- Package scripts for development, type checking, linting, testing, and building

Prefer a single `check` script when it improves repeatability.

## Build in vertical slices

For a simple requested application, implement it directly with coherent component boundaries. For a larger product:

1. Establish the application shell and routing boundary.
2. Implement one representative feature end to end.
3. Validate architecture, styling, data flow, and testing.
4. Continue feature by feature.

Do not place multiple independent screens, mock data, state machines, and all styling in one entry component.

## Policy files

In adapt mode, create `AGENTS.md`, architecture documentation, or a definition of done only when the user requests repository governance or project initialization explicitly includes it.

In standardize mode, follow [standardize.md](standardize.md). Keep one canonical engineering contract and make agent entry files concise pointers rather than duplicate specifications.
