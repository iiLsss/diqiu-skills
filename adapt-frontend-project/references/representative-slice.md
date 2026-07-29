# Representative vertical slice

Use a representative slice to reduce uncertainty before extending a new pattern across a frontend codebase.

## Choose the slice

Pick one observable user outcome, not a layer or a component inventory. Keep it small enough to complete and review, but make it cross each boundary that is still uncertain:

- a meaningful local, URL, server, or shared-state decision
- one real API, client, schema, or controlled fixture boundary
- existing shared primitives plus feature-level component composition
- a test at the repository's closest applicable level

Reuse an established request, state, test, and styling path whenever evidence shows one. Avoid mock-only architecture, speculative abstractions, and unrelated cleanup.

## Use the result

Treat the slice as evidence rather than a production-wide template by default. Expand only choices that held up under the complete flow; isolate or report choices that remain uncertain.

## Verify the slice

- Exercise the primary success path and the relevant loading, error, or empty state.
- Run the narrowest existing checks that cover the changed boundaries.
- Confirm the feature fits the discovered module, API, and test conventions.
- Record remaining assumptions before using the pattern elsewhere.
